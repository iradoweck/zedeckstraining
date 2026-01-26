import PublicLayout from '../components/layout/PublicLayout';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Contact() {
    return (
        <PublicLayout>
            <div className="max-w-7xl mx-auto px-6 py-20">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold font-heading mb-4">Get in Touch</h1>
                    <p className="text-gray-500">Have questions? We'd love to hear from you.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Contact Info */}
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-xl font-bold mb-4">Contact Information</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                Reach out to us through any of these channels. Our support team is available Mon-Fri, 9am-6pm.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                    <Mail size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold">Email</h4>
                                    <p className="text-gray-600 dark:text-gray-400">support@zedeckstraining.com</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                    <Phone size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold">Phone</h4>
                                    <p className="text-gray-600 dark:text-gray-400">+258 84 123 4567</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                    <MapPin size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold">Office</h4>
                                    <p className="text-gray-600 dark:text-gray-400">Maputo, Mozambique</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <Card className="p-8">
                        <form className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <Input label="First Name" placeholder="John" />
                                <Input label="Last Name" placeholder="Doe" />
                            </div>
                            <Input label="Email" type="email" placeholder="john@example.com" />
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
                                <textarea
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary outline-none transition-all dark:bg-gray-700 dark:text-white h-32 resize-none"
                                    placeholder="How can we help you?"
                                ></textarea>
                            </div>
                            <Button className="w-full">Send Message</Button>
                        </form>
                    </Card>
                </div>
            </div>
        </PublicLayout>
    );
}
