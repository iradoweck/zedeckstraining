import React from 'react';
import { useTheme } from '../hooks/useTheme';
import { Sun, Moon, Monitor } from 'lucide-react';

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme();

    const cycleTheme = () => {
        if (theme === 'light') setTheme('dark');
        else if (theme === 'dark') setTheme('system');
        else setTheme('light');
    };

    return (
        <button
            onClick={cycleTheme}
            className="flex items-center justify-center bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full w-8 h-8 transition-all shadow-sm border border-gray-200 dark:border-gray-700"
            title={`Theme: ${theme.charAt(0).toUpperCase() + theme.slice(1)}`}
        >
            {theme === 'light' && <Sun size={18} className="text-orange-500" />}
            {theme === 'dark' && <Moon size={18} className="text-blue-400" />}
            {theme === 'system' && <Monitor size={18} className="text-gray-600 dark:text-gray-400" />}
        </button>
    );
}
