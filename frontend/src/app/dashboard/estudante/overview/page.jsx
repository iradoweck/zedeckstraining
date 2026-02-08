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
            {/* Bloco 6: Alertas Importantes (Banner Global) */}
            <DashboardAlerts summary={financialSummary} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Coluna Principal (Esquerda - 2/3) */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Bloco 1: Identidade do Estudante */}
                    <div className="h-auto">
                        <StudentStatusCard
                            data={financialSummary || { student_name: user?.name, status: 'regular' }}
                            isLoading={isLoadingFinance}
                        />
                    </div>

                    {/* Bloco 3: Situação Financeira (Cards Lado a Lado) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <FinancialSummaryCard
                            data={financialSummary || {}}
                            isLoading={isLoadingFinance}
                        />
                        <NextDueCard
                            data={financialSummary || {}}
                            isLoading={isLoadingFinance}
                        />
                    </div>

                    {/* Tabela de Faturas (Merged from Image 1) */}
                    <InvoiceTable
                        transactions={transactions}
                        isLoading={isLoadingTransactions}
                        onPay={handlePay}
                        onDownload={handleDownload}
                    />

                    {/* Bloco 2: Cursos Ativos */}
                    <ActiveCoursesCard
                        classes={classes}
                        isLoading={isLoadingClasses}
                    />
                </div>

                {/* Coluna Lateral (Direita - 1/3) */}
                <div className="space-y-6">

                    {/* Bloco 4: Última Atividade */}
                    <LastActivityCard
                        data={lastActivity}
                        isLoading={isLoadingActivity}
                    />

                    {/* Bloco 5: Documentos Rápidos */}
                    <QuickServicesCard
                        isLoading={isLoadingFinance} // Usa loading do financeiro como proxy
                    />

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
