import React from 'react';
import { CreditCard, Calendar, TrendingUp, AlertTriangle, ShieldAlert } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { formatCurrency } from '../../utils/format';

export const FinancialSummaryCard = ({ data, isLoading }) => {
    const { t } = useTranslation();

    if (isLoading) {
        return <div className="h-32 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse"></div>;
    }

    const { status, total_due, penalty_total } = data;

    // Status Config
    const statusConfig = {
        regular: { color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', label: t('status_regular', 'Regular') },
        pending: { color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', label: t('status_pending', 'Pendente') },
        overdue: { color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400', label: t('status_overdue', 'Em Atraso') },
        blocked: { color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', label: t('status_blocked', 'Bloqueado') },
    };

    const currentConfig = statusConfig[status] || statusConfig.regular;

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-between">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        {t('total_debt', 'Total a Pagar')}
                    </h3>
                    <div className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                        {formatCurrency(total_due)}
                    </div>
                    {penalty_total > 0 && (
                        <p className="text-xs text-red-500 mt-1 font-medium flex items-center">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            {t('includes_fine', 'Inclui {{amount}} de multa', { amount: formatCurrency(penalty_total) })}
                        </p>
                    )}
                </div>
                <div className={`p-3 rounded-full ${currentConfig.color}`}>
                    {status === 'blocked' ? <ShieldAlert className="w-6 h-6" /> : <CreditCard className="w-6 h-6" />}
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-50 dark:border-gray-700 flex items-center justify-between">
                <span className="text-sm text-gray-500">{t('current_status', 'Situação')}:</span>
                <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase ${currentConfig.color}`}>
                    {currentConfig.label}
                </span>
            </div>
        </div>
    );
};

export const NextDueCard = ({ data, isLoading }) => {
    const { t } = useTranslation();

    if (isLoading) {
        return <div className="h-32 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse"></div>;
    }

    const { next_due_date, days_remaining } = data;

    // Determine urgency color
    let dateColor = "text-gray-900 dark:text-white";
    let messageColor = "text-blue-600 dark:text-blue-400";

    if (days_remaining <= 3 && days_remaining >= 0) {
        dateColor = "text-orange-600 dark:text-orange-500";
        messageColor = "text-orange-600 dark:text-orange-500";
    } else if (days_remaining < 0) {
        dateColor = "text-red-600 dark:text-red-500";
        messageColor = "text-red-600 dark:text-red-500";
    }

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-between">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        {t('next_due', 'Próximo Vencimento')}
                    </h3>
                    <div className={`mt-2 text-2xl font-bold ${dateColor}`}>
                        {new Date(next_due_date).toLocaleDateString('pt-MZ')}
                    </div>
                </div>
                <div className="p-3 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                    <Calendar className="w-6 h-6" />
                </div>
            </div>

            <div className="mt-4">
                {/* Progress Bar / Indicator */}
                <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5 mb-2">
                    <div
                        className={`h-1.5 rounded-full ${days_remaining < 3 ? 'bg-orange-500' : 'bg-blue-500'}`}
                        style={{ width: '70%' }} // Static for now, could be calculated based on month progress
                    ></div>
                </div>
                <p className={`text-xs font-medium ${messageColor}`}>
                    {days_remaining === 0
                        ? t('due_today', 'Vence Hoje!')
                        : days_remaining < 0
                            ? t('overdue_days', 'Vencido há {{days}} dias', { days: Math.abs(days_remaining) })
                            : t('days_remaining', 'Faltam {{days}} dias', { days: days_remaining })
                    }
                </p>
            </div>
        </div>
    );
};
