import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import StudentDashboard from '../components/student/StudentDashboard';
import TrainerDashboard from '../components/trainer/TrainerDashboard';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import { usePageTitle } from '../hooks/usePageTitle';

export default function Dashboard() {
    const { user, logout } = useAuth();
    usePageTitle();

    // Layout State
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Lazy initialize theme to avoid sync effect warning
    const [isDark, setIsDark] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('theme');
            if (saved === 'dark') return true;
            if (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches) return true;
        }
        return false;
    });

    // Sync class with state
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

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            {/* Sidebar (Navigation) */}
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                userStatus={user?.status || 'regular'}
                onLogout={logout}
            />

            {/* Main Content Wrapper */}
            <div className="md:ml-64 min-h-screen flex flex-col transition-all duration-300">
                {/* Topbar (Header) */}
                <Topbar
                    onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    user={user}
                    toggleTheme={toggleTheme}
                    isDark={isDark}
                />

                {/* Dashboard Content Switch based on Role */}
                <main className="flex-1 p-4 md:p-8 pt-20 md:pt-24 max-w-7xl mx-auto w-full animate-in fade-in duration-500">
                    {user?.role === 'student' && <StudentDashboard user={user} />}
                    {user?.role === 'trainer' && <TrainerDashboard user={user} />}
                    {user?.role === 'admin' && (
                        <div className="p-8 bg-white dark:bg-gray-800 rounded-lg shadow text-center border border-gray-100 dark:border-gray-700">
                            <h2 className="text-xl font-bold dark:text-white">Admin Dashboard</h2>
                            <p className="text-gray-500 dark:text-gray-400 mt-2">Coming soon...</p>
                        </div>
                    )}
                </main>

                {/* Simplified Footer */}
                <footer className="text-center py-6 text-xs text-gray-400 dark:text-gray-600 border-t border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-black/20">
                    <p>&copy; {new Date().getFullYear()} Zedeck's Training System.</p>
                    <p className="mt-1 opacity-70">v1.2.3</p>
                </footer>
            </div>
        </div>
    );
}
