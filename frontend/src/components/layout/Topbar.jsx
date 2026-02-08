import React from 'react';
import { Bell, Menu, Moon, Sun, Globe, User, LogOut } from 'lucide-react';
import { Button } from '../ui/button';
import { useTranslation } from 'react-i18next';

// ... (rest of imports/component definition remains same until the dropdown part)

// I will target the specific icon replacements in a cleaner way if I can, but replacing the whole file content or large chunk might be safer to ensure imports are there.
// Actually, let me just add the imports and replace the icon usages.

// Step 1: Add imports


// Assuming we have a ThemeContext or useTheme hook, if not I'll just keep the switch visual for now as per instructions.
// But the code previously had dark mode logic. I will use standard class toggling if needed later, 
// for now keeping it localized to props or standard hooks if available.

const Topbar = ({ onMenuClick, user, toggleTheme, isDark, onLogout }) => {
    const { t, i18n } = useTranslation();
    const [currentTime, setCurrentTime] = React.useState(new Date());
    const [isProfileOpen, setIsProfileOpen] = React.useState(false);
    const profileRef = React.useRef(null);

    // Update Clock
    React.useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Close Dropdown on Click Outside
    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleLanguage = () => {
        const newLang = i18n.language === 'pt' ? 'en' : 'pt';
        i18n.changeLanguage(newLang);
    };

    // Date Format Options
    const dateOptions = { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' };
    const timeOptions = { hour: '2-digit', minute: '2-digit' };

    return (
        <header className="fixed top-0 right-0 left-0 md:left-20 lg:md:left-64 h-16 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 z-30 flex items-center justify-between px-4 sm:px-6 transition-all duration-300">
            {/* Left: Mobile Menu Trigger & Date/Time */}
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuClick}
                    className="p-2 -ml-2 mr-2 md:hidden text-gray-600 hover:bg-gray-100 rounded-lg dark:text-gray-300 dark:hover:bg-gray-800"
                >
                    <Menu className="w-6 h-6" />
                </button>

                {/* Real-time Clock */}
                <div className="hidden sm:flex flex-col leading-tight">
                    <span className="text-sm font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wide">
                        {currentTime.toLocaleDateString(i18n.language, dateOptions)}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                        {currentTime.toLocaleTimeString(i18n.language, timeOptions)}
                    </span>
                </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 sm:gap-4">
                {/* Notifications */}
                <Button variant="ghost" size="icon" className="relative text-gray-500 hover:text-blue-600 dark:text-gray-400">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-900"></span>
                </Button>

                {/* Theme Toggle */}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleTheme}
                    className="text-gray-500 hover:text-yellow-500 dark:text-gray-400"
                >
                    {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </Button>

                {/* Language Toggle */}
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleLanguage}
                    className="flex items-center gap-2 text-gray-600 dark:text-gray-300 font-medium uppercase"
                >
                    <Globe className="w-4 h-4" />
                    <span className="hidden xs:inline">{i18n.language}</span>
                </Button>

                {/* User Profile Dropdown */}
                <div className="pl-4 border-l border-gray-200 dark:border-gray-700 ml-2 relative" ref={profileRef}>
                    <button
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 p-1 rounded-full pr-3 transition-colors outline-none focus:ring-2 focus:ring-blue-500/20"
                    >
                        <div className="text-right hidden md:block">
                            <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">{user?.name || t('student_title', 'Estudante')}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{t('role_student', 'Aluno')}</p>
                        </div>
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-md ring-2 ring-white dark:ring-gray-800 overflow-hidden">
                            {user?.avatar ? (
                                <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <span>{user?.name?.[0] || 'S'}</span>
                            )}
                        </div>
                    </button>

                    {/* Dropdown Menu */}
                    {isProfileOpen && (
                        <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 py-2 animate-in fade-in slide-in-from-top-2 z-50">
                            <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 mb-2 md:hidden">
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">{user?.name || t('student_title', 'Estudante')}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email || 'student@zts.com'}</p>
                            </div>

                            <a href="/dashboard/estudante/perfil" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                <span className="p-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
                                    <User className="w-4 h-4" />
                                </span>
                                {t('profile_settings', 'Configurar Perfil')}
                            </a>

                            <div className="my-2 border-t border-gray-100 dark:border-gray-700"></div>

                            <button
                                onClick={onLogout} // Assuming onLogout is passed to Topbar or handled via context if not passed
                                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors text-left"
                            >
                                <span className="p-1.5 bg-red-50 dark:bg-red-900/20 rounded-lg">
                                    <LogOut className="w-4 h-4" />
                                </span>
                                {t('logout', 'Sair')}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Topbar;
