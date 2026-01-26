import PublicLayout from '../components/layout/PublicLayout';

export default function Privacy() {
    return (
        <PublicLayout>
            <div className="max-w-4xl mx-auto px-6 py-20">
                <h1 className="text-4xl font-bold font-heading mb-8">Política de Privacidade</h1>
                <div className="prose dark:prose-invert max-w-none space-y-6 text-gray-600 dark:text-gray-300">
                    <p>A Zedeck’s Training compromete-se a proteger a privacidade e os dados pessoais dos seus utilizadores, alunos e visitantes.</p>

                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-8">1. Dados Recolhidos</h3>
                    <p>Podem ser recolhidos: Nome, Telefone, E-mail, Dados académicos e Informações de formulários.</p>

                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-8">2. Finalidade</h3>
                    <p>Gestão de inscrições, comunicação institucional e emissão de certificados. Não vendemos dados pessoais.</p>

                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-8">3. Segurança</h3>
                    <p>Adotamos medidas para proteger contra acesso não autorizado, perda ou alteração indevida.</p>

                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-8">4. Direitos do Utilizador</h3>
                    <p>O utilizador pode solicitar acesso, correção ou eliminação dos seus dados a qualquer momento.</p>

                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-8">5. Cookies</h3>
                    <p>Os sites oficiais podem utilizar cookies para melhorar a experiência e desempenho.</p>

                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-8">Contactos</h3>
                    <p>Para dúvidas de privacidade: 86 613 3052 ou através dos nossos sites oficiais.</p>
                </div>
            </div>
        </PublicLayout>
    );
}
