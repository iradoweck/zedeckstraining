import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/button';
import { LogOut, User as UserIcon, Menu, X, BookOpen } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import LanguageToggle from '../LanguageToggle';
import ThemeToggle from '../ThemeToggle';

export default function PublicLayout({ children }) {
    const { t } = useTranslation();
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
            {/* Navbar */}
            <nav className="border-b border-gray-100 dark:border-gray-800 sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <div className="flex items-center gap-2">
                            <img src="/assets/logo.png" alt="Zedeck's Training" className="h-10 w-auto object-contain" />
                            <Link to="/" className="text-xl font-bold font-heading tracking-tight hidden sm:block">
                                Zedeck<span className="text-primary">'s</span> Training
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-8">
                            <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">{t('nav_home', 'Home')}</Link>
                            <Link to="/courses" className="text-sm font-medium hover:text-primary transition-colors">{t('nav_courses', 'Courses')}</Link>
                            <Link to="/about" className="text-sm font-medium hover:text-primary transition-colors">{t('nav_about', 'About')}</Link>
                            <Link to="/contact" className="text-sm font-medium hover:text-primary transition-colors">{t('nav_contact', 'Contact')}</Link>
                        </div>

                        {/* Auth / Menu */}
                        <div className="hidden md:flex items-center gap-4">
                            {user ? (
                                <div className="flex items-center gap-4">
                                    <Link to="/dashboard" className="text-sm font-medium hover:text-primary">
                                        {t('nav_dashboard', 'Dashboard')}
                                    </Link>
                                    <div className="w-px h-6 bg-gray-200 dark:bg-gray-700"></div>
                                    <button onClick={handleLogout} className="text-gray-500 hover:text-red-600 transition-colors" title={t('logout')}>
                                        <LogOut size={20} />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <LanguageToggle />
                                    <ThemeToggle />
                                    <Link to="/login" className="text-sm font-medium hover:text-primary">{t('nav_login', 'Login')}</Link>
                                    <Link to="/register">
                                        <Button className="w-auto px-5 py-2 text-sm">{t('nav_get_started', 'Get Started')}</Button>
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden">
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                            >
                                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 space-y-4 animate-in slide-in-from-top-2">
                        <Link to="/" className="block text-base font-medium hover:text-primary">{t('nav_home', 'Home')}</Link>
                        <Link to="/courses" className="block text-base font-medium hover:text-primary">{t('nav_courses', 'Courses')}</Link>
                        <Link to="/about" className="block text-base font-medium hover:text-primary">{t('nav_about', 'About')}</Link>
                        <Link to="/contact" className="block text-base font-medium hover:text-primary">{t('nav_contact', 'Contact')}</Link>
                        <hr className="border-gray-100 dark:border-gray-800" />
                        {user ? (
                            <>
                                <Link to="/dashboard" className="block text-base font-medium hover:text-primary">{t('nav_dashboard', 'Dashboard')}</Link>
                                <button onClick={handleLogout} className="text-left w-full text-base font-medium text-red-600">{t('logout')}</button>
                            </>
                        ) : (
                            <div className="flex flex-col gap-3">
                                <Link to="/login" className="block text-center w-full py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">{t('nav_login', 'Login')}</Link>
                                <Link to="/register" className="block">
                                    <Button className="w-full">{t('nav_get_started', 'Get Started')}</Button>
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </nav>

            {/* Main Content */}
            <main className="flex-1">
                {children}
            </main>

            {/* Footer */}
            <footer className="border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 pt-12 pb-6">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center text-white text-xs">
                                <BookOpen size={14} />
                            </div>
                            <span className="text-lg font-bold">Zedeck's Training</span>
                        </div>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            Empowering the next generation of professionals with world-class education and practical training.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4">Platform</h4>
                        <ul className="space-y-2 text-sm text-gray-500">
                            <li><Link to="/courses" className="hover:text-primary">All Courses</Link></li>
                            <li><Link to="/pricing" className="hover:text-primary">Pricing</Link></li>
                            <li><Link to="/instructors" className="hover:text-primary">For Instructors</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4">Support</h4>
                        <ul className="space-y-2 text-sm text-gray-500">
                            <li><Link to="/help" className="hover:text-primary">Help Center</Link></li>
                            <li><Link to="/contact" className="hover:text-primary">Contact Us</Link></li>
                            <li><Link to="/terms" className="hover:text-primary">Terms of Service</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4">Newsletter</h4>
                        <p className="text-sm text-gray-500 mb-4">Subscribe for updates.</p>
                        <div className="flex gap-2">
                            <input type="email" placeholder="Email" className="bg-white px-3 py-2 rounded-lg border text-sm w-full outline-none focus:ring-1 focus:ring-primary" />
                            <Button className="w-auto px-4 py-2 text-xs">Join</Button>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-400">
                    <p>
                        &copy; 2025-{new Date().getFullYear()} Zedeck's Training | Todos os direitos reservados | Powered by <a href="https://zedecks.com" target="_blank" rel="noopener noreferrer" className="font-bold text-primary hover:underline">ZEDECK'S IT</a>
                    </p>
                </div>
            </footer>
        </div>
    );
}
