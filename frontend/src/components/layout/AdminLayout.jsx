import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import {
    LayoutDashboard, BookOpen, Settings, LogOut,
    Menu, X, Shield, Bell, Search, User as UserIcon, Users
} from 'lucide-react';
import { useState } from 'react';
import clsx from 'clsx';

export default function AdminLayout({ children }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
        { icon: Users, label: 'Users', path: '/admin/users' },
        { icon: BookOpen, label: 'Courses', path: '/admin/courses' },
        { icon: Settings, label: 'Settings', path: '/admin/settings' },
    ];

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans overflow-hidden">
            {/* Sidebar */}
            <aside
                className={clsx(
                    "fixed inset-y-0 left-0 z-50 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 md:relative",
                    isSidebarOpen ? "w-64 translate-x-0" : "w-20 -translate-x-full md:translate-x-0",
                    !isSidebarOpen && "md:w-20", // Collapsed width on desktop
                    isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0" // Mobile behavior
                )}
            >
                <div className="h-full flex flex-col">
                    {/* Logo Area */}
                    <div className="h-16 flex items-center justify-center border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-2 font-bold text-xl">
                            <Shield className="text-primary" size={24} />
                            <span className={clsx("transition-opacity duration-300", !isSidebarOpen && "md:hidden")}>
                                Admin
                            </span>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-primary transition-colors group"
                            >
                                <item.icon size={20} className="shrink-0 group-hover:text-primary" />
                                <span className={clsx("whitespace-nowrap transition-opacity duration-300", !isSidebarOpen && "md:hidden")}>
                                    {item.label}
                                </span>
                                {!isSidebarOpen && (
                                    <div className="hidden md:block absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none z-50 whitespace-nowrap">
                                        {item.label}
                                    </div>
                                )}
                            </Link>
                        ))}
                    </nav>

                    {/* User Profile / Logout */}
                    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                        <div className={clsx("flex items-center gap-3", !isSidebarOpen && "md:justify-center")}>
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                {user?.profile_photo ? (
                                    <img src={user.profile_photo} alt={user.name} className="w-8 h-8 rounded-full" />
                                ) : (
                                    <span className="font-bold text-primary text-xs">{user?.name?.charAt(0)}</span>
                                )}
                            </div>
                            <div className={clsx("flex-1 min-w-0 transition-opacity duration-300", !isSidebarOpen && "md:hidden")}>
                                <p className="text-sm font-medium truncate">{user?.name}</p>
                                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className={clsx(
                                "mt-4 w-full flex items-center gap-2 justify-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors",
                                !isSidebarOpen && "md:p-2"
                            )}
                        >
                            <LogOut size={18} />
                            <span className={clsx("transition-opacity duration-300", !isSidebarOpen && "md:hidden")}>Logout</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-4">
                        <button onClick={toggleSidebar} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 hidden md:block">
                            <Menu size={20} />
                        </button>
                        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 md:hidden">
                            <Menu size={20} />
                        </button>
                        {/* Breadcrumbs or Page Title could go here */}
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative hidden sm:block">
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-64 h-9 pl-9 pr-4 rounded-lg bg-gray-100 dark:bg-gray-700 border-none text-sm focus:ring-2 focus:ring-primary outline-none"
                            />
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        </div>
                        <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 relative">
                            <Bell size={20} />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-800"></span>
                        </button>
                    </div>
                </header>

                {/* Content Scrollable Area */}
                <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>

            {/* Mobile Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                ></div>
            )}
        </div>
    );
}
