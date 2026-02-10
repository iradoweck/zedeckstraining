import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { financialService } from '../../../../services/financial.service';
import { useTranslation } from 'react-i18next';
import {
    FileText,
    History,
    TrendingUp,
    AlertCircle,
    Download,
    CreditCard
} from 'lucide-react';
// Components
import { FinancialSummaryCard, NextDueCard } from '../../../../components/dashboard/SummaryCards';
import { InvoiceTable } from '../../../../components/dashboard/InvoiceTable';
import { Button } from '../../../../components/ui/button';
import { PaymentModal } from '../../../../components/dashboard/PaymentModal';
import { formatCurrency } from '../../../../utils/format';

export default function StudentFinancials() {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState('invoices');
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);

    // 1. Fetch Summary
    const { data: summary, isLoading: loadingSummary, refetch: refetchSummary } = useQuery({
        queryKey: ['financial-summary'],
        queryFn: async () => {
            const data = await financialService.getSummary();
            console.log('FRONTEND_DEBUG_SUMMARY:', data);
            return data;
        }
    });

    // 2. Fetch Invoices
    const { data: invoices, isLoading: loadingInvoices, refetch: refetchInvoices } = useQuery({
        queryKey: ['financial-invoices'],
        queryFn: financialService.getInvoices
    });

    // 3. Fetch Transactions (Ledger)
    const { data: transactions, isLoading: loadingTransactions, refetch: refetchTransactions } = useQuery({
        queryKey: ['financial-transactions'],
        queryFn: financialService.getTransactions
    });

    const handlePay = (invoice) => {
        setSelectedInvoice(invoice);
        setShowPaymentModal(true);
    };

    const handlePaymentConfirm = () => {
        refetchSummary();
        refetchInvoices();
        refetchTransactions();
    };

    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-10">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <CreditCard className="w-8 h-8 text-blue-600" />
                    {t('financial_dashboard', 'Painel Financeiro')}
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                    {t('financial_subtitle', 'Gerencie suas mensalidades, pagamentos e extratos em um só lugar.')}
                </p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FinancialSummaryCard
                    data={summary || {}}
                    isLoading={loadingSummary}
                />

                <NextDueCard
                    data={summary || {}}
                    isLoading={loadingSummary}
                />

                {/* Total Paid / Wallet Balance Card */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-between relative overflow-hidden">
                    {loadingSummary ? (
                        <div className="animate-pulse space-y-4">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                        </div>
                    ) : (
                        <>
                            <div className="z-10">
                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400 block mb-1">
                                    {t('total_paid', 'Total Pago (Ano)')}
                                </span>
                                <div className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                                    {formatCurrency(summary?.total_paid || 0)}
                                </div>
                            </div>
                            <div className="absolute right-0 top-0 p-6 opacity-10">
                                <TrendingUp className="w-24 h-24 text-green-600" />
                            </div>
                            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center z-10">
                                <span className="text-sm text-gray-500">{t('wallet_balance', 'Saldo em Carteira')}:</span>
                                <span className={`text-sm font-bold ${summary?.wallet_balance < 0 ? 'text-red-600' : 'text-green-600'}`}>
                                    {formatCurrency(summary?.wallet_balance || 0)}
                                </span>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Tabs & Content */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden min-h-[500px]">
                {/* Custom Tabs Header */}
                <div className="flex border-b border-gray-100 dark:border-gray-700">
                    <button
                        onClick={() => setActiveTab('invoices')}
                        className={`flex-1 py-4 text-sm font-medium text-center border-b-2 transition-colors flex items-center justify-center gap-2 ${activeTab === 'invoices'
                            ? 'border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/10'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800'
                            }`}
                    >
                        <FileText className="w-4 h-4" />
                        {t('invoices_tab', 'Faturas & Mensalidades')}
                    </button>
                    <button
                        onClick={() => setActiveTab('transactions')}
                        className={`flex-1 py-4 text-sm font-medium text-center border-b-2 transition-colors flex items-center justify-center gap-2 ${activeTab === 'transactions'
                            ? 'border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/10'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800'
                            }`}
                    >
                        <History className="w-4 h-4" />
                        {t('transactions_tab', 'Extrato Detalhado')}
                    </button>
                </div>

                {/* Tab Content */}
                <div className="p-0">
                    {activeTab === 'invoices' && (
                        <div className="p-6">
                            <InvoiceTable
                                transactions={invoices}
                                isLoading={loadingInvoices}
                                onPay={handlePay}
                            // onDownload={() => {}} 
                            />
                        </div>
                    )}

                    {activeTab === 'transactions' && (
                        <div className="overflow-x-auto p-6">
                            {loadingTransactions ? (
                                <div className="space-y-4 animate-pulse">
                                    {[1, 2, 3].map(i => <div key={i} className="h-12 bg-gray-100 rounded w-full"></div>)}
                                </div>
                            ) : (
                                <table className="w-full text-left min-w-[600px]">
                                    <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-gray-900/50">
                                        <tr>
                                            <th className="px-6 py-3">{t('date', 'Data')}</th>
                                            <th className="px-6 py-3">{t('description', 'Descrição')}</th>
                                            <th className="px-6 py-3">{t('type', 'Tipo')}</th>
                                            <th className="px-6 py-3 text-right">{t('amount', 'Valor')}</th>
                                            <th className="px-6 py-3 text-right">{t('balance', 'Saldo')}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                        {transactions?.length === 0 ? (
                                            <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">{t('no_transactions', 'Nenhuma transação encontrada.')}</td></tr>
                                        ) : (
                                            transactions?.map((tx) => (
                                                <tr key={tx.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                                    <td className="px-6 py-4 text-sm text-gray-500">
                                                        {new Date(tx.created_at).toLocaleDateString('pt-PT')}
                                                        <span className="text-xs text-gray-400 block">
                                                            {new Date(tx.created_at).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                                                        {tx.description}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${tx.type === 'payment' ? 'bg-green-100 text-green-800' :
                                                            tx.type === 'penalty' ? 'bg-red-100 text-red-800' :
                                                                'bg-gray-100 text-gray-800'
                                                            }`}>
                                                            {tx.type === 'payment' ? 'Pagamento' :
                                                                tx.type === 'penalty' ? 'Multa' :
                                                                    tx.type === 'charge' ? 'Cobrança' : tx.type}
                                                        </span>
                                                    </td>
                                                    <td className={`px-6 py-4 text-sm font-mono text-right font-medium ${tx.type === 'payment' ? 'text-green-600' : 'text-red-600'
                                                        }`}>
                                                        {tx.type === 'payment' ? '+' : '-'}{formatCurrency(Math.abs(tx.amount))}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm font-mono text-right text-gray-500">
                                                        {formatCurrency(tx.balance_after)}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Payment Modal */}
            <PaymentModal
                isOpen={showPaymentModal}
                onClose={() => setShowPaymentModal(false)}
                onConfirm={handlePaymentConfirm}
                invoice={selectedInvoice}
            />
        </div>
    );
}
