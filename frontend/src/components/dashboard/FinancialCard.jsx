import React from 'react';
import { TrendingUp, TrendingDown, Clock, CreditCard } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const FinancialCard = ({ summary, isLoading }) => {
    const { t } = useTranslation();

    if (isLoading) {
        return (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 animate-pulse h-48">
                <div className="h-4 w-1/3 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                <div className="h-8 w-1/2 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                <div className="space-y-2">
                    <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-3 w-2/3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
            </div>
        );
    }

    // Default empty state check
    if (!summary) return null;

    const formatter = new Intl.NumberFormat('pt-MZ', {
        style: 'currency',
        currency: summary.currency || 'MZN'
    });

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <CreditCard size={100} className="transform rotate-12" />
            </div>

            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                {t('total_due', 'Valor em Dívida')}
            </h3>

            <div className="flex items-baseline gap-2 mb-6">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                    {formatter.format(summary.total_due)}
                </span>
                {summary.total_due > 0 && (
                    <span className="text-xs font-medium text-red-500 bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Clock size={10} />
                        {t('due', 'Pendente')}
                    </span>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="p-1 rounded bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                            <TrendingUp size={12} />
                        </div>
                        <span className="text-xs text-gray-500 font-medium">{t('paid', 'Pago')}</span>
                    </div>
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                        {formatter.format(summary.total_paid)}
                    </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="p-1 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                            <Clock size={12} />
                        </div>
                        <span className="text-xs text-gray-500 font-medium">{t('next_due', 'Próximo')}</span>
                    </div>
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                        {summary.next_due_date ? new Date(summary.next_due_date).toLocaleDateString() : '-'}
                    </p>
                </div>
            </div>

            <button className="w-full mt-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors shadow-sm shadow-green-200 dark:shadow-none">
                {t('pay_now', 'Pagar Agora')}
            </button>
        </div>
    );
};

export default FinancialCard;
