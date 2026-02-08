import React from 'react';
import { useTranslation } from 'react-i18next';
import { GraduationCap, Percent } from 'lucide-react';

const CircularProgress = ({ value, max, color, label, subLabel, icon: Icon }) => {
    const radius = 30;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (value / max) * circumference;

    return (
        <div className="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl relative group hover:bg-white dark:hover:bg-gray-700 transition-colors border border-transparent hover:border-gray-100 dark:hover:border-gray-600">
            <div className="relative w-24 h-24">
                <svg className="w-full h-full transform -rotate-90">
                    <circle
                        cx="48"
                        cy="48"
                        r={radius}
                        className="stroke-current text-gray-200 dark:text-gray-600"
                        strokeWidth="8"
                        fill="transparent"
                    />
                    <circle
                        cx="48"
                        cy="48"
                        r={radius}
                        className={`stroke-current ${color}`}
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                    />
                </svg>
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-lg font-bold text-gray-700 dark:text-white">
                    {value}
                    {max === 100 && <span className="text-xs ml-0.5">%</span>}
                </div>
            </div>
            <div className="mt-2 text-center">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">{label}</p>
                <div className="flex items-center justify-center gap-1.5 mt-1">
                    {Icon && <Icon className="w-3 h-3 text-gray-400" />}
                    <p className="text-xs text-gray-400">{subLabel}</p>
                </div>
            </div>
        </div>
    );
};

export const PerformanceWidget = () => {
    const { t } = useTranslation();

    // Mock Data
    const attendance = 92; // %
    const averageGrade = 16.5; // / 20

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 h-full">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-6">
                {t('academic_performance', 'Desempenho Académico')}
            </h3>

            <div className="grid grid-cols-2 gap-4">
                {/* Average Grade */}
                <CircularProgress
                    value={averageGrade}
                    max={20}
                    color="text-blue-500"
                    label={t('avg_grade', 'Média Geral')}
                    subLabel={t('out_of_20', 'de 20 valores')}
                    icon={GraduationCap}
                />

                {/* Attendance */}
                <CircularProgress
                    value={attendance}
                    max={100}
                    color="text-green-500"
                    label={t('attendance', 'Frequência')}
                    subLabel={t('classes_attended', 'Aulas presros')}
                    icon={Percent}
                />
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                <p className="text-xs text-center text-gray-400 dark:text-gray-500">
                    {t('performance_note', 'Ótimo desempenho! Continue assim.')}
                </p>
            </div>
        </div>
    );
};
