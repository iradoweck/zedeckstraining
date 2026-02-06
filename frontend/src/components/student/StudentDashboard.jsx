import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import { mockFinancials } from '../../services/mockFinancials';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { BookOpen, Calendar, Clock, CreditCard, Award, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import IDCardModal from './IDCardModal';
import FinancialCard from '../dashboard/FinancialCard';

export default function StudentDashboard({ user }) {
    const { t } = useTranslation();
    const [showIDModal, setShowIDModal] = useState(false);

    // Fetch Classes (Real API)
    const { data: classes, isLoading: isLoadingClasses } = useQuery({
        queryKey: ['my-classes'],
        queryFn: async () => {
            try {
                const res = await api.get('/classes');
                return res.data;
            } catch (err) {
                console.warn("API Classes fetch failed, using empty list for now", err);
                return [];
            }
        }
    });

    // Fetch Financial Summary (Mock)
    const { data: financialSummary, isLoading: isLoadingFinance } = useQuery({
        queryKey: ['financial-summary'],
        queryFn: mockFinancials.getSummary
    });

    return (
        <div className="space-y-6">
            {/* Top Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* 1. Active Courses */}
                <Card className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 border-none text-white shadow-lg shadow-blue-200 dark:shadow-blue-900/20 relative overflow-hidden">
                    <div className="relative z-10">
                        <h3 className="text-blue-100 text-sm font-medium mb-1">{t('enrolled_courses', 'Cursos Inscritos')}</h3>
                        <p className="text-3xl font-bold">{classes?.length || 0}</p>
                    </div>
                    <BookOpen className="absolute -bottom-4 -right-4 text-blue-400 opacity-20 h-24 w-24" />
                </Card>

                {/* 2. Attendance */}
                <Card className="p-6 bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">{t('attendance_rate', 'Frequência')}</h3>
                            <p className="text-3xl font-bold text-green-600">100%</p>
                        </div>
                        <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg text-green-600 dark:text-green-400">
                            <Clock size={20} />
                        </div>
                    </div>
                </Card>

                {/* 3. Certificate Status (Placeholder) */}
                <Card className="p-6 bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">{t('certificates', 'Certificados')}</h3>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white">0</p>
                        </div>
                        <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-purple-600 dark:text-purple-400">
                            <Award size={20} />
                        </div>
                    </div>
                </Card>

                {/* 4. Pending Tasks */}
                <Card className="p-6 bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">{t('assignments', 'Tarefas')}</h3>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white">0</p>
                        </div>
                        <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-orange-600 dark:text-orange-400">
                            <FileText size={20} />
                        </div>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content Area (Classes) */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('my_active_classes', 'Minhas Aulas Ativas')}</h2>
                        <Button variant="outline" size="sm" className="hidden sm:flex">
                            {t('view_all', 'Ver Todas')}
                        </Button>
                    </div>

                    {isLoadingClasses ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
                            {[1, 2].map(i => (
                                <div key={i} className="h-48 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
                            ))}
                        </div>
                    ) : classes?.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {classes.map((cls) => (
                                <Card key={cls.id} className="group hover:shadow-xl transition-all duration-300 border-gray-100 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-800">
                                    <div className="h-32 bg-gray-100 dark:bg-gray-700/50 w-full relative overflow-hidden">
                                        <div className="absolute inset-0 flex items-center justify-center text-gray-300 dark:text-gray-600 group-hover:scale-110 transition-transform duration-500">
                                            <BookOpen size={48} />
                                        </div>
                                        <div className="absolute top-3 right-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider text-primary shadow-sm">
                                            {cls.format}
                                        </div>
                                    </div>
                                    <div className="p-5">
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 line-clamp-1">{cls.course.title}</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{cls.name}</p>

                                        <div className="space-y-2 mb-5">
                                            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                                                <Calendar size={14} className="text-gray-400" />
                                                <span>{new Date(cls.start_date).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                                                <Clock size={14} className="text-gray-400" />
                                                <span className="text-green-600 dark:text-green-400 font-medium">Em Andamento</span>
                                            </div>
                                        </div>

                                        <Link
                                            to={`/classroom/${cls.id}`}
                                            className="block w-full py-2 bg-gray-50 dark:bg-gray-700/50 hover:bg-primary hover:text-white text-primary dark:text-blue-400 dark:hover:text-white font-medium rounded-lg transition-all text-sm text-center"
                                        >
                                            {t('access_classroom', 'Acessar Sala de Aula')}
                                        </Link>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card className="p-10 text-center border-dashed border-2 bg-gray-50 dark:bg-gray-800/50">
                            <BookOpen className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">{t('no_classes', 'Nenhuma aula encontrada')}</h3>
                            <p className="text-gray-500 text-sm mb-6">{t('no_classes_desc', 'Você ainda não está matriculado em nenhuma turma ativa.')}</p>
                            <Button className="bg-primary hover:bg-blue-700">
                                {t('browse_courses', 'Ver Cursos Disponíveis')}
                            </Button>
                        </Card>
                    )}
                </div>

                {/* Sidebar (Financial & Documents) */}
                <div className="space-y-6">
                    {/* Financial Summary Card */}
                    <FinancialCard summary={financialSummary} isLoading={isLoadingFinance} />

                    {/* Official Documents */}
                    <Card className="p-6 bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg text-indigo-600 dark:text-indigo-400">
                                <Award size={20} />
                            </div>
                            <h3 className="font-bold text-gray-900 dark:text-white">{t('documents', 'Documentos Oficiais')}</h3>
                        </div>

                        <div className="space-y-3">
                            <button
                                onClick={() => setShowIDModal(true)}
                                className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-10 bg-gray-200 dark:bg-gray-600 rounded flex items-center justify-center">
                                        <span className="text-[10px] font-bold">ID</span>
                                    </div>
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400">{t('student_id_card', 'Cartão de Estudante')}</span>
                                </div>
                                <Clock size={14} className="text-gray-400" />
                            </button>

                            <button className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-gray-50 dark:bg-gray-800 opacity-60 cursor-not-allowed">
                                <div className="flex items-center gap-3">
                                    <FileText size={18} className="text-gray-400" />
                                    <span className="text-sm font-medium text-gray-500">{t('declarations', 'Declarações')}</span>
                                </div>
                                <span className="text-[10px] bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded text-gray-500">Em Breve</span>
                            </button>
                        </div>
                    </Card>
                </div>
            </div>

            {showIDModal && <IDCardModal user={user} onClose={() => setShowIDModal(false)} />}
        </div>
    );
}
