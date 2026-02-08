/**
 * Mock Financial Data Service
 * Simulates backend responses for financial operations until API is ready.
 */

// Helper to calculate days difference
const getDaysDifference = (dateString) => {
    const today = new Date();
    const targetDate = new Date(dateString);
    const diffTime = targetDate - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const mockFinancials = {
    getSummary: async () => {
        // Simular delay da API
        await new Promise(resolve => setTimeout(resolve, 800));

        // Lógica Simulada
        const nextDueDate = "2026-02-10";
        const daysRemaining = getDaysDifference(nextDueDate);

        let status = "regular";
        let balance = 0;
        let totalDue = 4500;

        // Simular Lógica de Atraso (Alterar para testar estados)
        const isSimulatedOverdue = false;

        if (isSimulatedOverdue) {
            status = "overdue"; // ou 'blocked' se > 30 dias
            balance = 4500 * 0.15; // Multa de 15%
            totalDue += balance;
        }

        return {
            balance: balance, // Dívida/Multa
            total_paid: 15000,
            total_due: totalDue,
            next_due_date: nextDueDate,
            days_remaining: daysRemaining,
            currency: "MZN",
            status: status, // regular, pending, overdue, blocked
            student_id: "ZT-2026-0042", // ID Imutável
            student_name: "Muacy", // Deve vir do contexto de auth
            photo_url: null
        };
    },

    getLastActivity: async () => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return {
            type: "invoice_issued", // payment_received, invoice_issued
            title: "Fatura de Março Emitida",
            date: "2026-02-01",
            amount: 4500,
            currency: "MZN",
            status: "pending"
        };
    },

    getTransactions: async () => {
        await new Promise(resolve => setTimeout(resolve, 600));

        return [
            {
                id: "INV-2026-003",
                type: "invoice",
                description: "Mensalidade Março/2026",
                amount: 4500,
                status: "future",
                date: "2026-03-01",
                due_date: "2026-03-10"
            },
            {
                id: "INV-2026-002",
                type: "invoice",
                description: "Mensalidade Fevereiro/2026",
                amount: 4500,
                status: "pending", // pending is active due
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
