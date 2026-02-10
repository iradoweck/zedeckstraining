import React from 'react';
import { Activity, ArrowRight, Download, FileText } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/button';
import { formatCurrency } from '../../utils/format';

export const LastActivityCard = ({ data, isLoading }) => {
    const { t } = useTranslation();

    if (isLoading) {
        return <div className="h-48 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse"></div>;
    }

    // Se não houver dados
    if (!data) return null;

    const { title, date, amount, status } = data;

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-between">
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-2">
                        <Activity className="w-4 h-4" />
                        {t('last_activity', 'Última Atividade')}
                    </h3>
                    <span className="text-xs text-gray-400">{new Date(date).toLocaleDateString()}</span>
                </div>

                <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg">
                        <FileText className="w-6 h-6" />
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 dark:text-white leading-tight">{title}</h4>
                        <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">
                            {formatCurrency(amount)}
                        </p>
                        <span className={`inline-block mt-1 px-2 py-0.5 text-[10px] font-bold uppercase rounded-full ${status === 'pending' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' : 'bg-green-100 text-green-700'
                            }`}>
                            {status === 'pending' ? t('status_pending', 'Pendente') : t('status_paid', 'Pago')}
                        </span>
                    </div>
                </div>
            </div>

            <div className="mt-6 flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 text-xs h-8">
                    <Download className="w-3 h-3 mr-1.5" />
                    {t('download_pdf', 'PDF')}
                </Button>
                <Button size="sm" className="flex-1 text-xs h-8 bg-blue-600 hover:bg-blue-700 text-white">
                    {t('view_invoice', 'Ver Detalhes')}
                    <ArrowRight className="w-3 h-3 ml-1.5" />
                </Button>
            </div>
        </div>
    );
};
