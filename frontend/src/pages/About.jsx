import PublicLayout from '../components/layout/PublicLayout';
import { Award, Users, Target, Zap } from 'lucide-react';
import { AnimatedTestimonials } from '../components/ui/testimonial';

const testimonials = [
    {
        quote: "A Zedeck's Training transformou minha carreira. O foco na prática me permitiu conseguir um emprego logo após o curso.",
        name: "João Silva",
        designation: "Desenvolvedor Web na TechMoz",
        src: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1887&auto=format&fit=crop",
    },
    {
        quote: "A metodologia é incrível. Aprendi contabilidade de uma forma que nunca vi na faculdade. Recomendo a todos.",
        name: "Ana Macuácua",
        designation: "Contabilista Júnior",
        src: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1888&auto=format&fit=crop",
    },
    {
        quote: "O suporte dos instrutores e a infraestrutura são de primeira qualidade. Sinto-me preparado para o mercado.",
        name: "Carlos Muianga",
        designation: "Empreendedor",
        src: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1780&auto=format&fit=crop",
    },
    {
        quote: "Profissionalismo e dedicação definem a Zedeck's. O curso de Inglês abriu portas internacionais para mim.",
        name: "Sarah Jen",
        designation: "Secretária Executiva",
        src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1770&auto=format&fit=crop"
    }
];

export default function About() {
    return (
        <PublicLayout>
            {/* Hero */}
            <section className="bg-gray-50 dark:bg-gray-900 py-20 text-center">
                <div className="max-w-4xl mx-auto px-6">
                    <h1 className="text-4xl md:text-5xl font-bold font-heading mb-6">Sobre Nós</h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300">
                        Formando profissionais para o futuro de Moçambique.
                    </p>
                </div>
            </section>

            {/* Timeline & Story */}
            <section className="py-20 max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl font-bold font-heading mb-6">Nossa História</h2>
                        <div className="prose dark:prose-invert text-gray-600 dark:text-gray-300">
                            <p className="mb-4">
                                Fundada em Junho de 2025, a <strong>Zedeck’s Training</strong> nasceu como uma iniciativa estratégica da <strong>Zedeck’s IT</strong>. Identificamos uma lacuna crítica no mercado: muitos jovens saíam das universidades com teoria, mas sem prática.
                            </p>
                            <p>
                                Decidimos mudar isso. Criamos um centro onde a tecnologia encontra a prática, e onde o ensino é focado 100% no que as empresas realmente precisam.
                            </p>

                            <div className="mt-8 border-l-4 border-primary pl-6 py-2">
                                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">Junho 2025</h3>
                                <p className="text-sm">Início das operações e primeira turma de Tecnologias de Informação.</p>
                            </div>
                            <div className="mt-4 border-l-4 border-gray-300 dark:border-gray-700 pl-6 py-2">
                                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">Hoje</h3>
                                <p className="text-sm">Expandimos para cursos de Gestão, Línguas e Contabilidade, impactando centenas de vidas.</p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <img
                            src="https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=2070&auto=format&fit=crop"
                            alt="Equipa Zedecks"
                            className="rounded-2xl shadow-2xl"
                        />
                    </div>
                </div>
            </section>

            {/* Mission / Vision / Values */}
            <section className="py-20 bg-gray-50 dark:bg-gray-800/30">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 dark:border-gray-700">
                            <Target className="text-primary mb-4" size={40} />
                            <h3 className="text-xl font-bold mb-3">Missão</h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Capacitar pessoas através de formação prática e acessível, preparando profissionais competentes para desafios reais.
                            </p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 dark:border-gray-700">
                            <Zap className="text-amber-500 mb-4" size={40} />
                            <h3 className="text-xl font-bold mb-3">Visão</h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Ser um centro de referência em formação profissional e tecnológica em Moçambique, reconhecido pela excelência e impacto.
                            </p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 dark:border-gray-700">
                            <Award className="text-purple-500 mb-4" size={40} />
                            <h3 className="text-xl font-bold mb-3">Valores</h3>
                            <ul className="text-gray-600 dark:text-gray-400 list-disc pl-5 space-y-1">
                                <li>Prática Intensiva</li>
                                <li>Inovação</li>
                                <li>Ética Profissional</li>
                                <li>Excelência</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team */}
            <section className="py-20 max-w-7xl mx-auto px-6 text-center">
                <h2 className="text-3xl font-bold font-heading mb-12">Nossa Liderança</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* CEO */}
                    <div className="flex flex-col items-center group">
                        <div className="w-48 h-48 rounded-full overflow-hidden mb-4 border-4 border-gray-100 group-hover:border-primary transition-all">
                            <img src="https://ui-avatars.com/api/?name=Edmilson+Muacigarro&background=0D8ABC&color=fff&size=200" alt="Edmilson A. Muacigarro" className="w-full h-full object-cover" />
                        </div>
                        <h3 className="text-xl font-bold">Edmilson A. Muacigarro</h3>
                        <p className="text-primary font-medium">CEO</p>
                    </div>
                    {/* COO */}
                    <div className="flex flex-col items-center group">
                        <div className="w-48 h-48 rounded-full overflow-hidden mb-4 border-4 border-gray-100 group-hover:border-primary transition-all">
                            <img src="https://ui-avatars.com/api/?name=Leonoura+Oliveira&background=F59E0B&color=fff&size=200" alt="Leonoura de Oliveira" className="w-full h-full object-cover" />
                        </div>
                        <h3 className="text-xl font-bold">Leonoura de Oliveira</h3>
                        <p className="text-primary font-medium">COO</p>
                    </div>
                    {/* Founder */}
                    <div className="flex flex-col items-center group">
                        <div className="w-48 h-48 rounded-full overflow-hidden mb-4 border-4 border-gray-100 group-hover:border-primary transition-all">
                            <img src="https://ui-avatars.com/api/?name=Nietzche+Nicolau&background=9333EA&color=fff&size=200" alt="Nietzche Nicolau" className="w-full h-full object-cover" />
                        </div>
                        <h3 className="text-xl font-bold">Nietzche Nicolau</h3>
                        <p className="text-primary font-medium">Founder</p>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-10 bg-slate-950 text-white">
                <div className="text-center pt-10">
                    <h2 className="text-3xl font-bold font-heading">O que dizem nossos alunos</h2>
                </div>
                <AnimatedTestimonials testimonials={testimonials} />
            </section>
        </PublicLayout>
    );
}
