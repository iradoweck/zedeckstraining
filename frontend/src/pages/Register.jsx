import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import LanguageToggle from '../components/LanguageToggle';
import ThemeToggle from '../components/ThemeToggle';
import { useTranslation } from 'react-i18next';
import api from '../services/api';

export default function Register() {
    const { t } = useTranslation();
    const { user } = useAuth(); // To check if logged in
    const navigate = useNavigate();

    // Redirect if already logged in
    useEffect(() => {
        if (user) {
            navigate('/dashboard');
        }
    }, [user, navigate]);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        if (formData.password !== formData.password_confirmation) {
            setError(t('passwords_mismatch', 'Passwords do not match'));
            setIsLoading(false);
            return;
        }

        try {
            await api.post('/auth/register', {
                ...formData,
                role: 'student' // Force student role
            });
            // Auto login or redirect to login? Let's redirect to login for now with strict message
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || t('registration_failed', 'Registration failed'));
        } finally {
            setIsLoading(false);
        }
    };

    const currentYear = new Date().getFullYear();
    const version = "v1.2.1"; // Hardcoded or from package.json env

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 relative">
            {/* Header Controls */}
            <div className="absolute top-4 right-4 flex gap-2 z-10">
                <LanguageToggle />
                <ThemeToggle />
            </div>

            <div className="flex-grow flex items-center justify-center p-4">
                <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-100 dark:border-gray-700 relative">
                    <Link to="/" className="absolute top-4 left-4 text-gray-400 hover:text-primary transition-colors" title={t('back_home')}>
                        <ArrowLeft size={20} />
                    </Link>

                    <div className="text-center mb-8 mt-4">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center justify-center gap-2">
                            <UserPlus size={28} className="text-primary" />
                            {t('register_title', 'Create Account')}
                        </h1>
                        <p className="text-sm text-gray-500">{t('register_subtitle', 'Join Zedeck Training System')}</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm mb-4 text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            name="name"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={handleChange}
                            label={t('name_label', 'Full Name')}
                            className="bg-gray-50 dark:bg-gray-900"
                            required
                        />
                        <Input
                            name="email"
                            type="email"
                            placeholder="student@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            label={t('email_label')}
                            className="bg-gray-50 dark:bg-gray-900"
                            required
                        />
                        <Input
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            label={t('password_label')}
                            className="bg-gray-50 dark:bg-gray-900"
                            required
                        />
                        <Input
                            name="password_confirmation"
                            type="password"
                            placeholder="••••••••"
                            value={formData.password_confirmation}
                            onChange={handleChange}
                            label={t('confirm_password_label', 'Confirm Password')}
                            className="bg-gray-50 dark:bg-gray-900"
                            required
                        />

                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? t('loading') : t('register_button', 'Sign Up')}
                        </Button>
                    </form>

                    <div className="mt-6 text-center pt-4 border-t border-gray-100 dark:border-gray-700">
                        <p className="text-sm text-gray-500">
                            {t('have_account', "Already have an account?")}{' '}
                            <Link to="/login" className="text-primary font-bold hover:underline">
                                {t('login_link', 'Log in')}
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="w-full py-4 text-center text-xs text-gray-400 dark:text-gray-600 relative">
                <p>
                    &copy; 2025-{currentYear} Zedeck's Training | {t('rights_reserved', 'Todos os direitos reservados')} | Powered by <a href="https://zedecks.com" target="_blank" rel="noopener noreferrer" className="font-bold text-primary hover:underline">ZEDECK'S IT</a>
                </p>

                {/* Version in Corner */}
                <div className="absolute bottom-4 right-4 text-[10px] opacity-70">
                    {version}
                </div>
            </footer>
        </div>
    );
}
