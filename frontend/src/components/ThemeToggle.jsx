import React from 'react';
import { useTheme } from '../hooks/useTheme';
import { Sun, Moon, Monitor } from 'lucide-react';

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme();

    return (
        <div className="flex items-center gap-1 bg-background-light dark:bg-navy-light p-1 rounded-full border border-gray-200 dark:border-navy">
            <button
                onClick={() => setTheme('light')}
                className={`p-1.5 rounded-full transition-all ${theme === 'light' ? 'bg-white shadow-sm text-primary' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}`}
                title="Light Mode"
            >
                <Sun size={16} />
            </button>
            <button
                onClick={() => setTheme('system')}
                className={`p-1.5 rounded-full transition-all ${theme === 'system' ? 'bg-white dark:bg-navy shadow-sm text-primary' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}`}
                title="System Default"
            >
                <Monitor size={16} />
            </button>
            <button
                onClick={() => setTheme('dark')}
                className={`p-1.5 rounded-full transition-all ${theme === 'dark' ? 'bg-navy text-white shadow-sm' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}`}
                title="Dark Mode"
            >
                <Moon size={16} />
            </button>
        </div>
    );
}
