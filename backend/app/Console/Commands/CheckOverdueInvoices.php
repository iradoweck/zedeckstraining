<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Invoice;
use App\Services\FinancialService;
use App\Models\User;
use Carbon\Carbon;

class CheckOverdueInvoices extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'financial:check-overdue';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check for overdue invoices, apply penalties, and update user status.';

    protected $financialService;

    public function __construct(FinancialService $financialService)
    {
        parent::__construct();
        $this->financialService = $financialService;
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting financial check...');

        // 1. Find Overdue Invoices
        $overdueInvoices = Invoice::where('status', 'pending')
            ->where('due_date', '<', Carbon::today())
            ->get();

        $this->info("Found {$overdueInvoices->count()} invoices becoming overdue.");

        foreach ($overdueInvoices as $invoice) {
            $invoice->update(['status' => 'overdue']);
            $this->info("Invoice #{$invoice->reference} marked as OVERDUE.");
        }

        // 2. Apply Penalties (7 days late)
        $penalizableInvoices = Invoice::where('status', 'overdue')
            ->where('penalty_applied', false)
            ->where('due_date', '<=', Carbon::today()->subDays(7))
            ->get();

        $this->info("Found {$penalizableInvoices->count()} invoices eligible for penalty.");

        foreach ($penalizableInvoices as $invoice) {
            $this->financialService->applyPenalty($invoice);
            $this->warn("Applied 15% penalty to Invoice #{$invoice->reference}.");
        }

        // 3. Update User Status (Block if needed)
        // Ensure we check all users who have at least one invoice
        $usersToCheck = User::whereHas('invoices')->get();

        foreach ($usersToCheck as $user) {
            $this->financialService->updateUserFinancialStatus($user);
            if ($user->financial_status === 'blocked') {
                $this->error("User {$user->name} ({$user->student_code}) is BLOCKED.");
            }
        }

        $this->info('Financial check completed successfully.');
    }
}
