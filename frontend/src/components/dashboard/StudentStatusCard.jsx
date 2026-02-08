import React from 'react';
import { UserCheck, Shield, Award, AlertTriangle, Lock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const StudentStatusCard = ({ data, isLoading }) => {
    const { t } = useTranslation();

    if (isLoading) {
        return <div className="h-40 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse"></div>;
    }

    const { student_id, student_name, status, photo_url } = data;

    // Configuração de Status
    const statusConfig = {
        active: { color: 'bg-green-500', icon: UserCheck, label: 'status_active' },
        regular: { color: 'bg-green-500', icon: UserCheck, label: 'status_active' },
        overdue: { color: 'bg-orange-500', icon: AlertTriangle, label: 'status_overdue' },
        blocked: { color: 'bg-red-600', icon: Lock, label: 'status_blocked' },
    };

    const currentStatus = statusConfig[status] || statusConfig.active;
    const StatusIcon = currentStatus.icon;

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden h-full flex items-center">
            {/* Background Decor */}
            <div className={`absolute right-0 top-0 p-4 opacity-5 ${status === 'blocked' ? 'text-red-500' : 'text-blue-500'}`}>
                <Shield className="w-32 h-32 transform rotate-12" />
            </div>

            <div className="flex items-center gap-6 relative z-10 w-full">
                {/* Avatar / Photo */}
                <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 p-1">
                        <div className="w-full h-full rounded-full bg-white dark:bg-gray-900 flex items-center justify-center overflow-hidden">
                            {photo_url ? (
                                <img src={photo_url} alt={student_name} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-2xl font-bold text-gray-400">{student_name?.charAt(0)}</span>
                            )}
                        </div>
                    </div>
                    {/* Status Badge */}
                    <div className={`absolute -bottom-1 -right-1 p-1.5 rounded-full border-2 border-white dark:border-gray-800 ${currentStatus.color} text-white`}>
                        <StatusIcon className="w-4 h-4" />
                    </div>
                </div>

                {/* Info */}
                <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
                        {student_name}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-mono mt-1 tracking-wider bg-gray-100 dark:bg-gray-700/50 inline-block px-2 py-0.5 rounded">
                        {student_id}
                    </p>

                    <div className="mt-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${status === 'blocked'
                                ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                : status === 'overdue'
                                    ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                                    : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            }`}>
                            {t(currentStatus.label)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

