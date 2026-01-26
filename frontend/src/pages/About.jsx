import PublicLayout from '../components/layout/PublicLayout';

export default function About() {
    return (
        <PublicLayout>
            <div className="max-w-4xl mx-auto px-6 py-20">
                <h1 className="text-4xl font-bold font-heading mb-8">Sobre a Zedeck's Training</h1>
                <div className="prose dark:prose-invert max-w-none space-y-6 text-lg text-gray-600 dark:text-gray-300">
                    <p>
                        A <strong>Zedeck’s Training</strong> é um centro de formação profissional criado para capacitar pessoas com conhecimentos práticos, atuais e alinhados às reais exigências do mercado de trabalho.
                        Mais do que ensinar teoria, preparamos os formandos para executar, criar, trabalhar e empreender, com foco em resultados concretos.
                    </p>
                    <p>
                        Fundada em 2025 como uma iniciativa estratégica ligada à <strong>Zedeck’s IT</strong>, nascemos da necessidade de formar talentos capazes de acompanhar a evolução tecnológica, empresarial e profissional.
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white pt-6">Nossa Missão</h2>
                    <p>
                        Capacitar pessoas através de uma formação prática, acessível e orientada a resultados, preparando profissionais competentes para o mercado de trabalho, para projetos reais e para o empreendedorismo.
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white pt-6">Nossa Visão</h2>
                    <p>
                        Tornar-se um centro de referência em formação profissional e tecnológica, reconhecido pela qualidade do ensino, pela aplicação prática do conhecimento e pela capacidade de gerar impacto real na vida dos formandos.
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white pt-6">Nossos Valores</h2>
                    <ul className="list-disc pl-5">
                        <li>Prática acima da teoria</li>
                        <li>Compromisso com resultados</li>
                        <li>Ética e profissionalismo</li>
                        <li>Inovação contínua</li>
                        <li>Responsabilidade social</li>
                    </ul>

                    <div className="bg-primary/5 p-6 rounded-lg mt-8 border border-primary/20">
                        <h3 className="font-bold text-gray-900 dark:text-white mb-2">Conecte-se Conosco</h3>
                        <p className="text-sm">
                            Telefone/WhatsApp: <strong>86 613 3052</strong><br />
                            Redes Sociais: <strong>@zedeckstraining</strong>
                        </p>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
