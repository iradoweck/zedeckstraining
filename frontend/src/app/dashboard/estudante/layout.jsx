import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../../components/layout/Sidebar';
import Topbar from '../../../components/layout/Topbar';
import { useAuth } from '../../../context/AuthContext';
import { usePageTitle } from '../../../hooks/usePageTitle';

import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

export default function StudentLayout() {
    const { user, logout } = useAuth();
    const { t } = useTranslation();
    usePageTitle();

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Check for Login Success Message
    useEffect(() => {
        const shouldShowLogin = localStorage.getItem('show_login_success');
        if (shouldShowLogin) {
            toast.success(t('login_success', 'Login realizado Com sucesso'), {
                icon: '🚀',
                duration: 4000,
                style: {
                    borderRadius: '10px',
                    background: '#10B981', // Emerald green
                    color: '#fff',
                },
            });
            localStorage.removeItem('show_login_success');
        }
    }, [t]);

    // Theme State
    const [isDark, setIsDark] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('theme');
            return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
        }
        return false;
    });

    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDark]);

    const toggleTheme = () => {
        const newTheme = !isDark;
        setIsDark(newTheme);
        localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    };

    // RBAC Check (Extra Safety)
    if (user && user.role !== 'student') {
        return <div className="p-10 text-center">Acesso não autorizado.</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                isCollapsed={isCollapsed}
                toggleCollapse={() => setIsCollapsed(prev => !prev)}
                userStatus={user?.status || 'regular'}
                onLogout={logout}
            />

            <div className={`min-h-screen flex flex-col transition-all duration-300 ${isCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
                <Topbar
                    onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    user={user}
                    toggleTheme={toggleTheme}
                    isDark={isDark}
                    onLogout={logout}
                />

                <main className="flex-1 p-4 md:p-8 pt-20 md:pt-24 max-w-7xl mx-auto w-full animate-in fade-in duration-500">
                    <Outlet />
                </main>

                <footer className="text-center py-6 text-xs text-gray-400 dark:text-gray-600 border-t border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-black/20">
                    <p>&copy; {new Date().getFullYear()} Zedeck's Training System.</p>
                </footer>
            </div>
        </div>
    );
}
