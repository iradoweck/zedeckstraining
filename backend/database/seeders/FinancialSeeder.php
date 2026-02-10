<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Services\FinancialService;
use Carbon\Carbon;
use App\Models\FinancialTransaction;

class FinancialSeeder extends Seeder
{
    public function run(FinancialService $financialService): void
    {
        // Find the specific student user
        $user = User::where('email', 'aluno@zedecks.com')->first();

        if (!$user) {
            $this->command->error("User 'aluno@zedecks.com' not found. Please run DatabaseSeeder first.");
            return;
        }

        $this->command->info("Seeding financials for User: {$user->name}");

        // Reset wallet for clean state simulation (though migrate:fresh does this)
        $user->update(['wallet_balance' => 0]);

        // TIMELINE
        // 1. 2 Months ago: Enrollment (Charge -5000 -> Pay +5000 -> Bal 0)
        // 2. 1 Month ago: Feb Tuition (Charge -4500 -> Pay +4500 -> Bal 0)
        // 3. 15 Days ago: Exam Fee (Charge -1000 -> Bal -1000)
        // 4. 5 Days ago: March Tuition (Charge -4500 -> Bal -5500)

        // 1. Enrollment
        $date1 = Carbon::now()->subMonths(2)->startOfDay()->addHours(9);
        $invoice1 = $financialService->createInvoice(
            $user,
            'enrollment',
            5000.00,
            $date1->format('Y-m-d'),
            ['desc' => 'Taxa de Inscrição 2026']
        );
        $invoice1->update(['created_at' => $date1]);

        // Update the AUTOMATICALLY created transaction
        $tx1 = FinancialTransaction::where('invoice_id', $invoice1->id)->where('type', 'charge')->first();
        if ($tx1) {
            $tx1->update([
                'created_at' => $date1->copy()->addMinute(),
                'balance_after' => -5000.00 // Assuming start was 0
            ]);
        }

        // Manual Payment
        $date1Pay = $date1->copy()->addHour();
        $invoice1->update(['status' => 'paid']);
        $user->update(['wallet_balance' => 0]); // Back to 0
        $user->financialTransactions()->create([
            'type' => 'payment',
            'amount' => 5000.00,
            'balance_after' => 0.00,
            'description' => 'Pagamento Inscrição (Simulado)',
            'created_at' => $date1Pay
        ]);


        // 2. Feb Tuition
        $date2 = Carbon::now()->subMonth()->setDay(10)->startOfDay()->addHours(9);
        $invoice2 = $financialService->createInvoice(
            $user,
            'tuition',
            4500.00,
            $date2->format('Y-m-d'),
            ['desc' => 'Mensalidade Fevereiro/2026']
        );
        $invoice2->update(['created_at' => $date2]);

        $tx2 = FinancialTransaction::where('invoice_id', $invoice2->id)->where('type', 'charge')->first();
        if ($tx2) {
            $tx2->update([
                'created_at' => $date2->copy()->addMinute(),
                'balance_after' => -4500.00 // Dropped from 0 to -4500
            ]);
        }

        // Manual Payment
        $date2Pay = $date2->copy()->addHour();
        $invoice2->update(['status' => 'paid']);
        $user->update(['wallet_balance' => 0]); // Back to 0
        $user->financialTransactions()->create([
            'type' => 'payment',
            'amount' => 4500.00,
            'balance_after' => 0.00,
            'description' => 'Pagamento Mensalidade Fev (Simulado)',
            'created_at' => $date2Pay
        ]);


        // 3. Exam Fee (Unpaid)
        $date3 = Carbon::now()->subDays(15)->startOfDay()->addHours(9);
        $invoice3 = $financialService->createInvoice(
            $user,
            'exam_fee',
            1000.00,
            Carbon::now()->subDays(8)->format('Y-m-d'), // Due 8 days ago
            ['desc' => 'Taxa de Exame Atrasada']
        );
        $invoice3->update(['created_at' => $date3]);

        $tx3 = FinancialTransaction::where('invoice_id', $invoice3->id)->where('type', 'charge')->first();
        if ($tx3) {
            $tx3->update([
                'created_at' => $date3->copy()->addMinute(),
                'balance_after' => -1000.00 // Dropped from 0 to -1000
            ]);
        }
        // User Balance IS -1000 after createInvoice call, so we don't need to manually update user wallet here, the service did it.
        // But the previous payments manually set it to 0. 
        // Service::createInvoice does: wallet = wallet - amount.
        // After step 2 payment, wallet was 0.
        // After invoice 3, wallet became -1000. 
        // So this is correct.


        // 4. March Tuition (Pending)
        $date4 = Carbon::now()->subDays(5)->startOfDay()->addHours(9);
        $invoice4 = $financialService->createInvoice(
            $user,
            'tuition',
            4500.00,
            Carbon::now()->addDays(5)->format('Y-m-d'),
            ['desc' => 'Mensalidade Março/2026']
        );
        $invoice4->update(['created_at' => $date4]);

        $tx4 = FinancialTransaction::where('invoice_id', $invoice4->id)->where('type', 'charge')->first();
        if ($tx4) {
            $tx4->update([
                'created_at' => $date4->copy()->addMinute(),
                'balance_after' => -5500.00 // -1000 (previous) - 4500 = -5500
            ]);
        }
        // Service logic: Wallet was -1000 (from 3). 
        // createInvoice subtracts 4500. 
        // Wallet becomes -5500.
        // Seeder state is consistent!

        $this->command->info("Financial data seeded with Clean History!");
    }
}
