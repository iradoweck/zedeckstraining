import { Link } from 'react-router-dom';
import PublicLayout from '../components/layout/PublicLayout';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { BookOpen, Award, Users, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function Landing() {
    return (
        <PublicLayout>
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-white dark:bg-gray-900 pt-16 pb-32">
                <div className="absolute top-0 inset-x-0 h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-50"></div>

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="text-center max-w-3xl mx-auto space-y-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>
                            New Courses Available
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold font-heading tracking-tight text-gray-900 dark:text-white leading-tight">
                            Master new skills with <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">Zedeck's Training</span>
                        </h1>

                        <p className="text-xl text-gray-500 dark:text-gray-400 leading-relaxed">
                            Join thousands of students learning from industry experts. Practical courses, real-world projects, and recognized certifications.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link to="/courses">
                                <Button className="h-12 px-8 text-base">Explore Courses</Button>
                            </Link>
                            <Link to="/about">
                                <Button variant="outline" className="h-12 px-8 text-base">Learn More</Button>
                            </Link>
                        </div>

                        <div className="pt-8 flex items-center justify-center gap-8 text-sm text-gray-400">
                            <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-primary" /> Certified Instructors</div>
                            <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-primary" /> Lifetime Access</div>
                            <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-primary" /> Career Support</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features/Stats Section */}
            <section className="py-24 bg-gray-50 dark:bg-gray-800/50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <Card className="p-8 border-none shadow-lg shadow-gray-200/50 dark:shadow-none hover:-translate-y-1 transition-transform duration-300">
                            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-6">
                                <BookOpen size={24} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Expert-Led Courses</h3>
                            <p className="text-gray-500">Learn from professionals who have actual industry experience and proven track records.</p>
                        </Card>
                        <Card className="p-8 border-none shadow-lg shadow-gray-200/50 dark:shadow-none hover:-translate-y-1 transition-transform duration-300">
                            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-6">
                                <Award size={24} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Recognized Certificates</h3>
                            <p className="text-gray-500">Earn certificates upon completion to showcase your skills to employers and LinkedIn network.</p>
                        </Card>
                        <Card className="p-8 border-none shadow-lg shadow-gray-200/50 dark:shadow-none hover:-translate-y-1 transition-transform duration-300">
                            <div className="w-12 h-12 rounded-xl bg-green-100 text-green-600 flex items-center justify-center mb-6">
                                <Users size={24} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Community Learning</h3>
                            <p className="text-gray-500">Join a vibrant community of learners. Share knowledge, collaborate on projects, and grow together.</p>
                        </Card>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-white dark:bg-gray-900">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="bg-gradient-to-r from-primary to-purple-700 rounded-3xl p-12 md:p-16 text-center text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-16 opacity-10 transform translate-x-1/2 -translate-y-1/2">
                            <div className="w-64 h-64 rounded-full border-[20px] border-white"></div>
                        </div>
                        <div className="absolute bottom-0 left-0 p-16 opacity-10 transform -translate-x-1/2 translate-y-1/2">
                            <div className="w-48 h-48 rounded-full bg-white"></div>
                        </div>

                        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                            <h2 className="text-3xl md:text-5xl font-bold font-heading">Ready to start your journey?</h2>
                            <p className="text-white/80 text-lg">
                                Get unlimited access to all courses and join our community today.
                            </p>
                            <Link to="/register" className="inline-block">
                                <button className="bg-white text-primary px-8 py-3 rounded-xl font-bold text-lg hover:shadow-xl hover:scale-105 transition-all">
                                    Get Started Now
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
