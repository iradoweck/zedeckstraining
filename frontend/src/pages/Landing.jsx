import { Link } from 'react-router-dom';
import PublicLayout from '../components/layout/PublicLayout';
import { Button } from '../components/ui/button';
import { TypewriterEffect } from '../components/ui/typewriter-effect';
import CallToAction from '../components/ui/call-to-action';
import { BookOpen, Award, Users, Mic, Layers, Cpu, CheckCircle } from 'lucide-react';
import { useTranslation, Trans } from 'react-i18next'; // Added Trans

export default function Landing() {
    const { t } = useTranslation();

    return (
        <PublicLayout>
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-white dark:bg-gray-900 pt-20 pb-32">
                <div className="absolute top-0 left-0 w-full h-full bg-grid-gray-900/[0.04] dark:bg-grid-white/[0.05]"></div>
                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <div className="mb-8">
                        <TypewriterEffect
                            words={[
                                { text: t('hero_title_1'), className: "text-gray-900 dark:text-white" },
                                { text: t('hero_title_2'), className: "text-gray-900 dark:text-white" },
                                { text: t('hero_title_3'), className: "text-gray-900 dark:text-white" },
                                { text: t('hero_title_4'), className: "text-gray-900 dark:text-white" },
                                { text: t('hero_title_5'), className: "text-primary" },
                            ]}
                            className="text-4xl md:text-6xl font-extrabold font-heading mb-6"
                        />
                    </div>

                    <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed max-w-3xl mx-auto">
                        <Trans i18nKey="hero_subtitle" />
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                        <Link to="/register">
                            <Button size="lg" className="w-full sm:w-auto shadow-xl shadow-primary/20 bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg rounded-full font-bold transition-all hover:scale-105">
                                {t('hero_cta_primary')}
                            </Button>
                        </Link>
                        <Link to="/courses">
                            <Button size="lg" variant="outline" className="w-full sm:w-auto px-8 py-6 text-lg rounded-full border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white font-medium">
                                {t('hero_cta_secondary')}
                            </Button>
                        </Link>
                    </div>

                    {/* Image Removed as per request */}

                </div>
            </section>


            {/* About / Mission Section */}
            <section className="py-24 bg-gray-50 dark:bg-gray-800/50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-3xl font-bold font-heading mb-6">{t('about_title')}</h2>
                            <div className="space-y-4 text-gray-600 dark:text-gray-300">
                                <p><Trans i18nKey="about_p1" /></p>
                                <p><Trans i18nKey="about_p2" /></p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <Cpu className="text-primary mb-4" size={32} />
                                <h3 className="font-bold mb-2">{t('feat_tech_title')}</h3>
                                <p className="text-sm text-gray-500">{t('feat_tech_desc')}</p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <Layers className="text-primary mb-4" size={32} />
                                <h3 className="font-bold mb-2">{t('feat_biz_title')}</h3>
                                <p className="text-sm text-gray-500">{t('feat_biz_desc')}</p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <Mic className="text-primary mb-4" size={32} />
                                <h3 className="font-bold mb-2">{t('feat_com_title')}</h3>
                                <p className="text-sm text-gray-500">{t('feat_com_desc')}</p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <Users className="text-primary mb-4" size={32} />
                                <h3 className="font-bold mb-2">{t('feat_net_title')}</h3>
                                <p className="text-sm text-gray-500">{t('feat_net_desc')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="py-24 bg-white dark:bg-gray-900">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold font-heading mb-16">{t('why_title')}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6">
                                <BookOpen size={32} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">{t('why_1_title')}</h3>
                            <p className="text-gray-500">{t('why_1_desc')}</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6">
                                <Award size={32} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">{t('why_2_title')}</h3>
                            <p className="text-gray-500">{t('why_2_desc')}</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6">
                                <CheckCircle size={32} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">{t('why_3_title')}</h3>
                            <p className="text-gray-500">{t('why_3_desc')}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <CallToAction />
        </PublicLayout>
    );
}
