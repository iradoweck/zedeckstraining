import api from './api';

export const financialService = {
    /**
     * Get financial summary (Balance, Next Due, Status).
     */
    getSummary: async () => {
        try {
            const response = await api.get('/financials/summary');
            return response.data;
        } catch (error) {
            console.error('Financial Summary Error:', error);
            throw error;
        }
    },

    /**
     * Get list of invoices.
     */
    getInvoices: async () => {
        try {
            const response = await api.get('/financials/invoices');
            return response.data;
        } catch (error) {
            console.error('Invoices Error:', error);
            throw error;
        }
    },

    /**
     * Get ledger transactions.
     */
    getTransactions: async () => {
        try {
            const response = await api.get('/financials/transactions');
            return response.data;
        } catch (error) {
            console.error('Transactions Error:', error);
            throw error;
        }
    }
};
