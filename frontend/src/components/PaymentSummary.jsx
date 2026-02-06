import React, { useState, useEffect } from 'react';
import PaymentMethodSelector from './PaymentMethodSelector';
import { Button } from './ui/button';
import { Loader2, AlertCircle } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

const PaymentSummary = ({ studentData, courses, onComplete }) => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(true);
    const [paymentData, setPaymentData] = useState(null);
    const [paymentPlan, setPaymentPlan] = useState('monthly'); // 'monthly' | 'full'
    const [selectedMethod, setSelectedMethod] = useState('');
    const [processing, setProcessing] = useState(false);

    // Persistent Reference
    const [persistentRef, setPersistentRef] = useState(null);

    // Fetch Calculation when courses or plan changes
    useEffect(() => {
        const fetchCalculation = async () => {
            setLoading(true);
            try {
                const response = await api.post('/payments/calculate', {
                    courses: courses.map(c => ({ id: c.id, modality: c.modality })),
                    payment_plan: paymentPlan
                });

                if (response.data.success) {
                    setPaymentData(response.data);
                    // Only set reference once to keep it immutable for this session
                    if (!persistentRef && response.data.reference) {
                        setPersistentRef(response.data.reference);
                    }
                }
            } catch (error) {
                console.error("Payment Calc Error:", error);
                toast.error(t('calculation_error', "Erro ao calcular total. Tente novamente."));
            } finally {
                setLoading(false);
            }
        };

        fetchCalculation();
    }, [courses, paymentPlan, t, persistentRef]); // persistentRef added to deps

    const handleProcessPayment = () => {
        if (!selectedMethod) {
            toast.error(t('select_payment_method', "Selecione um método de pagamento."));
            return;
        }

        setProcessing(true);

        // Simulation of Processing
        setTimeout(() => {
            setProcessing(false);
            onComplete({
                reference: paymentData.reference,
                method: selectedMethod,
                amount: paymentData.breakdown.total,
                status: 'pending' // pending until webhook or confirmation
            });
        }, 2000);
    };

    if (loading && !paymentData) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-gray-500">
                <Loader2 className="animate-spin mb-2" size={32} />
                <p>{t('calculating_costs', 'Calculando custos...')}</p>
            </div>
        );
    }

    if (!paymentData) return <div className="text-red-500">{t('error_loading_data', 'Erro ao carregar dados.')}</div>;

    const { breakdown } = paymentData;
    // Use the persistent reference if available, else fallback
    const displayReference = persistentRef || "ZT-PAY-2026-A7MD";

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Header / Reference */}
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg flex justify-between items-center">
                <div>
                    <h4 className="text-xs font-bold text-blue-800 uppercase tracking-widest">{t('payment_reference', 'Referência de Pagamento')}</h4>
                    <div className="text-2xl font-mono font-bold text-blue-900">{displayReference}</div>
                </div>
                <div className="text-right">
                    <div className="text-xs text-blue-600">{t('student_id', 'ID do Estudante')}</div>
                    <div className="font-mono font-bold text-blue-800">{studentData.student_code}</div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Left Col: Invoice & Plan */}
                <div className="space-y-6">
                    {/* Items List */}
                    <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                        <div className="bg-gray-50 px-4 py-3 border-b flex justify-between items-center">
                            <h3 className="font-semibold text-gray-700">{t('invoice_summary', 'Resumo da Fatura')}</h3>

                            {/* Plan Toggle */}
                            <div className="flex bg-gray-200 rounded-lg p-0.5 text-xs">
                                <button
                                    onClick={() => setPaymentPlan('monthly')}
                                    className={`px-3 py-1.5 rounded-md transition-all ${paymentPlan === 'monthly' ? 'bg-white shadow text-black' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    {t('standard_plan', 'Padrão')}
                                </button>
                                <button
                                    onClick={() => setPaymentPlan('full')}
                                    className={`px-3 py-1.5 rounded-md transition-all ${paymentPlan === 'full' ? 'bg-white shadow text-black' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    {t('full_course_plan', 'Curso Completo')}
                                </button>
                            </div>
                        </div>

                        <div className="p-4 space-y-3">
                            {breakdown.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between text-sm">
                                    <div className="flex-1">
                                        <span className="font-medium text-gray-800">{item.description}</span>
                                        {item.qty > 1 && <span className="text-gray-500 text-xs ml-2">x{item.qty}</span>}
                                    </div>
                                    <div className="font-mono text-gray-700">
                                        {item.total === 0 ? 'Grátis' : formatCurrency(item.total)}
                                    </div>
                                </div>
                            ))}

                            <div className="border-t pt-3 flex justify-between items-center mt-4">
                                <span className="text-lg font-bold text-gray-900">{t('total_to_pay', 'Total a Pagar')}</span>
                                <span className="text-lg font-bold text-primary">
                                    {formatCurrency(breakdown.total)}
                                </span>
                            </div>
                        </div>


                    </div>
                </div>

                {/* Right Col: Methods & Action */}
                <div className="space-y-6">
                    <PaymentMethodSelector
                        selectedMethod={selectedMethod}
                        onSelectMethod={setSelectedMethod}
                    />

                    <div className="pt-4 border-t">
                        <Button
                            className="w-full h-12 text-lg shadow-lg hover:shadow-xl transition-all"
                            onClick={handleProcessPayment}
                            disabled={!selectedMethod || processing}
                        >
                            {processing ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    {t('processing', 'Processando...')}
                                </>
                            ) : (
                                t('confirm_payment', "Confirmar Pagamento / Inscrição")
                            )}
                        </Button>
                        <p className="text-xs text-center mt-3 text-gray-500">
                            {t('terms_acceptance', 'Ao confirmar, você aceita os termos e condições financeiros do ZTS.')}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentSummary;
