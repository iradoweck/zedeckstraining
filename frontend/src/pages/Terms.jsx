import PublicLayout from '../components/layout/PublicLayout';

export default function Terms() {
    return (
        <PublicLayout>
            <div className="max-w-4xl mx-auto px-6 py-20">
                <h1 className="text-4xl font-bold font-heading mb-8">Termos e Condições de Uso</h1>
                <div className="prose dark:prose-invert max-w-none space-y-6 text-gray-600 dark:text-gray-300">
                    <p>Ao aceder, navegar ou utilizar os serviços, plataformas digitais, formulários, conteúdos ou cursos da Zedeck’s Training, o utilizador declara que leu, compreendeu e concorda integralmente com os presentes Termos e Condições.</p>
                    <p>A Zedeck’s Training reserva-se o direito de alterar, atualizar ou substituir estes Termos a qualquer momento, sem necessidade de aviso prévio.</p>

                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-8">1. Natureza dos Serviços</h3>
                    <p>A Zedeck’s Training é um centro de formação profissional que oferece cursos presenciais, híbridos ou online, com foco em capacitação técnica, prática e profissional. Os cursos têm caráter formativo e não constituem promessa de emprego.</p>

                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-8">2. Inscrição e Admissão</h3>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>A inscrição requer preenchimento correto do formulário e confirmação da vaga.</li>
                        <li>A Zedeck’s Training pode recusar inscrições com dados falsos ou cancelar turmas por motivos operacionais.</li>
                    </ul>

                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-8">3. Pagamentos e Propinas</h3>
                    <p>O não pagamento dentro dos prazos pode resultar em suspensão, impedimento de acesso ou cancelamento da inscrição. Pagamentos efetuados não são reembolsáveis, salvo exceções justificadas.</p>

                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-8">4. Assiduidade e Avaliação</h3>
                    <p>A atribuição de certificado está condicionada à frequência mínima, cumprimento das atividades e avaliação positiva.</p>

                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-8">5. Conduta</h3>
                    <p>É proibido comportamento ofensivo, plágio ou fraude. O incumprimento pode resultar em expulsão sem reembolso.</p>

                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-8">6. Propriedade Intelectual</h3>
                    <p>Todo material (apostilas, slides, vídeos) é propriedade exclusiva da Zedeck’s Training. Cópia ou distribuição não autorizada é proibida.</p>

                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-8">7. Projetos e Estágios</h3>
                    <p>A participação em projetos reais ou estágios não é automática e depende do mérito e disponibilidade.</p>

                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-8">10. Foro</h3>
                    <p>Estes Termos são regidos pela legislação vigente na República de Moçambique.</p>
                </div>
            </div>
        </PublicLayout>
    );
}
