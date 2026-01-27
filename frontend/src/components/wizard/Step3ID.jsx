import { useRef, useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { ArrowRight, ArrowLeft, Download, CreditCard, RefreshCw } from 'lucide-react';
import html2canvas from 'html2canvas';
import QRCode from 'react-qr-code';

export default function Step3ID({ formData, updateFormData, onNext, onBack }) {
    const cardRef = useRef(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isFlipped, setIsFlipped] = useState(false);

    // Generate Student Code (Simulation - Ideally this calls an API)
    useEffect(() => {
        if (!formData.generatedId) {
            const random = Math.floor(1000 + Math.random() * 9000);
            const year = new Date().getFullYear();
            const code = `ZT-${year}-${random}`;
            updateFormData({ generatedId: code });
        }
    }, [formData.generatedId, updateFormData]);

    const handleDownload = async () => {
        setIsGenerating(true);
        // Ensure the card is "front" side for download or capture both? 
        // User said "Static when downloading". Usually front is consistent.
        // We'll capture the front face container.

        if (cardRef.current) {
            try {
                const canvas = await html2canvas(cardRef.current, {
                    scale: 3, // Higher quality
                    backgroundColor: null,
                    useCORS: true
                });
                const image = canvas.toDataURL('image/png');

                const link = document.createElement('a');
                link.href = image;
                link.download = `${formData.firstName}-${formData.lastName}-ID.png`;
                link.click();
            } catch (err) {
                console.error("Failed to generate card", err);
            }
        }
        setIsGenerating(false);
    };

    const toggleFlip = () => setIsFlipped(!isFlipped);

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h2 className="text-2xl font-bold font-heading mb-2">Seu Cartão de Estudante</h2>
                <p className="text-gray-500">Clique no cartão para ver o verso. Baixe-o para finalizar.</p>
            </div>

            <div className="flex justify-center perspective-1000">
                {/* ID Card 3D Container - Click to Flip */}
                <div
                    className={`relative w-[340px] h-[214px] transition-transform duration-700 transform-style-3d cursor-pointer ${isFlipped ? 'rotate-y-180' : ''}`}
                    onClick={toggleFlip}
                >
                    {/* Front Face */}
                    <div
                        ref={cardRef}
                        className="absolute inset-0 w-full h-full bg-white rounded-xl shadow-2xl overflow-hidden backface-hidden border border-gray-200"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Cpath d='M0 0h20L0 20z'/%3E%3C/g%3E%3C/svg%3E"), linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)`
                        }}
                    >
                        {/* Watermark Icon Pattern */}
                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none flex flex-wrap gap-8 p-4 justify-center items-center rotate-12 scale-150">
                            {Array.from({ length: 12 }).map((_, i) => (
                                <img key={i} src="/assets/icon.png" className="w-16 h-16 grayscale" />
                            ))}
                        </div>

                        {/* Banner */}
                        <div className="bg-gray-900 h-16 flex items-center px-4 justify-between relative z-10">
                            <div className="flex items-center gap-2">
                                <img src="/logo.png" alt="Zedeck's Training" className="h-8 w-auto mix-blend-screen" />
                            </div>
                            <div className="text-[10px] text-white/50 text-right">
                                ©{new Date().getMonth() + 1}/{new Date().getFullYear()}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-4 flex gap-4 relative z-10">
                            <div className="w-24 h-24 bg-white rounded-lg p-1 shadow-sm border border-gray-100">
                                {formData.profilePhoto ? (
                                    <img src={URL.createObjectURL(formData.profilePhoto)} className="w-full h-full object-cover rounded" />
                                ) : (
                                    <img src={`https://ui-avatars.com/api/?name=${formData.firstName}+${formData.lastName}&background=random`} className="w-full h-full object-cover rounded" />
                                )}
                            </div>
                            <div className="flex-1 space-y-1">
                                <h3 className="font-bold text-gray-900 uppercase leading-tight line-clamp-2">{formData.firstName} {formData.lastName}</h3>
                                <p className="text-xs text-gray-500 uppercase">{formData.occupation || 'Estudante'}</p>
                                <div className="pt-2 space-y-0.5">
                                    <p className="text-[10px] text-gray-400 uppercase">ID CODE</p>
                                    <p className="font-mono text-sm font-bold text-primary">{formData.generatedId}</p>
                                </div>
                            </div>
                        </div>

                        {/* Footer Stripe */}
                        <div className="absolute bottom-0 w-full bg-primary/10 py-1 px-4 flex justify-between items-center z-10">
                            <span className="text-[10px] text-gray-500 font-medium">STUDENT CARD</span>
                        </div>
                    </div>

                    {/* Back Face */}
                    <div
                        className="absolute inset-0 w-full h-full bg-gray-900 text-white rounded-xl shadow-2xl overflow-hidden backface-hidden rotate-y-180 flex flex-col items-center justify-center p-6 border border-gray-700"
                    >
                        <div className="bg-white p-2 rounded-lg">
                            <QRCode value={`https://zedecks.com/verify/${formData.generatedId}`} size={100} />
                        </div>
                        <p className="mt-4 text-xs text-gray-400 text-center">
                            Escaneie para validar a inscrição e status do estudante.
                        </p>
                        <p className="mt-2 font-mono text-sm text-primary font-bold">{formData.generatedId}</p>
                    </div>
                </div>
            </div>

            <div className="flex flex-col items-center gap-4">
                <div className="text-sm text-gray-400 flex items-center gap-2">
                    <RefreshCw size={14} /> Toque no cartão para virar
                </div>

                <Button onClick={handleDownload} variant="outline" className="w-full max-w-xs flex items-center justify-center gap-2" disabled={isGenerating}>
                    <Download size={18} /> {isGenerating ? 'Gerando PNG...' : 'Baixar ID Card'}
                </Button>
            </div>

            <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
                    <ArrowLeft size={18} /> Voltar
                </Button>
                <Button onClick={onNext} className="flex items-center gap-2">
                    Continuar para Pagamento <ArrowRight size={18} />
                </Button>
            </div>

            {/* CSS for 3D Transform - Ideally in index.css but added here for encapsulation if not present */}
            <style jsx="true">{`
                .perspective-1000 { perspective: 1000px; }
                .transform-style-3d { transform-style: preserve-3d; }
                .backface-hidden { backface-visibility: hidden; }
                .rotate-y-180 { transform: rotateY(180deg); }
            `}</style>
        </div>
    );
}
