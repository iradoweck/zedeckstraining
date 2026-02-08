import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../../../services/api';
import { mockFinancials } from '../../../../services/mockFinancials';
// Components
import { DashboardAlerts } from '../../../../components/dashboard/DashboardAlerts';
import { StudentStatusCard } from '../../../../components/dashboard/StudentStatusCard';
import { FinancialSummaryCard, NextDueCard } from '../../../../components/dashboard/SummaryCards';
import { ActiveCoursesCard } from '../../../../components/dashboard/ActiveCoursesCard';
import { LastActivityCard } from '../../../../components/dashboard/LastActivityCard';
import { QuickServicesCard } from '../../../../components/dashboard/QuickServicesCard';
import { InvoiceTable } from '../../../../components/dashboard/InvoiceTable';
import { PaymentModal } from '../../../../components/dashboard/PaymentModal';
import { TasksWidget } from '../../../../components/dashboard/TasksWidget';
import { useAuth } from '../../../../context/AuthContext';
import { downloadPDF } from '../../../../utils/pdfGenerator';

export default function StudentOverview() {
    const { user } = useAuth();
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);

    // 1. Fetch Classes (Dados de Aulas)
    const { data: classes, isLoading: isLoadingClasses } = useQuery({
        queryKey: ['my-classes'],
        queryFn: async () => {
            try {
                const res = await api.get('/classes');
                return res.data;
            } catch (err) {
                console.warn("API Classes fetch failed, using mock/empty", err);
                // Return mock classes if API fails for demo
                return [
                    { id: 1, course: { title: "Web Design Fullstack" }, modality: "presencial", room: "A02", start_date: "2026-02-01", format: "Normal" },
                    { id: 2, course: { title: "Inglês Técnico" }, modality: "online", start_date: "2026-02-05", format: "Intensivo", isBlocked: false }
                ];
            }
        }
    });

    // 2. Fetch Financial Summary (Resumo Financeiro)
    const { data: financialSummary, isLoading: isLoadingFinance } = useQuery({
        queryKey: ['financial-summary'],
        queryFn: mockFinancials.getSummary
    });

    // 3. Fetch Last Activity (Última Atividade)
    const { data: lastActivity, isLoading: isLoadingActivity } = useQuery({
        queryKey: ['last-activity'],
        queryFn: mockFinancials.getLastActivity
    });

    // 4. Fetch Transactions (Faturas para a Tabela)
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
            type: invoice.type === 'payment' ? 'Receipt' : 'Invoice'
        }, user?.name);
    };

    const handlePaymentConfirm = (invoice) => {
        console.log("Payment confirmed for", invoice);
        refetchTransactions();
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-10">
            {/* Bloco Alertas: Mantém posição original */}
            <DashboardAlerts summary={financialSummary} />

            {/* Linha 1: 3 Colunas (Identidade | Total a Pagar | Próximo Vencimento) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="h-full">
                    <StudentStatusCard
                        data={financialSummary || { student_name: user?.name, status: 'regular' }}
                        isLoading={isLoadingFinance}
                    />
                </div>
                <div className="h-full">
                    <FinancialSummaryCard
                        data={financialSummary || {}}
                        isLoading={isLoadingFinance}
                    />
                </div>
                <div className="h-full">
                    <NextDueCard
                        data={financialSummary || {}}
                        isLoading={isLoadingFinance}
                    />
                </div>
            </div>

            {/* Linha 2: Grid Desigual (2/3 + 1/3) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Coluna Esquerda (2/3) - Cursos & Faturas */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Bloco 2: Cursos Ativos */}
                    <ActiveCoursesCard
                        classes={classes}
                        isLoading={isLoadingClasses}
                    />

                    {/* Tabela de Faturas */}
                    <InvoiceTable
                        transactions={transactions}
                        isLoading={isLoadingTransactions}
                        onPay={handlePay}
                        onDownload={handleDownload}
                    />
                </div>

                {/* Coluna Direita (1/3) - Atividade, Docs & Tarefas */}
                <div className="space-y-6 flex flex-col">
                    {/* Bloco 4: Última Atividade */}
                    <LastActivityCard
                        data={lastActivity}
                        isLoading={isLoadingActivity}
                    />

                    {/* Bloco 5: Documentos Rápidos */}
                    <QuickServicesCard
                        isLoading={isLoadingFinance}
                    />

                    {/* Bloco Novo: Tarefas */}
                    <div className="flex-1 min-h-[300px]">
                        <TasksWidget />
                    </div>
                </div>
            </div>

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
