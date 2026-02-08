import React from 'react';
import { useTranslation } from 'react-i18next';
import { Megaphone, CalendarDays, ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';

export const AnnouncementsWidget = () => {
    const { t } = useTranslation();

    // Mock Data
    const notices = [
        {
            id: 1,
            titleKey: 'notice_holiday_title',
            date: '12 Out',
            type: 'warning',
            descKey: 'notice_holiday_desc'
        },
        {
            id: 2,
            titleKey: 'notice_exam_title',
            date: '15 Out',
            type: 'info',
            descKey: 'notice_exam_desc'
        }
    ];

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-2">
                    <Megaphone className="w-4 h-4" />
                    {t('school_notices', 'Comunicados')}
                </h3>
            </div>

            <div className="flex-1 space-y-3">
                {notices.map(notice => (
                    <div key={notice.id} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700/30 border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800 transition-colors group cursor-pointer">
                        <div className="flex justify-between items-start mb-1">
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide ${notice.type === 'warning' ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400' :
                                    'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                                }`}>
                                {notice.type === 'warning' ? t('notice_imp', 'Importante') : t('notice_info', 'Info')}
                            </span>
                            <div className="flex items-center text-xs text-gray-400">
                                <CalendarDays className="w-3 h-3 mr-1" />
                                {notice.date}
                            </div>
                        </div>
                        <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mt-2 mb-1 group-hover:text-blue-600 transition-colors">
                            {t(notice.titleKey)}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                            {t(notice.descKey)}
                        </p>
                    </div>
                ))}
            </div>

            <div className="mt-4">
                <Button variant="ghost" className="w-full text-xs text-blue-600 dark:text-blue-400 h-8 hover:bg-blue-50 dark:hover:bg-blue-900/20 flex items-center justify-center gap-1">
                    {t('view_all_notices', 'Ver todos os avisos')}
                    <ArrowRight className="w-3 h-3" />
                </Button>
            </div>
        </div>
    );
};
