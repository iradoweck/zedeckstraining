import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import { Download, Share2, CheckCircle2, ShieldCheck, Award } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { QRCodeSVG } from 'qrcode.react';

const AcademicCard = ({ studentData, onDownload }) => {
    const { t } = useTranslation();
    const cardRef = useRef(null);

    const handleDownload = async () => {
        if (!cardRef.current) return;
        try {
            const canvas = await html2canvas(cardRef.current, {
                scale: 3,
                backgroundColor: null,
                logging: false,
                useCORS: true
            });
            const link = document.createElement('a');
            link.download = `ZTS-ID-${studentData.student_code}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
            toast.success(t('download_card_success'));
            if (onDownload) onDownload();
        } catch (err) {
            console.error(err);
            toast.error(t('download_card_error'));
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
                <div className="relative h-full flex flex-col justify-between p-6 text-white font-sans z-10">

                    {/* Header */}
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-md border border-white/30 shadow-inner overflow-hidden">
                                <img src="/assets/icon.png" alt="ZTS Logo" className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-widest opacity-80">Zedeck Training</h3>
                                <div className="text-[10px] font-medium opacity-60">{t('card_system_id')}</div>
                            </div>
                        </div>
                        {/* Status Badge */}
                        <div className="px-2 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 backdrop-blur-md text-[10px] font-semibold text-emerald-100 flex items-center gap-1">
                            <ShieldCheck size={10} />
                            <span>{t('card_provisional')}</span>
                        </div>
                    </div>

                    {/* Student Details */}
                    <div className="mt-2 space-y-1">
                        <div className="text-xs uppercase tracking-wider opacity-60 mb-0.5">{t('card_student_label')}</div>
                        <h2 className="text-xl font-bold leading-tight drop-shadow-sm">
                            {studentData.name}
                        </h2>

                        <div className="mt-3 flex gap-4">
                            <div>
                                <div className="text-[9px] uppercase tracking-wider opacity-60">{t('card_id_label')}</div>
                                <div className="font-mono text-sm font-bold tracking-wider text-white/90 drop-shadow-md">
                                    {studentData.student_code}
                                </div>
                            </div>
                            <div>
                                <div className="text-[9px] uppercase tracking-wider opacity-60">{t('card_validity_label')}</div>
                                <div className="text-sm font-medium">
                                    {studentData.valid_until || '15 Dias'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer / Courses */}
                    <div className="mt-auto pt-4 border-t border-white/10 flex justify-between items-end">
                        <div className="flex-1 pr-2">
                            <div className="text-[9px] uppercase tracking-wider opacity-60 mb-1">{t('card_courses_label')}</div>
                            <div className="flex flex-col gap-1">
                                {studentData.courses?.map((c, i) => (
                                    <span key={i} className="text-[10px] font-medium leading-tight truncate w-full block">
                                        • {c.title}
                                    </span>
                                ))}
                            </div>
                        </div>
                        {/* QR Code */}
                        <div className="bg-white p-1 rounded-lg shadow-sm">
                            <QRCodeSVG
                                value={verificationUrl}
                                size={40}
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
                    {t('download_card_btn')}
                </Button>
            </div>

            <p className="text-xs text-gray-400 text-center max-w-sm">
                {t('card_footer_text')} <strong className="text-primary">{studentData.student_code}</strong>.
            </p>
        </div>
    );
};

export default AcademicCard;
