import { useRef, useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { ArrowRight, ArrowLeft, Download, CreditCard } from 'lucide-react';
import html2canvas from 'html2canvas';

export default function Step3ID({ formData, updateFormData, onNext, onBack }) {
    const cardRef = useRef(null);
    const [generatedImage, setGeneratedImage] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);

    // Calculate Costs
    const isElectricity = formData.courses.some(id => id.toString() === 'electricidade' || id === 5); // Assuming ID 5 is electricity or title check needed. 
    // Since we don't have titles in formData, we might need to rely on assumptions or pass course objects. 
    // For MVP, lets assume uniform regular is 500.
    const uniformCost = isElectricity ? 1500 : 500;

    // Generate Student Code (Simulation)
    useEffect(() => {
        if (!formData.generatedId) {
            const random = Math.floor(1000 + Math.random() * 9000);
            const year = new Date().getFullYear();
            const code = `ZT-${year}-${random}`;
            updateFormData({ generatedId: code });
        }
    }, []);

    const handleDownload = async () => {
        setIsGenerating(true);
        if (cardRef.current) {
            try {
                const canvas = await html2canvas(cardRef.current, { scale: 2 });
                const image = canvas.toDataURL('image/png');
                setGeneratedImage(image);

                // Construct download link
                const link = document.createElement('a');
                link.href = image;
                link.download = `Zedecks-Student-ID-${formData.generatedId}.png`;
                link.click();
            } catch (err) {
                console.error("Failed to generate card", err);
            }
        }
        setIsGenerating(false);
    };

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h2 className="text-2xl font-bold font-heading mb-2">Seu Cartão de Estudante</h2>
                <p className="text-gray-500">Gere e baixe seu cartão digital provisório.</p>
            </div>

            <div className="flex justify-center">
                {/* ID Card Simulation */}
                <div
                    ref={cardRef}
                    className="w-[340px] h-[214px] bg-white relative rounded-xl shadow-2xl overflow-hidden border border-gray-200"
                    style={{ backgroundImage: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)' }}
                >
                    {/* Header */}
                    <div className="bg-gray-900 h-16 flex items-center px-4 justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-bold text-white text-xs">ZT</div>
                            <span className="text-white font-bold text-sm tracking-wide">ZEDECK'S TRAINING</span>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 flex gap-4">
                        <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden border-2 border-primary/20">
                            <img src="/assets/icon.png" className="w-16 opacity-50" />
                        </div>
                        <div className="flex-1 space-y-1">
                            <h3 className="font-bold text-gray-900 uppercase leading-tight">{formData.firstName} {formData.lastName}</h3>
                            <p className="text-xs text-gray-500 uppercase">Estudante</p>
                            <div className="pt-2 space-y-0.5">
                                <p className="text-[10px] text-gray-400 uppercase">ID No.</p>
                                <p className="font-mono text-sm font-bold text-primary">{formData.generatedId}</p>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="absolute bottom-0 w-full bg-primary/10 py-2 px-4 flex justify-between items-center">
                        <span className="text-[10px] text-gray-500 font-medium">Valido até: Dez {new Date().getFullYear()}</span>
                        <div className="w-12 h-4 bg-gray-800 rounded"></div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
                <div>
                    <h3 className="font-bold mb-4 flex items-center gap-2">
                        <CreditCard size={18} className="text-primary" /> Resumo de Custos Iniciais
                    </h3>
                    <ul className="space-y-3 text-sm">
                        <li className="flex justify-between">
                            <span>Taxa de Uniforme:</span>
                            <span className="font-bold">{uniformCost.toLocaleString()} MT</span>
                        </li>
                        <li className="flex justify-between">
                            <span>Primeira Mensalidade:</span>
                            <span className="font-bold">A calcular...</span> {/* Ideal to pull price from selected courses */}
                        </li>
                        <li className="flex justify-between pt-3 border-t border-gray-200 dark:border-gray-700 text-base">
                            <span className="font-bold">Total a Pagar:</span>
                            <span className="font-bold text-primary">--- MT</span>
                        </li>
                    </ul>
                </div>
                <div className="flex flex-col justify-center items-center gap-4">
                    <Button onClick={handleDownload} variant="outline" className="w-full flex items-center justify-center gap-2" disabled={isGenerating}>
                        <Download size={18} /> {isGenerating ? 'Gerando...' : 'Baixar Cartão PNG'}
                    </Button>
                    <p className="text-xs text-center text-gray-400">
                        O download do cartão é obrigatório para validação da inscrição.
                    </p>
                </div>
            </div>

            <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
                    <ArrowLeft size={18} /> Voltar
                </Button>
                <Button onClick={onNext} className="flex items-center gap-2">
                    Continuar para Pagamento <ArrowRight size={18} />
                </Button>
            </div>
        </div>
    );
}
