<?php

namespace App\Services;

use App\Models\Invoice;
use App\Models\FinancialTransaction;
use App\Models\Payment;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class FinancialService
{
    /**
     * Generate a new Invoice for a user.
     */
    public function createInvoice(User $user, string $type, float $amount, string $dueDate, array $items = [])
    {
        return DB::transaction(function () use ($user, $type, $amount, $dueDate, $items) {
            // 1. Create Invoice
            $invoice = Invoice::create([
                'user_id' => $user->id,
                'reference' => 'INV-' . date('Y') . '-' . strtoupper(Str::random(6)),
                'type' => $type,
                'amount' => $amount,
                'due_date' => $dueDate,
                'status' => 'pending',
                'items' => $items
            ]);

            // 2. Log Transaction (Debit)
            $this->logTransaction(
                $user,
                'charge',
                -$amount,
                "Invoice generated: {$type} ({$invoice->reference})",
                $invoice->id
            );

            // 3. Update User Financial Status if needed (e.g. if instant debt affects status)
            // For now, status update is done by the daily job.

            return $invoice;
        });
    }

    /**
     * Process a Payment and update Invoice/Wallet.
     */
    public function processPayment(Payment $payment)
    {
        return DB::transaction(function () use ($payment) {
            $user = $payment->user;
            $amount = $payment->amount;

            // 1. Mark Payment as Paid (if not already)
            if ($payment->status !== 'completed') {
                $payment->update(['status' => 'completed']);
            }

            // 2. Log Transaction (Credit)
            $this->logTransaction(
                $user,
                'payment',
                $amount,
                "Payment received via {$payment->method}",
                null,
                $payment->id
            );

            // 3. Distribute payment to pending invoices (FIFO)
            $pendingInvoices = $user->invoices()
                ->whereIn('status', ['pending', 'partial', 'overdue'])
                ->orderBy('due_date', 'asc')
                ->get();

            $remainingAmount = $amount;

            foreach ($pendingInvoices as $invoice) {
                if ($remainingAmount <= 0) break;

                // Calculate how much is still owed on this invoice
                // Logic: Invoice Amount + Penalty - (Already Paid?) 
                // Currently simplified: We assume invoice status tells us.
                // Better approach: Check transactions linked to this invoice? 
                // For MVP v1.2.5, we'll try to pay off full invoice amount.

                $totalToPay = $invoice->amount + $invoice->penalty_amount;

                // If we want partial payments, we need a column 'paid_amount' on invoices or sum transactions.
                // Let's assume for now we pay fully if possible.

                if ($remainingAmount >= $totalToPay) {
                    $invoice->update(['status' => 'paid']);
                    $remainingAmount -= $totalToPay;
                    // Log allocation? Maybe detailed transaction later.
                } else {
                    // Partial payment
                    $invoice->update(['status' => 'partial']);
                    // In a real system we would store the partial amount paid on the invoice.
                    // For now, wallet balance covers the math.
                    $remainingAmount = 0;
                }
            }

            // 4. Update Financial Status
            $this->updateUserFinancialStatus($user);

            return $user->fresh();
        });
    }

    /**
     * Apply 15% Penalty to overdue invoices.
     */
    public function applyPenalty(Invoice $invoice)
    {
        if ($invoice->penalty_applied) return;

        return DB::transaction(function () use ($invoice) {
            $penaltyAmount = $invoice->amount * 0.15; // 15%

            $invoice->update([
                'penalty_applied' => true,
                'penalty_amount' => $penaltyAmount,
                // Do not change status from overdue
            ]);

            // Log Penalty Transaction
            $this->logTransaction(
                $invoice->user,
                'penalty',
                -$penaltyAmount,
                "Late payment penalty (15%) for {$invoice->reference}",
                $invoice->id
            );

            return $invoice;
        });
    }

    /**
     * Log a financial transaction and update wallet balance.
     */
    private function logTransaction(User $user, string $type, float $amount, string $description, ?int $invoiceId = null, ?int $paymentId = null)
    {
        $newBalance = $user->wallet_balance + $amount;

        $user->update(['wallet_balance' => $newBalance]);

        return FinancialTransaction::create([
            'user_id' => $user->id,
            'invoice_id' => $invoiceId,
            'payment_id' => $paymentId,
            'type' => $type,
            'amount' => $amount,
            'balance_after' => $newBalance,
            'description' => $description
        ]);
    }

    /**
     * Recalculate and update user financial status.
     */
    public function updateUserFinancialStatus(User $user)
    {
        // If user has any overdue invoice > 30 days (example) -> Blocked
        // If user has any overdue invoice -> Overdue
        // Else -> Active

        $hasOverdue = $user->invoices()->where('status', 'overdue')->exists();

        // Check for 'Blocked' condition (e.g. overdue by 30 days)
        $hasBlocked = $user->invoices()
            ->where('status', 'overdue')
            ->where('due_date', '<', Carbon::now()->subDays(30))
            ->exists();

        $status = 'active';
        if ($hasBlocked) $status = 'blocked';
        elseif ($hasOverdue) $status = 'overdue';

        $user->update(['financial_status' => $status]);
    }
}
