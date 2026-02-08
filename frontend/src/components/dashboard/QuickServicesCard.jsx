import React from 'react';
import { FileText, Download, Printer, FileCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/button';

export const QuickServicesCard = ({ isLoading }) => {
    const { t } = useTranslation();

    if (isLoading) {
        return <div className="h-48 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse"></div>;
    }

    const services = [
        { icon: FileText, label: 'latest_invoice', action: () => console.log('Invoice PDF') },
        { icon: Printer, label: 'latest_guide', action: () => console.log('Guide PDF') },
        { icon: FileCheck, label: 'declaration_enrollment', action: () => console.log('Declaration PDF') },
    ];

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
                {t('quick_docs', 'Documentos Rápidos')}
            </h3>

            <div className="grid grid-cols-1 gap-3">
                {services.map((svc, index) => (
                    <Button
                        key={index}
                        variant="ghost"
                        className="w-full justify-start text-left h-auto py-3 px-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 border border-gray-100 dark:border-gray-700/50 rounded-xl"
                        onClick={svc.action}
                    >
                        <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg mr-3 text-gray-600 dark:text-gray-300">
                            <svc.icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                            <span className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                                {t(svc.label)}
                            </span>
                            <span className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5">
                                <Download className="w-3 h-3" /> PDF
                            </span>
                        </div>
                    </Button>
                ))}
            </div>
        </div>
    );
};
