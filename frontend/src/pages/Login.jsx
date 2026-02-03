import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageToggle from '../components/LanguageToggle';
import ThemeToggle from '../components/ThemeToggle';
import { usePageTitle } from '../hooks/usePageTitle';
import LoginMap from '../components/ui/LoginMap';

export default function Login() {
    usePageTitle();
    const { t } = useTranslation();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (email, password) => {
        setError('');
        setIsLoading(true);
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(t('invalid_credentials', 'Invalid credentials'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-950 p-4 relative">
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
                    &copy; 2025-{new Date().getFullYear()} Zedeck's Training | v1.2.2
                </p>
            </footer>
        </div>
    );
}
