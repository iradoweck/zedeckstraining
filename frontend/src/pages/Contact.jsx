import PublicLayout from '../components/layout/PublicLayout';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';
import CallToAction from '../components/ui/call-to-action';

export default function Contact() {
    return (
        <PublicLayout>
            <div className="bg-gray-50 dark:bg-gray-900 min-h-screen pb-20">
                {/* CTA / Contacts Top Section */}
                <div className="pt-20 px-6 mb-16">
                    <CallToAction />
                </div>

                <div className="max-w-4xl mx-auto px-6">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold font-heading">Envie uma Mensagem</h2>
                        <p className="text-gray-500">Ou visite nossa sede em Nampula.</p>
                    </div>

                    <Card className="p-8 shadow-xl">
                        <form className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Nome</label>
                                    <input type="text" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="Seu nome" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Email</label>
                                    <input type="email" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="seu@email.com" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Assunto</label>
                                <input type="text" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="Dúvida sobre matrícula..." />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Mensagem</label>
                                <textarea className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="Como podemos ajudar?"></textarea>
                            </div>
                            <Button className="w-full h-12 text-lg">Enviar Mensagem</Button>
                        </form>
                    </Card>
                </div>
            </div>
        </PublicLayout>
    );
}
