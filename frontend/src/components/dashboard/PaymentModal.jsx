import React, { useState } from 'react';
import { X, CreditCard, Upload, CheckCircle, Smartphone, Building } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/button';

export const PaymentModal = ({ invoice, isOpen, onClose, onConfirm }) => {
    const { t } = useTranslation();
    const [tab, setTab] = useState('auto'); // auto (M-Pesa/e-Mola) | manual (Bank)
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');

    if (!isOpen || !invoice) return null;

    const handlePayment = () => {
        setIsProcessing(true);
        // Simulate API call
        setTimeout(() => {
            setIsProcessing(false);
            setIsSuccess(true);
            setTimeout(() => {
                onConfirm(invoice);
                setIsSuccess(false);
                onClose();
            }, 2000);
        }, 2000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        {t('pay_invoice', 'Pagar Fatura')}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Invoice Summary */}
                    <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl mb-6 flex justify-between items-center">
                        <div>
                            <p className="text-xs text-blue-600 dark:text-blue-400 uppercase font-bold">{invoice.id}</p>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{invoice.description}</p>
                        </div>
                        <div className="text-xl font-bold text-blue-700 dark:text-blue-400">
                            {new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: 'MZN' }).format(invoice.amount)}
                        </div>
                    </div>

                    {isSuccess ? (
                        <div className="text-center py-8">
                            <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mb-4">
                                <CheckCircle className="w-8 h-8" />
                            </div>
                            <h4 className="text-lg font-bold text-gray-900 dark:text-white">{t('payment_success', 'Pagamento Confirmado!')}</h4>
                            <p className="text-sm text-gray-500 mt-2">{t('payment_success_desc', 'Seu recibo já está disponível na área de documentos.')}</p>
                        </div>
                    ) : (
                        <>
                            {/* Tabs */}
                            <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-lg mb-6">
                                <button
                                    onClick={() => setTab('auto')}
                                    className={`flex-1 flex items-center justify-center py-2 text-sm font-medium rounded-md transition-all ${tab === 'auto'
                                            ? 'bg-white dark:bg-gray-800 shadow-sm text-gray-900 dark:text-white'
                                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
                                        }`}
                                >
                                    <Smartphone className="w-4 h-4 mr-2" />
                                    M-Pesa / e-Mola
                                </button>
                                <button
                                    onClick={() => setTab('manual')}
                                    className={`flex-1 flex items-center justify-center py-2 text-sm font-medium rounded-md transition-all ${tab === 'manual'
                                            ? 'bg-white dark:bg-gray-800 shadow-sm text-gray-900 dark:text-white'
                                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
                                        }`}
                                >
                                    <Building className="w-4 h-4 mr-2" />
                                    {t('bank_deposit', 'Depósito Bancário')}
                                </button>
                            </div>

                            {/* Tab Content */}
                            {tab === 'auto' ? (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            {t('phone_number', 'Número de Celular')}
                                        </label>
                                        <input
                                            type="tel"
                                            placeholder="84/85 xxx xxxx"
                                            value={phoneNumber}
                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            {t('mpesa_instruction', 'Você receberá um prompt no celular para confirmar o PIN.')}
                                        </p>
                                    </div>
                                    <Button
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12"
                                        onClick={handlePayment}
                                        disabled={isProcessing}
                                    >
                                        {isProcessing ? t('processing', 'Processando...') : t('pay_now', 'Pagar Agora')}
                                    </Button>
                                    <div className="flex justify-center gap-4 mt-2 opacity-60 grayscale">
                                        <div className="h-6 w-12 bg-gray-200 rounded"></div> {/* M-Pesa Logo Placeholder */}
                                        <div className="h-6 w-12 bg-gray-200 rounded"></div> {/* e-Mola Logo Placeholder */}
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="p-4 border border-dashed border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-900/50 text-center">
                                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                            {t('upload_proof', 'Carregar Comprovativo')}
                                        </p>
                                        <p className="text-xs text-gray-400">PDF, JPG ou PNG (Max 2MB)</p>
                                        <Button variant="outline" size="sm" className="mt-4">
                                            {t('choose_file', 'Escolher Arquivo')}
                                        </Button>
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                                        <p className="font-bold mb-1">Dados Bancários:</p>
                                        <p>Millennium BIM: 123456789</p>
                                        <p>BCI: 987654321</p>
                                        <p>Titular: Zedeck's Training</p>
                                    </div>
                                    <Button
                                        className="w-full"
                                        onClick={handlePayment}
                                        disabled={isProcessing}
                                    >
                                        {isProcessing ? t('sending', 'Enviando...') : t('submit_proof', 'Enviar Comprovativo')}
                                    </Button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
