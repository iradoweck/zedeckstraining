import React, { useRef } from 'react';
import { Download, ShieldCheck } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { QRCodeSVG } from 'qrcode.react';
import html2canvas from 'html2canvas';

const AcademicCard = ({ studentData }) => {
    const { t } = useTranslation();
    const cardRef = useRef(null);

    const handleDownload = async () => {
        if (!cardRef.current) return;

        try {
            const loadingToast = toast.loading(t('downloading', 'Gerando imagem...'));

            // Wait for images/fonts
            await document.fonts.ready;

            const element = cardRef.current;
            // Get precise dimensions including fractional pixels
            const rect = element.getBoundingClientRect();
            const width = Math.ceil(rect.width);
            const height = Math.ceil(rect.height);

            const canvas = await html2canvas(element, {
                scale: 4, // Ultra high resolution
                useCORS: true,
                allowTaint: true,
                backgroundColor: null,
                width: width,
                height: height,
                onclone: (clonedDoc) => {
                    const clonedElement = clonedDoc.querySelector('[data-card-ref]');
                    if (clonedElement) {
                        clonedElement.style.transform = 'none';
                        clonedElement.style.boxShadow = 'none';

                        // Fix text rendering issues
                        const textElements = clonedElement.querySelectorAll('*');
                        textElements.forEach(el => {
                            el.style.textShadow = 'none'; // Shadows often cause doubling/blur
                            el.style.fontSmooth = 'antialiased';
                            el.style.webkitFontSmoothing = 'antialiased';
                            // el.style.letterSpacing = 'normal'; // Optional: if tracking causes gaps
                        });
                    }
                }
            });

            const link = document.createElement('a');
            link.download = `ZTS-ID-${studentData.student_code}.png`;
            link.href = canvas.toDataURL('image/png', 1.0);
            link.click();

            toast.dismiss(loadingToast);
            toast.success(t('download_card_success', 'Cartão baixado com sucesso!'));
        } catch (err) {
            console.error("Card Generation Error:", err);
            toast.dismiss();
            toast.error(t('download_card_error', 'Erro ao baixar cartão.'));
        }
    };

    // Validation URL (dynamic)
    const baseUrl = import.meta.env.VITE_APP_URL || window.location.origin;
    const verificationUrl = `${baseUrl}/verify/${studentData.student_code}`;

    return (
        <div className="w-full flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-500">
            {/* Card Container - Aspect Ratio 85.6 x 54 mm approx 1.58 */}
            <div
                ref={cardRef}
                data-card-ref="true"
                className="relative w-full max-w-[420px] aspect-[1.58] rounded-2xl overflow-hidden shadow-2xl transition-transform hover:scale-[1.02] duration-300 group"
                style={{
                    background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #60a5fa 100%)', // Blue primary gradient
                }}
            >
                {/* Background Pattern / Noise */}
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>

                {/* Glass Overlay */}
                <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]"></div>

                {/* Decorative Circles */}
                <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-blue-900/40 rounded-full blur-xl"></div>

                {/* Content Layer */}
                <div className="relative h-full flex flex-col justify-between px-6 pt-6 pb-9 text-white font-sans z-10">

                    {/* Header */}
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/30 shadow-inner overflow-hidden">
                                <img src="/assets/icon.png" alt="ZTS" className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-widest opacity-90 text-shadow">Zedeck Training</h3>
                                <div className="text-[10px] font-medium opacity-75">{t('card_system_id', 'Cartão de Estudante')}</div>
                            </div>
                        </div>
                        {/* Status Badge */}
                        <div className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 backdrop-blur-md text-[9px] uppercase font-bold text-emerald-100 flex items-center gap-1 shadow-sm">
                            <ShieldCheck size={10} />
                            <span>{t('card_provisional', 'Provisório')}</span>
                        </div>
                    </div>

                    {/* Student Details */}
                    <div className="mt-2 space-y-1.5">
                        <div className="text-[9px] uppercase tracking-wider opacity-70 font-semibold">{t('card_student_label', 'Aluno(a)')}</div>

                        {/* Name - Adjusted size */}
                        <h2 className="text-xl font-extrabold leading-snug tracking-tight drop-shadow-md line-clamp-2 min-h-[2.5rem] flex items-center">
                            {studentData.name}
                        </h2>

                        <div className="mt-3 flex gap-6">
                            <div>
                                <div className="text-[9px] uppercase tracking-wider opacity-70 font-semibold mb-0.5">{t('card_id_label', 'ID Único')}</div>
                                <div className="font-mono text-sm font-bold tracking-wider text-white drop-shadow-md bg-white/10 px-2 py-0.5 rounded">
                                    {studentData.student_code}
                                </div>
                            </div>
                            <div>
                                <div className="text-[9px] uppercase tracking-wider opacity-70 font-semibold mb-0.5">{t('card_validity_label', 'Validade')}</div>
                                <div className="text-xs font-bold text-white/90">
                                    {studentData.valid_until || '15 Dias'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer / Courses */}
                    <div className="mt-auto pt-3 border-t border-white/20 flex justify-between items-end gap-3">
                        <div className="flex-1 min-w-0">
                            <div className="text-[9px] uppercase tracking-wider opacity-70 font-semibold mb-0.5">{t('card_courses_label', 'Cursos')}</div>
                            <div className="flex flex-col gap-0.5">
                                {studentData.courses?.slice(0, 3).map((c, i) => (
                                    <span key={i} className="text-[10px] font-medium leading-tight truncate w-full block text-white/90">
                                        • {c.title}
                                    </span>
                                ))}
                                {studentData.courses?.length > 3 && (
                                    <span className="text-[9px] italic opacity-75">+ {studentData.courses.length - 3} outros...</span>
                                )}
                            </div>
                        </div>
                        {/* QR Code */}
                        <div className="bg-white p-1 rounded-lg shadow-lg shrink-0">
                            <QRCodeSVG
                                value={verificationUrl}
                                size={42}
                                level="M"
                                fgColor="#000000"
                                bgColor="#ffffff"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
                <Button
                    variant="outline"
                    onClick={handleDownload}
                    className="gap-2 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                    <Download size={16} />
                    {t('download_card_btn', 'Baixar Cartão (PNG)')}
                </Button>
            </div>

            <p className="text-xs text-gray-400 text-center max-w-sm">
                {t('card_footer_text', 'Apresente este código para acessar as instalações. ID:')} <strong className="text-primary">{studentData.student_code}</strong>.
            </p>
        </div>
    );
};

export default AcademicCard;
