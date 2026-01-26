import { useState } from 'react';
import { Button } from '../ui/Button';
import { ArrowRight, ArrowLeft, Download, CheckCircle } from 'lucide-react';
import jsPDF from 'jspdf';

export default function Step4Payment({ formData, updateFormData, onNext, onBack }) {
    const [selectedMethod, setSelectedMethod] = useState('');
    const [showPopup, setShowPopup] = useState(false);

    const handleMethodSelect = (method) => {
        setSelectedMethod(method);
        updateFormData({ paymentMethod: method });
        if (method === 'M-Pesa' || method === 'e-Mola') {
            setShowPopup(true);
        }
    };

    const generateInvoicePDF = () => {
        const doc = new jsPDF();

        doc.setFontSize(22);
        doc.setTextColor(218, 165, 32); // Gold color approximation
        doc.text("Relatorio de Inscricao", 20, 20);

        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.text("Zedeck's Training", 20, 30);

        doc.setFontSize(12);
        doc.text(`Nome: ${formData.firstName} ${formData.lastName}`, 20, 50);
        doc.text(`ID Estudante: ${formData.generatedId}`, 20, 60);
        doc.text(`Data: ${new Date().toLocaleDateString()}`, 20, 70);

        doc.text("------------------------------------------------", 20, 80);
        doc.text("Instruções de Pagamento:", 20, 90);
        doc.text(`Metodo Escolhido: ${formData.paymentMethod}`, 20, 100);
        doc.text("Referência: 86 613 3052 (M-Pesa / e-Mola)", 20, 110);

        doc.save(`Invoice-${formData.generatedId}.pdf`);
    };

    return (
        <div className="space-y-8 relative">
            <h2 className="text-2xl font-bold font-heading mb-6">Pagamento</h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Payment Methods */}
                <div
                    onClick={() => handleMethodSelect('M-Pesa')}
                    className={`p-6 rounded-xl border-2 cursor-pointer flex flex-col items-center gap-3 transition-all ${selectedMethod === 'M-Pesa' ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-red-200'}`}
                >
                    <div className="font-bold text-red-600 text-lg">M-Pesa</div>
                    <p className="text-xs text-center text-gray-500">Pagamento Automático</p>
                </div>

                <div
                    onClick={() => handleMethodSelect('e-Mola')}
                    className={`p-6 rounded-xl border-2 cursor-pointer flex flex-col items-center gap-3 transition-all ${selectedMethod === 'e-Mola' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-200'}`}
                >
                    <div className="font-bold text-blue-600 text-lg">e-Mola</div>
                    <p className="text-xs text-center text-gray-500">Pagamento Automático</p>
                </div>

                <div
                    onClick={() => handleMethodSelect('Transferência')}
                    className={`p-6 rounded-xl border-2 cursor-pointer flex flex-col items-center gap-3 transition-all ${selectedMethod === 'Transferência' ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:border-gray-400'}`}
                >
                    <div className="font-bold text-gray-900 text-lg">Bim/BCI</div>
                    <p className="text-xs text-center text-gray-500">Transferência Bancária</p>
                </div>
            </div>

            {selectedMethod && (
                <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 animate-in fade-in slide-in-from-bottom-4">
                    <h3 className="font-bold mb-4">Documentos de Pagamento</h3>
                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                            Baixe a fatura com os detalhes para realizar o pagamento.
                        </div>
                        <Button variant="outline" onClick={generateInvoicePDF} className="flex items-center gap-2">
                            <Download size={18} /> Baixar PDF
                        </Button>
                    </div>
                </div>
            )}

            {/* Popup Simulation */}
            {showPopup && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-2xl">
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 max-w-sm w-full text-center animate-in zoom-in-95">
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="animate-pulse">$$$</span>
                        </div>
                        <h3 className="text-xl font-bold mb-2">Aguardando Pagamento...</h3>
                        <p className="text-gray-500 text-sm mb-6">
                            Verifique seu celular. Uma notificação do {selectedMethod} foi enviada para confirmar a transação.
                        </p>
                        <Button onClick={() => setShowPopup(false)} className="w-full">
                            Confirmar
                        </Button>
                    </div>
                </div>
            )}

            <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
                    <ArrowLeft size={18} /> Voltar
                </Button>
                <Button onClick={onNext} disabled={!selectedMethod} className="flex items-center gap-2">
                    Finalizar Inscrição <ArrowRight size={18} />
                </Button>
            </div>
        </div>
    );
}
