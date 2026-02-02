import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
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

            <Card className="w-full max-w-md p-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-2">
                        <span className="bg-primary text-white p-2 rounded-lg"><LogIn size={24} /></span>
                        Portal ZT
                    </h1>
                    <p className="text-gray-500 mt-2">{t('login_title')}</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm font-medium border border-red-100">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                        label={t('email_label')}
                        type="email"
                        placeholder="student@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <Input
                        label={t('password_label')}
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <Button type="submit">
                        {t('login_button')}
                    </Button>
                </form>
            </Card>
        </div>
    );
}
