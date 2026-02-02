import { useEffect, useState } from 'react';

export function useTheme() {
    const [theme, setTheme] = useState(
        localStorage.getItem('theme') ? localStorage.getItem('theme') : 'system'
    );

    useEffect(() => {
        const root = window.document.documentElement;

        const applyTheme = (targetTheme) => {
            if (targetTheme === 'dark') {
                root.classList.add('dark');
                root.classList.remove('light');
            } else if (targetTheme === 'light') {
                root.classList.add('light');
                root.classList.remove('dark');
            } else {
                // System preference
                const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (systemDark) {
                    root.classList.add('dark');
                } else {
                    root.classList.remove('dark');
                }
            }
        };

        applyTheme(theme);

        // Persist unless it's system
        if (theme !== 'system') {
            localStorage.setItem('theme', theme);
        } else {
            localStorage.removeItem('theme');
        }

        // Listener for system changes if mode is 'system'
        if (theme === 'system') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const handleChange = (e) => {
                if (e.matches) root.classList.add('dark');
                else root.classList.remove('dark');
            }
            mediaQuery.addEventListener('change', handleChange);
            return () => mediaQuery.removeEventListener('change', handleChange);
        }

    }, [theme]);

    return { theme, setTheme };
}
