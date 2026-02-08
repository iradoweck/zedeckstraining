import React, { useState } from 'react';
import {
    FileText,
    Download,
    CreditCard,
    CheckCircle,
    Clock,
    AlertCircle,
    Search,
    Filter
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/button';

export const InvoiceTable = ({ transactions, isLoading, onPay, onDownload }) => {
    const { t } = useTranslation();
    const [filter, setFilter] = useState('all');

    if (isLoading) {
        return <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse mt-6"></div>;
    }

    const filteredTransactions = transactions?.filter(tx => {
        if (filter === 'all') return true;
        if (filter === 'paid') return tx.status === 'completed' || tx.status === 'paid';
        if (filter === 'pending') return tx.status === 'pending' || tx.status === 'future';
        return true;
    }) || [];

    const getStatusBadge = (status) => {
        switch (status) {
            case 'completed':
            case 'paid':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"><CheckCircle className="w-3 h-3 mr-1" /> {t('status_paid', 'Pago')}</span>;
            case 'pending':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"><Clock className="w-3 h-3 mr-1" /> {t('status_pending', 'Pendente')}</span>;
            case 'overdue':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"><AlertCircle className="w-3 h-3 mr-1" /> {t('status_overdue', 'Atrasado')}</span>;
            case 'future':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">{t('status_future', 'A Vencer')}</span>;
            default:
                return null;
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden mt-6">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-gray-400" />
                    {t('invoices', 'Faturas & Pagamentos')}
                </h3>

                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="pl-9 pr-4 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 outline-none appearance-none cursor-pointer"
                        >
                            <option value="all">{t('all', 'Todas')}</option>
                            <option value="pending">{t('pending', 'Pendentes')}</option>
                            <option value="paid">{t('paid', 'Pagas')}</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-4 font-medium">{t('description', 'Descrição')}</th>
                            <th className="px-6 py-4 font-medium">{t('amount', 'Valor')}</th>
                            <th className="px-6 py-4 font-medium">{t('due_date', 'Vencimento')}</th>
                            <th className="px-6 py-4 font-medium">{t('status', 'Estado')}</th>
                            <th className="px-6 py-4 font-medium text-right">{t('actions', 'Ações')}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {filteredTransactions.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                                    {t('no_invoices', 'Nhuma fatura encontrada.')}
                                </td>
                            </tr>
                        ) : (
                            filteredTransactions.map((tx) => (
                                <tr key={tx.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-medium text-gray-900 dark:text-white">{tx.description}</span>
                                            <span className="text-xs text-gray-500 dark:text-gray-400">{tx.id}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-900 dark:text-white font-mono">
                                        {new Intl.NumberFormat('pt-MZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(tx.amount).replace(/\./g, ',').replace(/\s/g, ' ')} MZN
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-sm">
                                        {tx.due_date ? new Date(tx.due_date).toLocaleDateString() : '-'}
                                    </td>
                                    <td className="px-6 py-4">
                                        {getStatusBadge(tx.status)}
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        {(tx.status === 'pending' || tx.status === 'overdue') && (
                                            <Button
                                                size="sm"
                                                onClick={() => onPay(tx)}
                                                className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-200 dark:shadow-none"
                                            >
                                                <CreditCard className="w-4 h-4 mr-2" />
                                                {t('pay', 'Pagar')}
                                            </Button>
                                        )}
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            title={t('download_pdf', 'Baixar PDF')}
                                            onClick={() => onDownload(tx)}
                                            className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                                        >
                                            <Download className="w-4 h-4" />
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
