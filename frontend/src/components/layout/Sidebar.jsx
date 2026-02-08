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
import { APP_VERSION } from '../constants';

const Sidebar = ({ isOpen, onClose, userStatus = 'regular', onLogout, isCollapsed, toggleCollapse }) => {
    const { t } = useTranslation();

    // Navigation Items
    const navItems = [
        {
            icon: LayoutDashboard,
            label: t('overview', 'Visão Geral'),
            to: '/dashboard/estudante/overview',
            disabled: false
        },
        {
            icon: CreditCard,
            label: t('financial', 'Financeiro'),
            to: '/dashboard/estudante/financeiro',
            disabled: false
        },
        {
            icon: FileText,
            label: t('invoices', 'Faturas'),
            to: '/dashboard/estudante/faturas',
            disabled: false
        },
        {
            icon: CreditCard,
            label: t('payments', 'Pagamentos'),
            to: '/dashboard/estudante/pagamentos',
            disabled: false
        },
        {
            icon: FileText,
            label: t('receipts', 'Recibos'),
            to: '/dashboard/estudante/recibos',
            disabled: false
        },
        {
            icon: BookOpen,
            label: t('my_courses', 'Meus Cursos'),
            to: '/dashboard/estudante/cursos',
            disabled: userStatus === 'blocked',
            tooltip: userStatus === 'blocked' ? t('access_blocked_financial', 'Acesso bloqueado por pendência financeira') : null
        },
        {
            icon: FileText,
            label: t('documents', 'Documentos'),
            to: '/dashboard/estudante/documentos',
            disabled: false
        },
        {
            icon: User,
            label: t('profile', 'Perfil'),
            to: '/dashboard/estudante/perfil',
            disabled: false
        },
        {
            icon: AlertCircle,
            label: t('security', 'Segurança'),
            to: '/dashboard/estudante/seguranca',
            disabled: false
        },
    ];

    const handleLogout = () => {
        // Set flag for Login page to show message
        localStorage.setItem('show_logout_message', 'true');
        onLogout();
    };

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
                fixed top-0 left-0 z-50 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800
                transform transition-all duration-300 ease-in-out md:translate-x-0
                flex flex-col
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                ${isCollapsed ? 'w-20' : 'w-64'}
            `}>
                {/* Logo Area - Click to Collapse */}
                <button
                    onClick={toggleCollapse}
                    className={`h-16 flex-none flex items-center ${isCollapsed ? 'justify-center' : 'px-6'} border-b border-gray-100 dark:border-gray-800 transition-all overflow-hidden w-full hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer outline-none focus:outline-none`}
                    title={t('toggle_sidebar', 'Alternar Menu')}
                >
                    <img
                        src="/assets/logo.png"
                        alt="ZTS Logo"
                        className={`object-contain transition-all duration-300 ${isCollapsed ? 'w-8 h-8' : 'w-8 h-8'}`}
                    />
                    {!isCollapsed && (
                        <span className="ml-3 text-sm font-bold text-gray-700 dark:text-gray-200 whitespace-nowrap opacity-100 transition-opacity uppercase tracking-wide">
                            {t('student_panel', 'Painel do Estudante')}
                        </span>
                    )}
                </button>

                {/* Navigation (Scrollable Area) */}
                <nav
                    className="flex-1 overflow-y-auto p-4 space-y-2"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} // Hide scrollbar Firefox/IE
                >
                    <style>{`
                        nav::-webkit-scrollbar { display: none; } 
                    `}</style>

                    {!isCollapsed && (
                        <div className="mb-4 px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">
                            {t('menu', 'Menu')}
                        </div>
                    )}

                    {navItems.map((item) => (
                        <div key={item.to} className="relative group">
                            {item.disabled ? (
                                <div className={`flex items-center ${isCollapsed ? 'justify-center px-0' : 'px-4'} py-3 text-gray-400 cursor-not-allowed opacity-60 transition-all`}>
                                    <item.icon className={`w-5 h-5 ${isCollapsed ? '' : 'mr-3'}`} />
                                    {!isCollapsed && <span className="font-medium whitespace-nowrap">{item.label}</span>}

                                    {/* Alert Icon (Logic for both views) */}
                                    {isCollapsed && <div className="absolute top-2 right-2 w-2 h-2 bg-red-400 rounded-full" />}
                                    {!isCollapsed && <AlertCircle className="w-4 h-4 ml-auto text-red-400" />}

                                    {/* Tooltip for Disabled Items */}
                                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                                        {item.tooltip || item.label}
                                    </div>
                                </div>
                            ) : (
                                <NavLink
                                    to={item.to}
                                    onClick={() => window.innerWidth < 768 && onClose()}
                                    className={({ isActive }) => `
                                        flex items-center ${isCollapsed ? 'justify-center px-0' : 'px-4'} py-3 rounded-xl transition-all duration-200
                                        ${isActive
                                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 shadow-sm'
                                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'}
                                    `}
                                >
                                    <item.icon className={`w-5 h-5 ${isCollapsed ? '' : 'mr-3'}`} />
                                    {!isCollapsed && <span className="font-medium whitespace-nowrap">{item.label}</span>}

                                    {/* Hover Tooltip when Collapsed */}
                                    {isCollapsed && (
                                        <div className="absolute left-full ml-2 px-3 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none shadow-lg">
                                            {item.label}
                                        </div>
                                    )}
                                </NavLink>
                            )}
                        </div>
                    ))}
                </nav>

                {/* Bottom Section */}
                <div className={`flex-none p-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 flex flex-col gap-2`}>

                    {/* Toggle Button REMOVED as per user request */}

                    <button
                        onClick={handleLogout}
                        className={`flex items-center ${isCollapsed ? 'justify-center' : 'px-4'} w-full py-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors group relative`}
                    >
                        <LogOut className={`w-5 h-5 ${isCollapsed ? '' : 'mr-3'}`} />
                        {!isCollapsed && <span className="font-medium whitespace-nowrap">{t('logout', 'Sair')}</span>}
                        {isCollapsed && (
                            <div className="absolute left-full ml-2 px-3 py-1 bg-red-600 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                                {t('logout', 'Sair')}
                            </div>
                        )}
                    </button>

                    {!isCollapsed && (
                        <div className="text-xs text-center text-gray-400 truncate">
                            {APP_VERSION}
                        </div>
                    )}
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
