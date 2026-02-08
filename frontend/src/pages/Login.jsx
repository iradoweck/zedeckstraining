import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import LanguageToggle from '../components/LanguageToggle';
import ThemeToggle from '../components/ThemeToggle';
import { usePageTitle } from '../hooks/usePageTitle';
import LoginMap from '../components/ui/LoginMap';
import { APP_VERSION } from '../components/constants';
import { toast } from 'react-hot-toast';

export default function Login() {
    usePageTitle();
    const { t } = useTranslation();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    // Check for Logout Message
    useEffect(() => {
        const shouldShowLogout = localStorage.getItem('show_logout_message');
        if (shouldShowLogout) {
            toast.success(t('logout_success', 'Saiu com Sucesso, Até breve!'), {
                icon: '👋',
                duration: 4000,
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                },
            });
            localStorage.removeItem('show_logout_message');
        }
    }, [t]);

    const handleLogin = async (email, password) => {
        setError('');
        setIsLoading(true);
        try {
            await login(email, password);
            localStorage.setItem('show_login_success', 'true');
            navigate('/dashboard');
        } catch (err) {
            console.error("Login error:", err);
            setError(t('invalid_credentials', 'Invalid credentials'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-950 p-4 relative">
            {/* Back Button */}
            <div className="absolute top-6 left-6 z-50">
                <Link to="/" className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary transition-colors font-medium group">
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span>{t('back_home', 'Back to Home')}</span>
                </Link>
            </div>

            <div className="absolute top-4 right-4 flex gap-2 z-50">
                <LanguageToggle />
                <ThemeToggle />
            </div>

            <LoginMap
                onLogin={handleLogin}
                isLoading={isLoading}
                error={error}
            />

            {/* Simple Footer */}
            <footer className="absolute bottom-4 w-full text-center text-[10px] text-gray-400 dark:text-gray-600 opacity-60">
                <p>
                    &copy; 2025-{new Date().getFullYear()} Zedeck's Training | {APP_VERSION}
                </p>
            </footer>
        </div>
    );
}
