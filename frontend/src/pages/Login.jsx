import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';
import { useTranslation } from 'react-i18next';
import LanguageToggle from '../components/LanguageToggle';
import ThemeToggle from '../components/ThemeToggle';

export default function Login() {
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(t('invalid_credentials', 'Invalid credentials'));
        }
    };

    return (
        <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 p-4 relative">
            <div className="absolute top-4 right-4 flex gap-2">
                <LanguageToggle />
                <ThemeToggle />
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-100 dark:border-gray-700 relative">
                <Link to="/" className="absolute top-4 left-4 text-gray-400 hover:text-primary transition-colors" title={t('back_home')}>
                    <ArrowLeft size={20} />
                </Link>

                <div className="text-center mb-8 mt-4">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t('login_title')}</h1>
                    <p className="text-sm text-gray-500">{t('login_subtitle', 'Enter your credentials to access the platform')}</p>
                </div>

                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm mb-4 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        type="email"
                        placeholder="admin@zedecks.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        label={t('email_label')}
                        className="bg-gray-50 dark:bg-gray-900"
                        required
                    />
                    <div className="space-y-1">
                        <Input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            label={t('password_label')}
                            className="bg-gray-50 dark:bg-gray-900"
                            required
                        />
                        <div className="text-right">
                            <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                                {t('forgot_password', 'Forgot your password?')}
                            </Link>
                        </div>
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? t('loading') : t('login_button')}
                    </Button>
                </form>

                <div className="mt-6 text-center pt-4 border-t border-gray-100 dark:border-gray-700">
                    <p className="text-sm text-gray-500">
                        {t('no_account', "Don't have an account?")}{' '}
                        <Link to="/register" className="text-primary font-bold hover:underline">
                            {t('register_link', 'Register here')}
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
