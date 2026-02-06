import React from 'react';
import { UserCheck, Shield, Award } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const StudentStatusCard = ({ data, isLoading }) => {
    const { t } = useTranslation();

    if (isLoading) {
        return <div className="h-32 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse"></div>;
    }

    const { student_id, student_name, status } = data;

    return (
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 dark:from-blue-900 dark:to-gray-900 p-6 rounded-2xl shadow-lg text-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <Shield className="w-32 h-32" />
            </div>

            <div className="relative z-10 flex items-center">
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl font-bold border-2 border-white/30 mr-4">
                    {student_name?.charAt(0)}
                </div>
                <div>
                    <h3 className="text-lg font-bold">{student_name}</h3>
                    <p className="text-blue-100 text-sm font-mono tracking-wide">{student_id}</p>

                    <div className="mt-2 flex items-center space-x-2">
                        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${status === 'blocked' ? 'bg-red-500/80' : 'bg-green-500/80'
                            }`}>
                            {status === 'blocked' ? t('status_blocked', 'Bloqueado') : t('status_active', 'Ativo')}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};
