import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useTranslation } from 'react-i18next';
import LanguageToggle from '../components/LanguageToggle';
import ThemeToggle from '../components/ThemeToggle';
import { usePageTitle } from '../hooks/usePageTitle';
import ReCAPTCHA from "react-google-recaptcha";
import api from '../services/api';

export default function ForgotPassword() {
    usePageTitle();
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const recaptchaRef = useRef();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setIsLoading(true);

        try {
            // Execute reCAPTCHA
            const token = await recaptchaRef.current.executeAsync();

            if (!token) {
                setError(t('recaptcha_error', 'Verification failed. Please try again.'));
                setIsLoading(false);
                return;
            }

            // Send request
            await api.post('/auth/forgot-password', {
                email,
                recaptcha_token: token
            });

            // Always show success message for security (don't reveal user existence)
            setMessage(t('forgot_password_sent', 'If an account exists for this email, you will receive password reset instructions.'));
            setEmail(''); // Clear input

        } catch (err) {
            // Even on error, we might want to show the generic message or specific technical error if strictly needed
            // But for "Fluxo limpo", generic is better unless it's a network error
            console.error(err);
            // Fallback for network errors
            if (!err.response) {
                setError(t('network_error', 'Connection error. Please try again.'));
            } else {
                setMessage(t('forgot_password_sent', 'If an account exists for this email, you will receive password reset instructions.'));
            }
        } finally {
            setIsLoading(false);
            recaptchaRef.current.reset();
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-950 p-4 relative">
            <div className="absolute top-6 left-6 z-20">
                <Link to="/login" className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary transition-colors font-medium group">
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span>{t('back_login', 'Back to Login')}</span>
                </Link>
            </div>

            <div className="absolute top-4 right-4 flex gap-2 z-50">
                <LanguageToggle />
                <ThemeToggle />
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-100 dark:border-gray-700 relative">
                <div className="text-center mb-8 mt-4">
                    <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600 dark:text-blue-400">
                        <Mail size={24} />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t('forgot_password_title', 'Reset Password')}</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('forgot_password_subtitle', 'Enter your email to receive reset instructions')}</p>
                </div>

                {message && (
                    <div className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 p-4 rounded-lg text-sm mb-6 text-center border border-green-100 dark:border-green-800">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm mb-4 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <ReCAPTCHA
                        ref={recaptchaRef}
                        size="invisible"
                        sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY || "YOUR_SITE_KEY_HERE"} // Placeholder
                    />

                    <Input
                        type="email"
                        placeholder="seu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        label={t('email_label')}
                        className="bg-gray-50 dark:bg-gray-900"
                        required
                    />

                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? t('sending', 'Sending...') : t('send_reset_link', 'Send Reset Link')}
                    </Button>
                </form>

                <div className="mt-8 text-center border-t border-gray-100 dark:border-gray-700 pt-4">
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                        Protected by reCAPTCHA and ZTS Security
                    </p>
                </div>
            </div>

            {/* Simple Footer */}
            <footer className="absolute bottom-4 w-full text-center text-[10px] text-gray-400 dark:text-gray-600 opacity-60">
                <p>
                    &copy; 2025-{new Date().getFullYear()} Zedeck's Training | v1.2.2
                </p>
            </footer>
        </div>
    );
}
