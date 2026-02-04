import React from 'react';
import { CreditCard, Banknote, Smartphone, Building, RefreshCw } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs.jsx";
import { Card } from "./ui/card.jsx";
import { useTranslation } from 'react-i18next';

const PaymentMethodSelector = ({ onSelectMethod, selectedMethod }) => {
    const { t } = useTranslation();

    const methods = {
        api: [
            { id: 'mpesa_api', name: 'M-Pesa', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/M-PESA_LOGO-01.svg/1200px-M-PESA_LOGO-01.svg.png', color: 'bg-red-500' },
            { id: 'emola_api', name: 'E-Mola', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/22/Emola_logo.png', color: 'bg-orange-500' }, // Placeholder
            { id: 'stripe', name: 'Stripe', logo: 'https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg', color: 'bg-indigo-600' }
        ],
        manual: [
            { id: 'mpesa_manual', name: 'M-Pesa (Manual)', icon: Smartphone, color: 'bg-red-600' },
            { id: 'emola_manual', name: 'E-Mola (Manual)', icon: Smartphone, color: 'bg-orange-600' },
            { id: 'transfer', name: 'Transf. Bancária', icon: Building, color: 'bg-gray-600' },
            { id: 'pos', name: 'POS (Presencial)', icon: CreditCard, color: 'bg-emerald-600' },
            { id: 'cash', name: 'Dinheiro', icon: Banknote, color: 'bg-green-600' }
        ]
    };

    return (
        <div className="w-full">
            <h3 className="text-sm font-medium text-gray-700 mb-3">{t('payment_method_label')}</h3>

            <Tabs defaultValue="api" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="api">Automático (Mais Rápido)</TabsTrigger>
                    <TabsTrigger value="manual">Manual / Presencial</TabsTrigger>
                </TabsList>

                {/* API Methods */}
                <TabsContent value="api" className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {methods.api.map((method) => (
                        <Card
                            key={method.id}
                            className={`cursor-pointer border-2 transition-all hover:scale-105 p-4 flex flex-col items-center justify-center gap-2
                                ${selectedMethod === method.id
                                    ? 'border-primary bg-primary/5 shadow-md'
                                    : 'border-transparent bg-gray-50 hover:bg-white hover:shadow-sm'}`}
                            onClick={() => onSelectMethod(method.id)}
                        >
                            <div className={`h-12 w-12 flex items-center justify-center p-1 rounded-full ${method.logo ? 'bg-white' : method.color}`}>
                                {method.logo ? (
                                    <img src={method.logo} alt={method.name} className="h-full w-full object-contain" onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.classList.add(method.color) }} />
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
                    {methods.manual.map((method) => (
                        <Card
                            key={method.id}
                            className={`cursor-pointer border-2 transition-all hover:scale-105 p-3 flex flex-col items-center justify-center gap-2
                                ${selectedMethod === method.id
                                    ? 'border-primary bg-primary/5 shadow-md'
                                    : 'border-transparent bg-gray-50 hover:bg-white hover:shadow-sm'}`}
                            onClick={() => onSelectMethod(method.id)}
                        >
                            <div className={`p-2 rounded-full text-white ${method.color}`}>
                                <method.icon size={18} />
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
