import React from 'react';
import { AlertTriangle, Lock, Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const DashboardAlerts = ({ summary }) => {
    const { t } = useTranslation();

    if (!summary) return null;

    const { status, days_remaining } = summary;

    // 1. Blocked Alert (Critical)
    if (status === 'blocked') {
        return (
            <div className="bg-red-50 dark:bg-red-900/10 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg animate-in slide-in-from-top duration-500">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <Lock className="h-5 w-5 text-red-500" aria-hidden="true" />
                    </div>
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                            {t('alert_blocked_title', 'Acesso Bloqueado')}
                        </h3>
                        <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                            <p>
                                {t('alert_blocked_desc', 'Seu acesso às aulas e avaliações está suspenso devido a pendências financeiras. Por favor, regularize sua situação para restabelecer o acesso imediato.')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // 2. Overdue Alert (Warning)
    if (status === 'overdue' || (days_remaining < 0)) {
        return (
            <div className="bg-orange-50 dark:bg-orange-900/10 border-l-4 border-orange-500 p-4 mb-6 rounded-r-lg animate-in slide-in-from-top duration-500">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <AlertTriangle className="h-5 w-5 text-orange-500" aria-hidden="true" />
                    </div>
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-orange-800 dark:text-orange-200">
                            {t('alert_overdue_title', 'Pagamento em Atraso')}
                        </h3>
                        <div className="mt-2 text-sm text-orange-700 dark:text-orange-300">
                            <p>
                                {t('alert_overdue_desc', 'Você possui uma fatura vencida. Uma multa automática de 15% foi aplicada. Evite o bloqueio de acesso efetuando o pagamento hoje.')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // 3. Due Soon Alert (Info)
    if (days_remaining <= 3 && days_remaining >= 0) {
        return (
            <div className="bg-blue-50 dark:bg-blue-900/10 border-l-4 border-blue-500 p-4 mb-6 rounded-r-lg animate-in slide-in-from-top duration-500">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <Info className="h-5 w-5 text-blue-500" aria-hidden="true" />
                    </div>
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                            {t('alert_due_soon_title', 'Vencimento Próximo')}
                        </h3>
                        <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                            <p>
                                {t('alert_due_soon_desc', 'Sua mensalidade vence em {{days}} dias. Pague antecipadamente para evitar filas.', { days: days_remaining === 0 ? 'hoje' : days_remaining })}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return null;
};
