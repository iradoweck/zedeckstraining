import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import LanguageToggle from '../components/LanguageToggle';
import ThemeToggle from '../components/ThemeToggle';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import { usePageTitle } from '../hooks/usePageTitle';

export default function Register() {
    usePageTitle();
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
        password_confirmation: '',
        gender: '',
        birth_date: '',
        nationality: '',
        document_type: 'BI',
        document_number: '',
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSelectChange = (name, value) => {
        setFormData({ ...formData, [name]: value });
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
    const version = "v1.2.2";

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 relative">
            {/* Header Controls */}
            <div className="absolute top-6 left-6 z-20">
                <Link to="/" className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary transition-colors font-medium group">
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span>{t('back_home', 'Back to Home')}</span>
                </Link>
            </div>

            <div className="absolute top-4 right-4 flex gap-2 z-10">
                <LanguageToggle />
                <ThemeToggle />
            </div>

            <div className="flex-grow flex items-center justify-center p-4">
                <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-2xl border border-gray-100 dark:border-gray-700 relative my-8">
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

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Account Info */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-gray-700 pb-2">
                                {t('account_info', 'Account Information')}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">{t('name_label', 'Full Name')}</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="bg-gray-50 dark:bg-gray-900"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">{t('email_label', 'Email Address')}</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="student@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="bg-gray-50 dark:bg-gray-900"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="password">{t('password_label', 'Password')}</Label>
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="bg-gray-50 dark:bg-gray-900"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirm_password">{t('confirm_password_label', 'Confirm Password')}</Label>
                                    <Input
                                        id="confirm_password"
                                        name="password_confirmation"
                                        type="password"
                                        placeholder="••••••••"
                                        value={formData.password_confirmation}
                                        onChange={handleChange}
                                        className="bg-gray-50 dark:bg-gray-900"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Personal Info */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-gray-700 pb-2">
                                {t('personal_info', 'Personal Information')}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="birth_date">{t('birth_date_label', 'Date of Birth')}</Label>
                                    <Input
                                        id="birth_date"
                                        name="birth_date"
                                        type="date"
                                        value={formData.birth_date}
                                        onChange={handleChange}
                                        className="bg-gray-50 dark:bg-gray-900 block"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="gender">{t('gender_label', 'Gender')}</Label>
                                    <Select name="gender" onValueChange={(val) => handleSelectChange('gender', val)} required>
                                        <SelectTrigger className="bg-gray-50 dark:bg-gray-900">
                                            <SelectValue placeholder={t('select_gender', 'Select')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="M">{t('gender_male', 'Male')}</SelectItem>
                                            <SelectItem value="F">{t('gender_female', 'Female')}</SelectItem>
                                            <SelectItem value="O">{t('gender_other', 'Other')}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="nationality">{t('nationality_label', 'Nationality')}</Label>
                                    <Input
                                        id="nationality"
                                        name="nationality"
                                        placeholder="Ex: Moçambicana"
                                        value={formData.nationality}
                                        onChange={handleChange}
                                        className="bg-gray-50 dark:bg-gray-900"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* ID Info */}
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="document_type">{t('doc_type_label', 'Doc Type')}</Label>
                                    <Select name="document_type" value={formData.document_type} onValueChange={(val) => handleSelectChange('document_type', val)}>
                                        <SelectTrigger className="bg-gray-50 dark:bg-gray-900">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="BI">BI / ID Card</SelectItem>
                                            <SelectItem value="Passport">Passaporte</SelectItem>
                                            <SelectItem value="DIRE">DIRE</SelectItem>
                                            <SelectItem value="Voter">Cartão Eleitor</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2 col-span-2">
                                    <Label htmlFor="document_number">{t('doc_number_label', 'Document Number')}</Label>
                                    <Input
                                        id="document_number"
                                        name="document_number"
                                        placeholder="Ex: 1101001001001B"
                                        value={formData.document_number}
                                        onChange={handleChange}
                                        className="bg-gray-50 dark:bg-gray-900"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <Button type="submit" className="w-full mt-6" disabled={isLoading}>
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
