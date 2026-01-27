import PublicLayout from '../components/layout/PublicLayout';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';
import { Phone, Mail, MapPin } from 'lucide-react';

export default function Contact() {
    return (
        <PublicLayout>
            <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <h1 className="text-4xl font-bold font-heading mb-4 text-gray-900 dark:text-white">Entre em Contacto</h1>
                        <p className="text-xl text-gray-500 max-w-2xl mx-auto">Estamos prontos para esclarecer suas dúvidas e ajudar você a iniciar sua jornada.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                        {/* Left Column: Contact Info */}
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-2xl font-bold font-heading mb-6 text-gray-900 dark:text-white">Nossos Canais</h3>
                                <p className="text-gray-600 dark:text-gray-300 mb-8">
                                    Prefere falar diretamente conosco? Utilize um dos canais abaixo ou visite nossa sede.
                                </p>
                            </div>

                            <div className="space-y-6">
                                <ContactItem
                                    icon={<Phone className="w-6 h-6 text-primary" />}
                                    title="Telefone & WhatsApp"
                                    content="+258 86 613 3052"
                                    link="tel:+258866133052"
                                />
                                <ContactItem
                                    icon={<Mail className="w-6 h-6 text-primary" />}
                                    title="Email Geral"
                                    content="training@zedecks.com"
                                    link="mailto:training@zedecks.com"
                                />
                                <ContactItem
                                    icon={<MapPin className="w-6 h-6 text-primary" />}
                                    title="Localização"
                                    content="Cidade de Nampula, Moçambique"
                                    link="#"
                                />
                            </div>

                            {/* Map */}
                            <div className="w-full h-64 bg-gray-200 dark:bg-gray-800 rounded-xl overflow-hidden shadow-inner">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d61626.6711062385!2d39.223538904285434!3d-15.121673819524238!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3069082effa0245%3A0xc317bfa1222cbafd!2sZEDECKS%20TRAINING!5e0!3m2!1spt-PT!2smz!4v1769499012736!5m2!1spt-PT!2smz"
                                    className="w-full h-full border-0"
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                ></iframe>
                            </div>
                        </div>

                        {/* Right Column: Form */}
                        <Card className="p-8 shadow-xl bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700">
                            <h3 className="text-2xl font-bold font-heading mb-6">Envie uma Mensagem</h3>
                            <form className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Nome</label>
                                        <Input placeholder="Seu nome" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Email</label>
                                        <Input type="email" placeholder="seu@email.com" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Assunto</label>
                                    <Input placeholder="Dúvida sobre matrícula..." />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Mensagem</label>
                                    <textarea className="flex min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="Como podemos ajudar?"></textarea>
                                </div>
                                <Button className="w-full h-12 text-lg font-bold">Enviar Mensagem</Button>
                            </form>
                        </Card>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}

function ContactItem({ icon, title, content, link }) {
    return (
        <a href={link} className="flex items-start gap-4 p-4 rounded-xl transition-all duration-300 group">
            <div className="p-3 bg-primary/10 rounded-full text-primary transition-colors">
                {icon}
            </div>
            <div>
                <h4 className="font-bold text-gray-900 dark:text-white">{title}</h4>
                <p className="text-gray-500 transition-colors">{content}</p>
            </div>
        </a>
    )
}
