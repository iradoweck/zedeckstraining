import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { usePageTitle } from '../hooks/usePageTitle';
import ReCAPTCHA from "react-google-recaptcha";
import api from '../services/api';
import DotMap from '../components/ui/DotMap';
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { APP_VERSION } from '../components/constants';
import LanguageToggle from '../components/LanguageToggle';
import ThemeToggle from '../components/ThemeToggle';

// Helper function to merge class names
function cn(...inputs) {
    return twMerge(clsx(inputs));
}

// Custom Input Component (Internal)
const Input = ({ className = "", ...props }) => {
    return (
        <input
            className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm text-gray-800 dark:text-gray-100 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
            {...props}
        />
    );
};

// Custom Button Component (Internal)
const Button = ({ children, className = "", ...props }) => {
    return (
        <button
            className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default function ForgotPassword() {
    usePageTitle();
    const { t } = useTranslation();
    const [identifier, setIdentifier] = useState(''); // Email or Student ID
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
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
                identifier,
                recaptcha_token: token
            });

            // Always show success message for security (don't reveal user existence)
            setMessage(t('forgot_password_sent', 'If an account exists for this credentials, you will receive password reset instructions.'));
            setIdentifier(''); // Clear input

        } catch (err) {
            console.error("Recovery error:", err);
            // Fallback for network errors, otherwise show success mask
            if (!err.response) {
                setError(t('network_error', 'Connection error. Please try again.'));
            } else {
                setMessage(t('forgot_password_sent', 'If an account exists for this credentials, you will receive password reset instructions.'));
            }
        } finally {
            setIsLoading(false);
            recaptchaRef.current.reset();
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-950 p-4 relative">
            {/* Back Button */}
            <div className="absolute top-6 left-6 z-50">
                <Link to="/login" className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary transition-colors font-medium group">
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span>{t('back_login', 'Back to Login')}</span>
                </Link>
            </div>

            <div className="absolute top-4 right-4 flex gap-2 z-50">
                <LanguageToggle />
                <ThemeToggle />
            </div>

            <div className="flex w-full h-full items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-4xl overflow-hidden rounded-2xl flex bg-white dark:bg-gray-800 shadow-xl border border-gray-100 dark:border-gray-700 mt-16 md:mt-0"
                >
                    {/* Left side - Map */}
                    <div className="hidden md:block w-1/2 h-[600px] relative overflow-hidden border-r border-gray-100 dark:border-gray-700">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
                            <DotMap />

                            {/* Logo and text overlay */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 z-10">
                                <motion.div
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6, duration: 0.5 }}
                                    className="mb-6"
                                >
                                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-200 dark:shadow-blue-900/40">
                                        <Mail className="text-white h-6 w-6" />
                                    </div>
                                </motion.div>
                                <motion.h2
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.7, duration: 0.5 }}
                                    className="text-3xl font-bold mb-2 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400"
                                >
                                    {t('forgot_password_title', 'Reset Password')}
                                </motion.h2>
                                <motion.p
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.8, duration: 0.5 }}
                                    className="text-sm font-medium text-center text-gray-600 dark:text-gray-300 max-w-xs"
                                >
                                    {t('security_first', 'Security First')}
                                </motion.p>
                            </div>
                        </div>
                    </div>

                    {/* Right side - Form */}
                    <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-center bg-white dark:bg-gray-800">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <h1 className="text-2xl md:text-3xl font-bold mb-2 text-gray-800 dark:text-white">{t('recover_account', 'Recover Account')}</h1>
                            <p className="text-gray-500 dark:text-gray-400 mb-8">{t('recover_subtitle', 'Enter your Email or Student ID to receive instructions')}</p>

                            {/* Success Message */}
                            {message && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 rounded-lg p-4 mb-6 flex items-start gap-3"
                                >
                                    <CheckCircle className="text-green-600 dark:text-green-400 h-5 w-5 mt-0.5 shrink-0" />
                                    <div>
                                        <h4 className="font-medium text-green-900 dark:text-green-300 text-sm">{t('email_sent', 'Check your email')}</h4>
                                        <p className="text-green-700 dark:text-green-400 text-sm mt-1">{message}</p>
                                    </div>
                                </motion.div>
                            )}

                            {/* Error Message */}
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm mb-4 text-center border border-red-100 dark:border-red-800 flex items-center justify-center gap-2"
                                >
                                    <AlertCircle size={16} />
                                    {error}
                                </motion.div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <ReCAPTCHA
                                    ref={recaptchaRef}
                                    size="invisible"
                                    sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY || "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"}
                                />

                                <div>
                                    <label htmlFor="identifier" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        {t('email_or_id', 'Email or Student ID')} <span className="text-blue-500">*</span>
                                    </label>
                                    <Input
                                        id="identifier"
                                        type="text"
                                        value={identifier}
                                        onChange={(e) => setIdentifier(e.target.value)}
                                        placeholder={t('email_or_id_placeholder', 'e.g. user@email.com or ZT-2026-1234')}
                                        required
                                        className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 placeholder:text-gray-400 text-gray-800 dark:text-gray-100 w-full focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>

                                <motion.div
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.98 }}
                                    onHoverStart={() => setIsHovered(true)}
                                    onHoverEnd={() => setIsHovered(false)}
                                    className="pt-2"
                                >
                                    <Button
                                        type="submit"
                                        disabled={isLoading}
                                        className={cn(
                                            "w-full py-2 transition-all duration-300 relative overflow-hidden",
                                            isHovered ? "shadow-lg shadow-blue-200 dark:shadow-blue-900/20" : ""
                                        )}
                                    >
                                        <span className="flex items-center justify-center">
                                            {isLoading ? t('sending', 'Sending...') : t('send_link', 'Send Recovery Link')}
                                            {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
                                        </span>
                                        {isHovered && !isLoading && (
                                            <motion.span
                                                initial={{ left: "-100%" }}
                                                animate={{ left: "100%" }}
                                                transition={{ duration: 1, ease: "easeInOut" }}
                                                className="absolute top-0 bottom-0 left-0 w-20 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                                                style={{ filter: "blur(8px)" }}
                                            />
                                        )}
                                    </Button>
                                </motion.div>
                            </form>
                        </motion.div>
                    </div>
                </motion.div>
            </div>

            {/* Simple Footer */}
            <footer className="absolute bottom-4 w-full text-center text-[10px] text-gray-400 dark:text-gray-600 opacity-60">
                <p>
                    &copy; 2025-{new Date().getFullYear()} Zedeck's Training | {APP_VERSION}
                </p>
            </footer>
        </div>
    );
}
