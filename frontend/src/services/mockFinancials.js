/**
 * Mock Financial Data Service
 * Simulates backend responses for financial operations until API is ready.
 */

export const mockFinancials = {
    getSummary: async () => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));

        return {
            balance: 0,
            total_paid: 15000,
            total_due: 4500,
            next_due_date: "2026-03-05", // 5th of March
            currency: "MZN",
            status: "ok" // ok, warning, overdue
        };
    },

    getTransactions: async () => {
        await new Promise(resolve => setTimeout(resolve, 600));

        return [
            {
                id: "INV-2026-001",
                type: "invoice",
                description: "Mensalidade Fevereiro/2026",
                amount: 4500,
                status: "pending", // paid, pending, overdue
                date: "2026-02-01",
                due_date: "2026-02-10"
            },
            {
                id: "PAY-2026-982",
                type: "payment",
                description: "Pagamento Inscrição",
                amount: 15000,
                status: "completed",
                date: "2026-01-28",
                method: "M-Pesa"
            }
        ];
    }
};
