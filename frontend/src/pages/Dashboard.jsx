import { useAuth } from '../context/AuthContext';
import { LogOut } from 'lucide-react';

export default function Dashboard() {
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center">
                <h1 className="text-xl font-bold text-gray-800 dark:text-white">Zedeck's Training</h1>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                        Hello, <span className="font-semibold">{user?.name}</span> ({user?.role})
                    </span>
                    <button
                        onClick={logout}
                        className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium text-sm transition-colors"
                    >
                        <LogOut size={16} /> Logout
                    </button>
                </div>
            </nav>

            <main className="p-8 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h3 className="text-gray-500 text-sm font-medium mb-1">Active Courses</h3>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">3</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h3 className="text-gray-500 text-sm font-medium mb-1">Completed Modules</h3>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">12</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Your Courses</h2>
                    <p className="text-gray-500">You are not enrolled in any courses yet.</p>
                </div>
            </main>
        </div>
    );
}
