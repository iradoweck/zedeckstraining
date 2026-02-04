import React from 'react';
import { CreditCard, Banknote, Smartphone, Building2, Wallet } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs.jsx";
import { Card } from "./ui/card.jsx";
import { useTranslation } from 'react-i18next';

const PaymentMethodSelector = ({ onSelectMethod, selectedMethod }) => {
    const { t } = useTranslation();

    const paymentMethods = {
        automatic: [
            {
                id: 'mpesa',
                name: 'M-Pesa',
                logo: '/assets/mpesa-logo.png',
                description: 'Pagar via M-Pesa'
            },
            {
                id: 'emola',
                name: 'E-Mola',
                logo: '/assets/emola-logo.png',
                description: 'Pagar via E-Mola'
            },
            {
                id: 'stripe',
                name: 'Cartão / Stripe',
                logo: 'https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg',
                description: 'Visa, Mastercard, Amex'
            }
        ],
        manual: [
            {
                id: 'mpesa_manual',
                name: 'M-Pesa (Manual)',
                logo: '/assets/mpesa-logo.png',
                description: 'Enviar Comprovativo'
            },
            {
                id: 'emola_manual',
                name: 'E-Mola (Manual)',
                logo: '/assets/emola-logo.png',
                description: 'Enviar Comprovativo'
            },
            {
                id: 'bank',
                name: 'Transferência Bancária',
                icon: Building2,
                description: 'Millennium BIM'
            },
            {
                id: 'pos',
                name: 'POS (Presencial)',
                icon: CreditCard,
                description: 'Pagar na Secretaria'
            },
            {
                id: 'cash',
                name: 'Numerário',
                icon: Wallet,
                description: 'Pagar na Secretaria'
            }
        ]
    };

    return (
        <div className="w-full">
            <h3 className="text-sm font-medium text-gray-700 mb-3">{t('payment_method_label')}</h3>

            <Tabs defaultValue="automatic" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="automatic">Automático</TabsTrigger>
                    <TabsTrigger value="manual">Manual / Presencial</TabsTrigger>
                </TabsList>

                {/* API Methods */}
                <TabsContent value="automatic" className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {paymentMethods.automatic.map((method) => (
                        <Card
                            key={method.id}
                            className={`cursor-pointer border-2 transition-all hover:scale-105 p-4 flex flex-col items-center justify-center gap-2
                                ${selectedMethod === method.id
                                    ? 'border-primary bg-primary/5 shadow-md'
                                    : 'border-transparent bg-gray-50 hover:bg-white hover:shadow-sm'}`}
                            onClick={() => onSelectMethod(method.id)}
                        >
                            <div className={`h-12 w-12 flex items-center justify-center p-1 rounded-full ${method.logo ? 'bg-white shadow-sm border border-gray-100' : (method.color || 'bg-blue-600')}`}>
                                {method.logo ? (
                                    <img src={method.logo} alt={method.name} className="h-full w-full object-contain" onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.classList.add('bg-gray-200') }} />
                                ) : (
                                    <Smartphone size={24} className="text-white" />
                                )}
                            </div>
                            <span className="text-xs font-bold text-gray-700">{method.name}</span>
                        </Card>
                    ))}
                </TabsContent>

                {/* Manual Methods */}
                <TabsContent value="manual" className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {paymentMethods.manual.map((method) => (
                        <Card
                            key={method.id}
                            className={`cursor-pointer border-2 transition-all hover:scale-105 p-3 flex flex-col items-center justify-center gap-2
                                ${selectedMethod === method.id
                                    ? 'border-primary bg-primary/5 shadow-md'
                                    : 'border-transparent bg-gray-50 hover:bg-white hover:shadow-sm'}`}
                            onClick={() => onSelectMethod(method.id)}
                        >
                            <div className={`p-2 rounded-full flex items-center justify-center ${method.logo ? 'bg-white h-10 w-10 shadow-sm border border-gray-100' : 'bg-gray-600 text-white'}`}>
                                {method.logo ? (
                                    <img src={method.logo} alt={method.name} className="h-full w-full object-contain" />
                                ) : (
                                    <method.icon size={18} />
                                )}
                            </div>
                            <span className="text-[10px] font-bold text-gray-700 text-center">{method.name}</span>
                        </Card>
                    ))}
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default PaymentMethodSelector;
