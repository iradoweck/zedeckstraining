import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import { mockFinancials } from '../../services/mockFinancials';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { BookOpen, Calendar, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import IDCardModal from './IDCardModal';
import { FinancialSummaryCard, NextDueCard } from '../dashboard/SummaryCards';
import { StudentStatusCard } from '../dashboard/StudentStatusCard';
import { DashboardAlerts } from '../dashboard/DashboardAlerts';
import { InvoiceTable } from '../dashboard/InvoiceTable';
import { PaymentModal } from '../dashboard/PaymentModal';
import { downloadPDF } from '../../utils/pdfGenerator';

export default function StudentDashboard({ user }) {
    const { t } = useTranslation();
    const [showIDModal, setShowIDModal] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);

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

    // Fetch Transactions (Mock)
    const { data: transactions, isLoading: isLoadingTransactions, refetch: refetchTransactions } = useQuery({
        queryKey: ['financial-transactions'],
        queryFn: mockFinancials.getTransactions
    });

    // Handlers
    const handlePay = (invoice) => {
        setSelectedInvoice(invoice);
        setShowPaymentModal(true);
    };

    const handleDownload = (invoice) => {
        downloadPDF({
            ...invoice,
            title: `Fatura #${invoice.id}`,
            type: invoice.type === 'payment' ? 'Receipt' : 'Invoice' // Map types
        }, user?.name);
    };

    const handlePaymentConfirm = (invoice) => {
        console.log("Payment confirmed for", invoice);
        refetchTransactions(); // Refresh list to show status change if backend was real
    };

    return (
        <div className="space-y-6">
            {/* Alerts Section */}
            <DashboardAlerts summary={financialSummary} />

            {/* New Financial & Status Grid (v1.2.3) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* 1. Student Identity Status */}
                <StudentStatusCard
                    data={financialSummary || { student_name: user?.name, status: 'regular' }}
                    isLoading={isLoadingFinance}
                />

                {/* 2. Financial Overview */}
                <FinancialSummaryCard
                    data={financialSummary || {}}
                    isLoading={isLoadingFinance}
                />

                {/* 3. Next Payment */}
                <NextDueCard
                    data={financialSummary || {}}
                    isLoading={isLoadingFinance}
                />
            </div>

            {/* Financial History & Invoices */}
            <InvoiceTable
                transactions={transactions}
                isLoading={isLoadingTransactions}
                onPay={handlePay}
                onDownload={handleDownload}
            />

            {/* Existing Active Classes Section */}
            <div className="space-y-6">
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

            {showIDModal && <IDCardModal user={user} onClose={() => setShowIDModal(false)} />}

            {/* Payment Modal */}
            <PaymentModal
                isOpen={showPaymentModal}
                onClose={() => setShowPaymentModal(false)}
                invoice={selectedInvoice}
                onConfirm={handlePaymentConfirm}
            />
        </div>
    );
}
