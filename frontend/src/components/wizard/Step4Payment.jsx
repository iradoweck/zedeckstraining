import { useState } from 'react';
import { Button } from '../ui/button';
import { ArrowRight, ArrowLeft, Download, Upload, CheckCircle } from 'lucide-react';
import jsPDF from 'jspdf';
import { Input } from '../ui/input';

export default function Step4Payment({ formData, updateFormData, onNext, onBack }) {
    const [selectedMethod, setSelectedMethod] = useState('');
    const [payUniformLater, setPayUniformLater] = useState(false);
    const [proofFile, setProofFile] = useState(null);
    const [showPopup, setShowPopup] = useState(false);

    const handleMethodSelect = (method) => {
        setSelectedMethod(method);
        updateFormData({ paymentMethod: method });
        if (['M-Pesa', 'e-Mola', 'Stripe', 'PayPal', 'Pix'].includes(method)) {
            // For auto gateways, we might show popup immediately or after confirmation
            // Logic: If Manual (Bank), show upload. If Custom Gateway, show Popup simulation.
        }
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProofFile(file);
            updateFormData({ paymentProof: file }); // Store file object
        }
    };

    const generateInvoicePDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(22);
        doc.setTextColor(218, 165, 32);
        doc.text("Fatura Proforma", 20, 20);
        // ... (Invoice generation logic same as before but updated content)
        doc.save(`Invoice-${formData.generatedId}.pdf`);
    };

    const handleFinish = () => {
        if (['M-Pesa', 'e-Mola'].includes(selectedMethod)) {
            setShowPopup(true);
        } else {
            onNext();
        }
    };

    return (
        <div className="space-y-8 relative">
            <h2 className="text-2xl font-bold font-heading mb-6">Pagamento & Uniforme</h2>

            {/* Payment Methods Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                    { id: 'M-Pesa', color: 'red-600', bg: 'red-50', border: 'red-500' },
                    { id: 'e-Mola', color: 'blue-600', bg: 'blue-50', border: 'blue-500' },
                    { id: 'Transferência', label: 'BIM / BCI', color: 'gray-900', bg: 'gray-50', border: 'gray-900' },
                    { id: 'Stripe', color: 'purple-600', bg: 'purple-50', border: 'purple-500' },
                    { id: 'PayPal', color: 'blue-800', bg: 'blue-100', border: 'blue-800' },
                    { id: 'Pix', color: 'green-600', bg: 'green-50', border: 'green-500' }
                ].map((m) => (
                    <div
                        key={m.id}
                        onClick={() => handleMethodSelect(m.id)}
                        className={`p-4 rounded-xl border-2 cursor-pointer flex flex-col items-center justify-center gap-2 transition-all ${selectedMethod === m.id
                            ? `border-${m.border} bg-${m.bg} ring-2 ring-${m.border} ring-offset-2`
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-400'
                            }`}
                    >
                        <span className={`font-bold text-${m.color}`}>{m.label || m.id}</span>
                    </div>
                ))}
            </div>

            {/* Uniform Toggle */}
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">Taxa de Uniforme</h4>
                    <p className="text-xs text-gray-500">Opcional no ato da inscrição.</p>
                </div>
                <label className="flex items-center cursor-pointer">
                    <div className="relative">
                        <input
                            type="checkbox"
                            className="sr-only"
                            checked={payUniformLater}
                            onChange={() => {
                                const newValue = !payUniformLater;
                                setPayUniformLater(newValue);
                                updateFormData({ uniformOption: newValue ? 'pay_later' : 'include_now' });
                            }}
                        />
                        <div className={`block w-14 h-8 rounded-full transition-colors ${payUniformLater ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${payUniformLater ? 'transform translate-x-6' : ''}`}></div>
                    </div>
                    <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                        {payUniformLater ? 'Pagar Depois' : 'Incluir Agora'}
                    </span>
                </label>
            </div>

            {/* Dynamic Content based on Method */}
            {selectedMethod === 'Transferência' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                    <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm space-y-2">
                        <p><strong>Titular:</strong> Zedeck's Training Lda</p>
                        <p><strong>BIM:</strong> 123456789</p>
                        <p><strong>BCI:</strong> 987654321</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Comprovativo de Pagamento (PDF, PNG, JPG)</label>
                        <div className="flex items-center gap-4">
                            <label className="flex-1 cursor-pointer border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 flex flex-col items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                <Upload className="text-gray-400 mb-2" />
                                <span className="text-sm text-gray-500">{proofFile ? proofFile.name : 'Clique para carregar'}</span>
                                <input type="file" className="hidden" accept=".pdf,.png,.jpg,.jpeg" onChange={handleFileUpload} />
                            </label>
                        </div>
                    </div>
                </div>
            )}

            {/* Popup Simulation */}
            {showPopup && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-2xl">
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 max-w-sm w-full text-center animate-in zoom-in-95">
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="animate-pulse font-bold">$</span>
                        </div>
                        <h3 className="text-xl font-bold mb-2">Processando {selectedMethod}...</h3>
                        <p className="text-gray-500 text-sm mb-6">
                            Verifique seu aplicativo para confirmar a transação.
                        </p>
                        <Button onClick={onNext} className="w-full">
                            Confirmar Pagamento
                        </Button>
                    </div>
                </div>
            )}

            <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
                    <ArrowLeft size={18} /> Voltar
                </Button>
                <Button
                    onClick={handleFinish}
                    disabled={!selectedMethod || (selectedMethod === 'Transferência' && !proofFile)}
                    className="flex items-center gap-2"
                >
                    Finalizar Inscrição <ArrowRight size={18} />
                </Button>
            </div>
        </div>
    );
}
