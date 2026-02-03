import { useAuth } from '../context/AuthContext';
import { LogOut } from 'lucide-react';
import StudentDashboard from '../components/student/StudentDashboard';
import TrainerDashboard from '../components/trainer/TrainerDashboard';
import { useTranslation } from 'react-i18next';
import ThemeToggle from '../components/ThemeToggle';
import { usePageTitle } from '../hooks/usePageTitle';

export default function Dashboard() {
    const { user, logout } = useAuth();
    const { t } = useTranslation();
    usePageTitle();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
                <h1 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                    <span className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white text-lg">Z</span>
                    ZTS
                </h1>
                <div className="flex items-center gap-4">
                    <div className="hidden md:flex gap-2">
                        <ThemeToggle />
                    </div>

                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{user?.name}</p>
                        <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                    </div>
                    <div className="h-8 w-px bg-gray-200 dark:bg-gray-700 mx-1"></div>
                    <button
                        onClick={logout}
                        className="flex items-center gap-2 text-gray-500 hover:text-red-600 font-medium text-sm transition-colors p-2 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg"
                        title={t('logout')}
                    >
                        <LogOut size={18} />
                    </button>
                </div>
            </nav>

            <main className="p-4 md:p-8 max-w-7xl mx-auto">
                <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {t('welcome')}, {user?.name.split(' ')[0]}!
                        </h1>
                        <p className="text-gray-500">{t('dashboard')}</p>
                    </div>

                    {/* Mobile Toggles */}
                    <div className="flex md:hidden gap-2">
                        <ThemeToggle />
                    </div>
                </div>

                {user?.role === 'student' && <StudentDashboard user={user} />}
                {user?.role === 'trainer' && <TrainerDashboard user={user} />}
                {user?.role === 'admin' && (
                    <div className="p-8 bg-white dark:bg-gray-800 rounded-lg shadow text-center">
                        <h2 className="text-xl font-bold dark:text-white">Admin Dashboard</h2>
                        <p className="text-gray-500 dark:text-gray-400">Coming soon...</p>
                    </div>
                )}
            </main>

            {/* Fixed Footer */}
            <footer className="fixed bottom-0 w-full bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-2 px-6 flex items-center justify-center text-xs text-gray-400 dark:text-gray-600 z-40">
                <p>
                    &copy; 2025-{new Date().getFullYear()} Zedeck's Training | Todos os direitos reservados | Powered by <a href="https://zedecks.com" target="_blank" rel="noopener noreferrer" className="font-bold text-primary hover:underline">ZEDECK'S IT</a>
                </p>
                <div className="absolute right-6 opacity-70">
                    v1.2.1
                </div>
            </footer>
        </div>
    );
}
