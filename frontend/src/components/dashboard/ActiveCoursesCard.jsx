import React from 'react';
import { BookOpen, AlertCircle, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card } from '../ui/card';
import { Link } from 'react-router-dom';

// Verified: ActiveCoursesCard does not display currency. Moving to docs.
export const ActiveCoursesCard = ({ classes, isLoading }) => {
    const { t } = useTranslation();

    if (isLoading) {
        return <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse"></div>;
    }

    // Simulação: Acesso bloqueado se status financeiro for 'blocked' (verificado via prop ou contexto futuramente)
    // Por enquanto, vamos assumir que 'access_status' vem no objeto da turma ou é derivado.
    // Vamos adicionar um campo mockado 'isBlocked' para demonstração se não existir.

    const activeClasses = classes?.map(cls => ({
        ...cls,
        isBlocked: cls.isBlocked || false // Default para false por enquanto
    }));

    return (
        <Card className="p-6 bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    {t('active_courses', 'Cursos Ativos')}
                </h3>
            </div>

            <div className="space-y-4">
                {activeClasses?.length > 0 ? (
                    activeClasses.map((cls) => (
                        <div key={cls.id} className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-600">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h4 className="font-semibold text-gray-900 dark:text-white">{cls.course?.title}</h4>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {cls.modality === 'online' ? t('modality_online', 'Online') : t('modality_presencial', 'Presencial')}
                                        {cls.room && ` • Sala ${cls.room}`}
                                    </p>
                                </div>
                                <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded-full ${cls.isBlocked
                                    ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                    : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                    }`}>
                                    {cls.isBlocked ? t('access_denied', 'Bloqueado') : t('access_authorized', 'Autorizado')}
                                </span>
                            </div>

                            {cls.isBlocked ? (
                                <div className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1 mt-2">
                                    <AlertCircle className="w-3 h-3" />
                                    {t('access_blocked_financial', 'Acesso suspenso por pendência financeira')}
                                </div>
                            ) : (
                                <Link
                                    to={`/classroom/${cls.id}`}
                                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 mt-2 font-medium"
                                >
                                    <CheckCircle className="w-3 h-3" />
                                    {t('access_classroom', 'Acessar Sala')}
                                </Link>
                            )}
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                        {t('no_classes', 'Nenhuma aula encontrada')}
                    </p>
                )}
            </div>
        </Card>
    );
};
