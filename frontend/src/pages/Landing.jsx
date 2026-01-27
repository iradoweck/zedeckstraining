import { Link } from 'react-router-dom';
import PublicLayout from '../components/layout/PublicLayout';
import { Button } from '../components/ui/button';
import { TypewriterEffect } from '../components/ui/typewriter-effect';
import IntegrationHero from '../components/ui/integration-hero';
import { BookOpen, Award, Users, Mic, Layers, Cpu, CheckCircle } from 'lucide-react';

export default function Landing() {
    return (
        <PublicLayout>
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-white dark:bg-gray-900 pt-20 pb-32">
                <div className="absolute top-0 left-0 w-full h-full bg-grid-gray-900/[0.04] dark:bg-grid-white/[0.05]"></div>
                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <div className="mb-8">
                        <TypewriterEffect
                            words={[
                                { text: "Transforme", className: "text-gray-900 dark:text-white" },
                                { text: "Conhecimento", className: "text-gray-900 dark:text-white" },
                                { text: "em", className: "text-gray-900 dark:text-white" },
                                { text: "Resultados", className: "text-primary" },
                                { text: "Reais.", className: "text-primary" },
                            ]}
                            className="text-4xl md:text-6xl font-extrabold font-heading mb-6"
                        />
                    </div>

                    <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed max-w-3xl mx-auto">
                        A Zedeck’s Training é um centro de formação profissional focado em capacitar pessoas com conhecimentos práticos, atuais e alinhados às reais exigências do mercado.
                        Aprenda a executar, criar e empreender.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                        <Link to="/register">
                            <Button size="lg" className="w-full sm:w-auto shadow-xl shadow-primary/20 bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg rounded-full">
                                Inscreva-se Agora
                            </Button>
                        </Link>
                        <Link to="/courses">
                            <Button size="lg" variant="outline" className="w-full sm:w-auto px-8 py-6 text-lg rounded-full">
                                Ver Cursos
                            </Button>
                        </Link>
                    </div>

                    {/* Simple Image Slider Placeholder - Replaced static image with array of related images */}
                    <div className="relative w-full max-w-5xl mx-auto aspect-video rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800">
                        {/* We can use a simple flex scroll for now or just one hero image that represents 'Classrooms' */}
                        <img
                            src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop"
                            alt="Sala de Aula Zedecks"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                            <p className="text-white font-medium text-lg">Ambientes de aprendizado práticos e modernos.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Integrations / Partners */}
            <IntegrationHero />

            {/* About / Mission Section */}
            <section className="py-24 bg-gray-50 dark:bg-gray-800/50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-3xl font-bold font-heading mb-6">Quem Somos</h2>
                            <div className="space-y-4 text-gray-600 dark:text-gray-300">
                                <p>
                                    Fundada em 2025 como uma iniciativa estratégica ligada à <strong>Zedeck’s IT</strong>, a Zedeck’s Training nasce da necessidade de formar talentos capazes de acompanhar a evolução tecnológica.
                                </p>
                                <p>
                                    Nossa missão é <strong>capacitar pessoas através de uma formação prática</strong>, acessível e orientada a resultados. Acreditamos que a formação só faz sentido quando gera transformação real, oportunidades concretas e profissionais preparados.
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <Cpu className="text-primary mb-4" size={32} />
                                <h3 className="font-bold mb-2">Tecnologia</h3>
                                <p className="text-sm text-gray-500">Programação, Web Design, Informática Avançada.</p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <Layers className="text-primary mb-4" size={32} />
                                <h3 className="font-bold mb-2">Negócios</h3>
                                <p className="text-sm text-gray-500">Contabilidade, Gestão, Marketing, Secretariado.</p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <Mic className="text-primary mb-4" size={32} />
                                <h3 className="font-bold mb-2">Comunicação</h3>
                                <p className="text-sm text-gray-500">Inglês Profissional, Comunicação Organizacional.</p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <Users className="text-primary mb-4" size={32} />
                                <h3 className="font-bold mb-2">Networking</h3>
                                <p className="text-sm text-gray-500">Conexão direta com o ecossistema Zedeck's IT.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="py-24 bg-white dark:bg-gray-900">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold font-heading mb-16">Por que escolher a Zedeck's Training?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6">
                                <BookOpen size={32} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Prática acima da Teoria</h3>
                            <p className="text-gray-500">Cursos desenvolvidos com foco em execução e projetos reais.</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6">
                                <Award size={32} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Conexão com Mercado</h3>
                            <p className="text-gray-500">Oportunidades de estágio e integração em projetos da Zedeck's IT.</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6">
                                <CheckCircle size={32} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Formação Híbrida</h3>
                            <p className="text-gray-500">Flexibilidade com modalidades presencial, online e híbrida.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-gray-900 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-primary/10"></div>
                <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                    <h2 className="text-4xl font-bold font-heading mb-6">Pronto para transformar seu futuro?</h2>
                    <p className="text-xl text-gray-300 mb-8">
                        Junte-se a centenas de alunos que já estão construindo carreiras de sucesso.
                    </p>
                    <Link to="/register">
                        <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 border-none">
                            Inscreva-se Agora
                        </Button>
                    </Link>
                </div>
            </section>
        </PublicLayout>
    );
}
