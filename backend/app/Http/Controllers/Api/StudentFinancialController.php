<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Invoice;

class StudentFinancialController extends Controller
{
    /**
     * Get financial summary for the authenticated student.
     */
    public function summary(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        if ($user) {
            $user->refresh(); // Force reload from DB to get latest wallet_balance
        }

        // 1. Total Due (Sum of pending/partial/overdue invoices + penalties)
        $totalDue = $user->invoices()
            ->whereIn('status', ['pending', 'partial', 'overdue'])
            ->get()
            ->sum(function ($invoice) {
                return $invoice->amount + $invoice->penalty_amount; // - paid_amount if partial logic implemented
            });

        // 2. Next Due Date
        $nextDue = $user->invoices()
            ->whereIn('status', ['pending', 'partial'])
            ->orderBy('due_date', 'asc')
            ->first();

        // 3. Last Activity (Invoice or Payment)
        $lastTransaction = $user->financialTransactions()
            ->orderBy('created_at', 'desc')
            ->first();

        // 4. Status
        $status = $user->financial_status;

        // 5. Penalty Total
        $penaltyTotal = $user->invoices()
            ->whereIn('status', ['pending', 'partial', 'overdue'])
            ->sum('penalty_amount');

        $response = [
            'balance' => $totalDue, // Current Debt
            'penalty_total' => $penaltyTotal, // Specifically fines
            'total_paid' => $user->financialTransactions()->where('type', 'payment')->sum('amount'),
            'total_due' => $totalDue,
            'next_due_date' => $nextDue ? $nextDue->due_date->format('Y-m-d') : null,
            'days_remaining' => $nextDue ? (int) now()->startOfDay()->diffInDays($nextDue->due_date->startOfDay(), false) : null,
            'currency' => 'MZN',
            'status' => $status,
            'student_id' => $user->student_code ?? 'N/A',
            'student_name' => $user->name,
            'photo_url' => $user->profile_photo,
            'wallet_balance' => $user->wallet_balance
        ];

        return response()->json($response);
    }

    /**
     * Get list of invoices.
     */
    public function invoices(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $invoices = $user->invoices()->orderBy('due_date', 'desc')->get();
        return response()->json($invoices);
    }

    /**
     * Get ledger transactions.
     */
    public function transactions(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $transactions = $user->financialTransactions()->orderBy('created_at', 'desc')->get();
        return response()->json($transactions);
    }
}
