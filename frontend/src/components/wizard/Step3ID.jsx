import { useRef, useState } from 'react';
import { Button } from '../ui/Button';
import { ArrowRight, ArrowLeft, Download, RefreshCw } from 'lucide-react';
import html2canvas from 'html2canvas';
import QRCode from 'react-qr-code';

export default function Step3ID({ formData, updateFormData, onNext, onBack }) {
    const exportRef = useRef(null);
    const [isToDownload, setIsToDownload] = useState(false);
    const [isFlipped, setIsFlipped] = useState(false);

    // Ensure ID exists
    if (!formData.generatedId) {
        const random = Math.floor(1000 + Math.random() * 9000);
        const year = new Date().getFullYear();
        updateFormData({ generatedId: `ZT-${year}-${random}` });
    }

    const handleDownload = async () => {
        setIsToDownload(true);

        // Wait for state update to ensure hidden container is ready if not already
        setTimeout(async () => {
            if (exportRef.current) {
                try {
                    const canvas = await html2canvas(exportRef.current, {
                        scale: 3,
                        backgroundColor: null,
                        useCORS: true
                    });
                    const image = canvas.toDataURL('image/png');
                    const link = document.createElement('a');
                    link.href = image;
                    link.download = `${formData.firstName}-${formData.lastName}-ID-Full.png`;
                    link.click();
                } catch (err) {
                    console.error("Failed", err);
                }
                setIsToDownload(false);
            }
        }, 100);
    };

    // Card Component to reuse logic for Display and Export
    const IDCard = ({ isFront = true }) => (
        <div className="relative w-[360px] h-[220px] rounded-2xl overflow-hidden shadow-2xl bg-slate-900 border border-slate-800">
            {/* Decorative Shapes */}
            <div className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-amber-400 to-orange-600 rounded-full blur-2xl opacity-20 -translate-y-10 translate-x-10 pointer-events-none`}></div>
            <div className={`absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-full blur-2xl opacity-10 translate-y-10 -translate-x-10 pointer-events-none`}></div>

            {isFront ? (
                // FRONT CONTENT
                <>
                    {/* Gold Accent Line */}
                    <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-amber-300 via-orange-500 to-amber-300"></div>

                    <div className="relative z-10 h-full flex flex-col p-5 pl-7">
                        {/* Header */}
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-2">
                                <img src="/logo.png" alt="ZT" className="h-8 w-auto object-contain brightness-0 invert" />
                            </div>
                            <div className="text-[10px] text-white/40 font-mono border border-white/10 px-2 py-0.5 rounded">
                                {new Date().getFullYear()}
                            </div>
                        </div>

                        {/* Body */}
                        <div className="flex gap-4 items-center">
                            {/* Photo Container with Gold Ring */}
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-tr from-amber-400 to-orange-600 rounded-full blur-sm opacity-50"></div>
                                <div className="w-20 h-20 rounded-full p-0.5 bg-gradient-to-tr from-amber-300 to-orange-500 relative z-10">
                                    <div className="w-full h-full rounded-full overflow-hidden bg-slate-800">
                                        {formData.profilePhoto ? (
                                            <img src={URL.createObjectURL(formData.profilePhoto)} className="w-full h-full object-cover" />
                                        ) : (
                                            <img src={`https://ui-avatars.com/api/?name=${formData.firstName}+${formData.lastName}&background=1e293b&color=fbbf24`} className="w-full h-full object-cover" />
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Text Info */}
                            <div className="text-white space-y-0.5">
                                <h3 className="font-bold text-lg leading-tight tracking-wide">{formData.firstName}</h3>
                                <h3 className="font-light text-lg leading-tight tracking-wide text-white/90">{formData.lastName}</h3>
                                <p className="text-xs text-amber-500 font-bold uppercase tracking-wider mt-1">{formData.occupation || 'STUDENT'}</p>
                                <p className="text-[10px] text-slate-400 font-mono mt-1">{formData.generatedId}</p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="mt-auto flex justify-between items-end border-t border-white/5 pt-2">
                            <div className="text-[9px] text-slate-500">
                                www.zedecks-training.com <br /> Maputo, Moçambique
                            </div>
                            <div className="text-[9px] text-amber-500/80 font-mono">
                                VALID: 12/{new Date().getFullYear()}
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                // BACK CONTENT
                <div className="w-full h-full flex flex-col items-center justify-center p-6 relative">
                    {/* Slanted Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 z-0"></div>
                    <div className="absolute right-0 bottom-0 w-full h-32 bg-slate-950 -skew-y-6 translate-y-12 z-0"></div>

                    <div className="relative z-10 bg-white p-2 rounded-lg shadow-lg transform rotate-0"> {/* Ensure no rotation on export content */}
                        <QRCode value={`https://zedecks.com/verify/${formData.generatedId}`} size={90} />
                    </div>
                    <div className="relative z-10 mt-4 text-center">
                        <p className="text-xs text-slate-300 font-light tracking-wide mb-1">SCAN PARA VALIDAR</p>
                        <p className="text-xs text-amber-500 font-bold font-mono tracking-widest">{formData.generatedId}</p>
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <div className="space-y-8 flex flex-col items-center">
            <div className="text-center">
                <h2 className="text-2xl font-bold font-heading mb-2">Seu Cartão de Estudante</h2>
                <p className="text-gray-500">Toque para girar. Baixe para salvar (Frente e Verso).</p>
            </div>

            {/* Interactive Flipper View */}
            <div className="perspective-1000 w-full flex justify-center h-[220px]">
                <div
                    className={`relative w-[360px] h-[220px] transition-transform duration-700 transform-style-3d cursor-pointer ${isFlipped ? 'rotate-y-180' : ''}`}
                    onClick={() => setIsFlipped(!isFlipped)}
                >
                    {/* FRONT SIDE (Interactive) */}
                    <div className="absolute inset-0 w-full h-full backface-hidden">
                        <IDCard isFront={true} />
                    </div>

                    {/* BACK SIDE (Interactive) */}
                    <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
                        <IDCard isFront={false} />
                    </div>
                </div>
            </div>

            {/* Hidden Export View (Always Renders Both) */}
            <div className="absolute left-[9999px] top-0" ref={exportRef}>
                <div className="flex flex-col gap-4 p-4 bg-white">
                    <IDCard isFront={true} />
                    <IDCard isFront={false} />
                </div>
            </div>

            <div className="flex flex-col items-center gap-4 w-full max-w-sm mt-8">
                <div className="text-sm text-gray-400 flex items-center gap-2 animate-pulse hover:text-primary transition-colors cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
                    <RefreshCw size={14} className={isFlipped ? 'animate-spin' : ''} /> Virar Cartão
                </div>

                <Button
                    onClick={handleDownload}
                    variant="outline"
                    className="w-full border-amber-500/30 hover:bg-amber-500/10 hover:text-amber-600 dark:text-amber-500 transition-all duration-300 hover:scale-[1.02] active:scale-95"
                    disabled={isToDownload}
                >
                    <Download size={18} className="mr-2" /> {isToDownload ? 'Gerando...' : 'Baixar Cartão Completo'}
                </Button>
            </div>

            <div className="flex justify-between w-full pt-4">
                <Button variant="outline" onClick={onBack} className="flex items-center gap-2 transition-transform hover:-translate-x-1">
                    <ArrowLeft size={18} /> Voltar
                </Button>
                <Button onClick={onNext} className="flex items-center gap-2 transition-transform hover:translate-x-1 shadow-lg shadow-primary/20">
                    Continuar <ArrowRight size={18} />
                </Button>
            </div>

            <style jsx="true">{`
                .perspective-1000 { perspective: 1000px; }
                .transform-style-3d { transform-style: preserve-3d; }
                .backface-hidden { backface-visibility: hidden; }
                .rotate-y-180 { transform: rotateY(180deg); }
            `}</style>
        </div>
    );
}
