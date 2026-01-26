import { useAuth } from '../context/AuthContext';
import { LogOut } from 'lucide-react';
import StudentDashboard from '../components/student/StudentDashboard';
import TrainerDashboard from '../components/trainer/TrainerDashboard';

export default function Dashboard() {
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
                <h1 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                    <span className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white text-lg">Z</span>
                    Zedeck's Training
                </h1>
                <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{user?.name}</p>
                        <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                    </div>
                    <div className="h-8 w-px bg-gray-200 dark:bg-gray-700 mx-1"></div>
                    <button
                        onClick={logout}
                        className="flex items-center gap-2 text-gray-500 hover:text-red-600 font-medium text-sm transition-colors p-2 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg"
                        title="Logout"
                    >
                        <LogOut size={18} />
                    </button>
                </div>
            </nav>

            <main className="p-4 md:p-8 max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Welcome back, {user?.name.split(' ')[0]}!
                    </h1>
                    <p className="text-gray-500">Here's what's happening today.</p>
                </div>

                {user?.role === 'student' && <StudentDashboard user={user} />}
                {user?.role === 'trainer' && <TrainerDashboard user={user} />}
                {user?.role === 'admin' && (
                    <div className="p-8 bg-white rounded-lg shadow text-center">
                        <h2 className="text-xl font-bold">Admin Dashboard</h2>
                        <p className="text-gray-500">Coming soon...</p>
                    </div>
                )}
            </main>
        </div>
    );
}
