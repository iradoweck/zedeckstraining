import React from 'react';
import { Bell, Menu, Moon, Sun, Globe } from 'lucide-react';
import { Button } from '../ui/button';
import { useTranslation } from 'react-i18next';

// Assuming we have a ThemeContext or useTheme hook, if not I'll just keep the switch visual for now as per instructions.
// But the code previously had dark mode logic. I will use standard class toggling if needed later, 
// for now keeping it localized to props or standard hooks if available.

const Topbar = ({ onMenuClick, user, toggleTheme, isDark }) => {
    const { i18n } = useTranslation();

    const toggleLanguage = () => {
        const newLang = i18n.language === 'pt' ? 'en' : 'pt';
        i18n.changeLanguage(newLang);
    };

    return (
        <header className="fixed top-0 right-0 left-0 md:left-64 h-16 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 z-30 flex items-center justify-between px-4 sm:px-6 transition-all duration-300">
            {/* Left: Mobile Menu Trigger & Breadcrumbs (Future) */}
            <div className="flex items-center">
                <button
                    onClick={onMenuClick}
                    className="p-2 -ml-2 mr-2 md:hidden text-gray-600 hover:bg-gray-100 rounded-lg dark:text-gray-300 dark:hover:bg-gray-800"
                >
                    <Menu className="w-6 h-6" />
                </button>
                <h1 className="text-lg font-semibold text-gray-800 dark:text-white hidden sm:block">
                    Dashboard
                </h1>
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
                    className="flex items-center gap-2 text-gray-600 dark:text-gray-300 font-medium"
                >
                    <Globe className="w-4 h-4" />
                    <span className="hidden xs:inline">{i18n.language === 'pt' ? 'PT' : 'EN'}</span>
                </Button>

                {/* User Profile */}
                <div className="pl-4 border-l border-gray-200 dark:border-gray-700 ml-2">
                    <div className="flex items-center gap-3">
                        <div className="text-right hidden md:block">
                            <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">{user?.name || 'Student'}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.role || 'student'}</p>
                        </div>
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-md ring-2 ring-white dark:ring-gray-800">
                            {user?.name?.[0] || 'S'}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Topbar;
