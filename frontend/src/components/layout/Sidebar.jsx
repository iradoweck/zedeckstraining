import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    BookOpen,
    CreditCard,
    FileText,
    User,
    LogOut,
    AlertCircle
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
// Removed unused cn import

const Sidebar = ({ isOpen, onClose, userStatus = 'regular', onLogout }) => {
    const { t } = useTranslation();

    // Navigation Items
    const navItems = [
        {
            icon: LayoutDashboard,
            label: t('dashboard', 'Dashboard'),
            to: '/dashboard',
            disabled: false
        },
        {
            icon: BookOpen,
            label: t('academic', 'Académico'),
            to: '/academic',
            disabled: userStatus === 'blocked', // Blocked if student is blocked
            tooltip: userStatus === 'blocked' ? t('access_blocked_financial', 'Acesso bloqueado por pendência financeira') : null
        },
        {
            icon: CreditCard,
            label: t('financial', 'Financeiro'),
            to: '/financial',
            disabled: false
        },
        {
            icon: FileText,
            label: t('documents', 'Documentos'),
            to: '/documents',
            disabled: false
        },
        {
            icon: User,
            label: t('account', 'Conta'),
            to: '/profile',
            disabled: false
        },
    ];

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 md:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar Container */}
            <aside className={`
                fixed top-0 left-0 z-50 h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800
                transform transition-transform duration-300 ease-in-out md:translate-x-0
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                {/* Logo Area */}
                <div className="h-16 flex items-center px-6 border-b border-gray-100 dark:border-gray-800">
                    <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                        ZTS
                    </span>
                    <span className="ml-2 text-sm font-medium text-gray-500">Student Portal</span>
                </div>

                {/* Navigation */}
                <nav className="p-4 space-y-2">
                    <div className="mb-4 px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        {t('menu', 'Menu')}
                    </div>

                    {navItems.map((item) => (
                        <div key={item.to} className="relative group">
                            {item.disabled ? (
                                <div className="flex items-center px-4 py-3 text-gray-400 cursor-not-allowed opacity-60">
                                    <item.icon className="w-5 h-5 mr-3" />
                                    <span className="font-medium">{item.label}</span>
                                    <AlertCircle className="w-4 h-4 ml-auto text-red-400" />

                                    {/* Tooltip for Disabled Items */}
                                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                                        {item.tooltip}
                                    </div>
                                </div>
                            ) : (
                                <NavLink
                                    to={item.to}
                                    onClick={() => window.innerWidth < 768 && onClose()}
                                    className={({ isActive }) => `
                                        flex items-center px-4 py-3 rounded-xl transition-all duration-200
                                        ${isActive
                                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 shadow-sm'
                                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'}
                                    `}
                                >
                                    <item.icon className="w-5 h-5 mr-3" />
                                    <span className="font-medium">{item.label}</span>
                                </NavLink>
                            )}
                        </div>
                    ))}
                </nav>

                {/* Bottom Section */}
                <div className="absolute bottom-0 left-0 w-full p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
                    <button
                        onClick={onLogout}
                        className="flex items-center w-full px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                    >
                        <LogOut className="w-5 h-5 mr-3" />
                        <span className="font-medium">{t('logout', 'Sair')}</span>
                    </button>
                    <div className="mt-4 text-xs text-center text-gray-400">
                        v1.2.3
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
