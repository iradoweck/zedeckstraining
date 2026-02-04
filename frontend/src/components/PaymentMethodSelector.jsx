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
                description: t('pay_via_mpesa')
            },
            {
                id: 'emola',
                name: 'E-Mola',
                logo: '/assets/emola-logo.png',
                description: t('pay_via_emola')
            },
            {
                id: 'stripe',
                name: t('card_stripe'),
                logo: 'https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg',
                description: t('pay_via_card')
            }
        ],
        manual: [
            {
                id: 'mpesa_manual',
                name: 'M-Pesa',
                logo: '/assets/mpesa-logo.png',
                description: t('send_proof')
            },
            {
                id: 'emola_manual',
                name: 'E-Mola',
                logo: '/assets/emola-logo.png',
                description: t('send_proof')
            },
            {
                id: 'bank',
                name: t('bank_transfer'),
                icon: Building2,
                description: t('pay_at_bank')
            },
            {
                id: 'pos',
                name: t('pos_presential'),
                icon: CreditCard,
                description: t('pay_at_pos')
            },
            {
                id: 'cash',
                name: t('cash'),
                icon: Wallet,
                description: t('pay_cash')
            }
        ]
    };

    return (
        <div className="w-full">
            <h3 className="text-sm font-medium text-gray-700 mb-3">{t('payment_method_label')}</h3>

            <Tabs defaultValue="automatic" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="automatic">{t('payment_automatic')}</TabsTrigger>
                    <TabsTrigger value="manual">{t('payment_manual')}</TabsTrigger>
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
                            <div className={`h-12 w-12 flex items-center justify-center rounded-full overflow-hidden ${method.logo ? 'bg-white shadow-sm border border-gray-100' : (method.color || 'bg-blue-600')}`}>
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
                            <div className={`rounded-full flex items-center justify-center overflow-hidden ${method.logo ? 'bg-white h-10 w-10 shadow-sm border border-gray-100' : 'p-2 bg-gray-600 text-white'}`}>
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
