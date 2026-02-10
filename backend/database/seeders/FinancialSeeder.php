<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Services\FinancialService;
use Carbon\Carbon;

class FinancialSeeder extends Seeder
{
    public function run(FinancialService $financialService): void
    {
        $user = User::find(1); // Assuming User ID 1 is our main test student

        if (!$user) {
            $this->command->error("User ID 1 not found. Please run DatabaseSeeder first.");
            return;
        }

        $this->command->info("Seeding financials for User: {$user->name}");

        // 1. Enrollment Fee (Paid)
        $invoice1 = $financialService->createInvoice(
            $user,
            'enrollment',
            5000.00,
            Carbon::now()->subMonths(2)->format('Y-m-d'),
            ['desc' => 'Taxa de Inscrição 2026']
        );
        // Simulate payment
        $user->update(['wallet_balance' => 5000.00]); // Add funds
        // Manual payment simulation for seeding simplicity (or use processPayment with a mock Payment model)
        // Let's use direct DB manipulation for speed in seeder for "history"
        $invoice1->update(['status' => 'paid']);
        $user->financialTransactions()->create([
            'type' => 'payment',
            'amount' => 5000.00,
            'balance_after' => 0,
            'description' => 'Pagamento Inscrição (Simulado)',
            'payment_id' => null
        ]);


        // 2. February Tuition (Paid)
        $invoice2 = $financialService->createInvoice(
            $user,
            'tuition',
            4500.00,
            Carbon::now()->subMonth()->setDay(10)->format('Y-m-d'),
            ['desc' => 'Mensalidade Fevereiro/2026']
        );
        $invoice2->update(['status' => 'paid']);
        $user->financialTransactions()->create([
            'type' => 'payment',
            'amount' => 4500.00,
            'balance_after' => 0,
            'description' => 'Pagamento Mensalidade Fev (Simulado)'
        ]);


        // 3. March Tuition (Pending - Due Soon)
        $financialService->createInvoice(
            $user,
            'tuition',
            4500.00,
            Carbon::now()->addDays(5)->format('Y-m-d'), // Due in 5 days
            ['desc' => 'Mensalidade Março/2026']
        );

        // 4. Old Unpaid Fee (To test Penalty flow)
        // create an invoice that is 8 days overdue
        $item = $financialService->createInvoice(
            $user,
            'exam_fee',
            1000.00,
            Carbon::now()->subDays(8)->format('Y-m-d'),
            ['desc' => 'Taxa de Exame Atrasada']
        );
        // Manually set status to 'pending' so the command can pick it up and mark it overdue -> penalty
        // Actually, createInvoice sets it to pending. 
        // We want to test the COMMAND logic.
        // So we leave it as pending with old date.

        $this->command->info("Financial data seeded!");
    }
}
