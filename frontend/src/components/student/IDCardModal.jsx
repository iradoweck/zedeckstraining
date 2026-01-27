import { useRef, useState } from 'react';
import { Button } from '../ui/button';
import { Download, X } from 'lucide-react';
import html2canvas from 'html2canvas';

export default function IDCardModal({ user, onClose }) {
    const cardRef = useRef(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleDownload = async () => {
        setIsGenerating(true);
        if (cardRef.current) {
            try {
                const canvas = await html2canvas(cardRef.current, { scale: 2 });
                const image = canvas.toDataURL('image/png');

                const link = document.createElement('a');
                link.href = image;
                link.download = `Zedecks-Student-ID-${user.id}.png`;
                link.click();
            } catch (err) {
                console.error("Failed to generate card", err);
            }
        }
        setIsGenerating(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 relative">
                <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full z-10 text-gray-400 hover:text-gray-900">
                    <X size={20} />
                </button>

                <div className="p-6 text-center">
                    <h2 className="text-xl font-bold font-heading mb-6">Cartão de Estudante</h2>

                    <div className="flex justify-center mb-8">
                        {/* ID Card */}
                        <div
                            ref={cardRef}
                            className="w-[340px] h-[214px] bg-white relative rounded-xl shadow-lg overflow-hidden border border-gray-200 text-left"
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
                                    {user.profile_photo ? (
                                        <img src={user.profile_photo} className="w-full h-full object-cover" />
                                    ) : (
                                        <img src="/assets/icon.png" className="w-16 opacity-50" />
                                    )}
                                </div>
                                <div className="flex-1 space-y-1">
                                    <h3 className="font-bold text-gray-900 uppercase leading-tight">{user.name}</h3>
                                    <p className="text-xs text-gray-500 uppercase">Estudante</p>
                                    <div className="pt-2 space-y-0.5">
                                        <p className="text-[10px] text-gray-400 uppercase">ID No.</p>
                                        <p className="font-mono text-sm font-bold text-primary">ZT-2026-{user.id}</p>
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

                    <Button onClick={handleDownload} disabled={isGenerating} className="w-full flex items-center justify-center gap-2">
                        <Download size={18} /> {isGenerating ? 'Gerando...' : 'Baixar Cartão PNG'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
