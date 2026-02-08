import React, { useState } from 'react';
import { FileText, Download, Search, FolderOpen } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import { useAuth } from '../context/AuthContext';
import { usePageTitle } from '../hooks/usePageTitle';
import { downloadPDF } from '../utils/pdfGenerator';

// Mock Documents Data
const documents = [
    { id: 'DOC-001', title: 'Comprovativo de Inscrição', date: '2026-01-15', type: 'Declaration', size: '120 KB' },
    { id: 'INV-2026-001', title: 'Fatura - Fevereiro 2026', date: '2026-01-25', type: 'Invoice', size: '450 KB' },
    { id: 'REC-2026-001', title: 'Recibo #9822', date: '2026-01-28', type: 'Receipt', size: '200 KB' },
    { id: 'GUIDE-001', title: 'Manual do Estudante v2', date: '2026-01-10', type: 'Guide', size: '2.4 MB' },
];

export default function Documents() {
    const { t } = useTranslation();
    const { user, logout } = useAuth();
    usePageTitle();

    // Layout State
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Theme State
    const [isDark, setIsDark] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('theme');
            return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
        }
        return false;
    });

    const toggleTheme = () => {
        const newTheme = !isDark;
        setIsDark(newTheme);
        localStorage.setItem('theme', newTheme ? 'dark' : 'light');
        if (newTheme) document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
    };

    const handleDownload = (doc) => {
        downloadPDF(doc, user?.name);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                userStatus={user?.status || 'regular'}
                onLogout={logout}
            />

            <div className="md:ml-64 min-h-screen flex flex-col">
                <Topbar
                    onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    user={user}
                    toggleTheme={toggleTheme}
                    isDark={isDark}
                />

                <main className="flex-1 p-4 md:p-8 pt-20 md:pt-24 max-w-7xl mx-auto w-full">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <FolderOpen className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                                {t('documents_area', 'Área de Documentos')}
                            </h1>
                            <p className="text-gray-500 dark:text-gray-400 mt-1">
                                {t('documents_desc', 'Acesse suas faturas, recibos e declarações.')}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder={t('search_docs', 'Buscar documentos...')}
                                    className="pl-9 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm w-full md:w-64 outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {documents.map((doc) => (
                            <Card key={doc.id} className="p-4 hover:shadow-md transition-shadow border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-start gap-4 group">
                                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-blue-600 dark:text-blue-400 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 transition-colors">
                                    <FileText className="w-6 h-6" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-gray-900 dark:text-white truncate" title={doc.title}>
                                        {doc.title}
                                    </h3>
                                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                                        <span>{new Date(doc.date).toLocaleDateString()}</span>
                                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                        <span>{doc.size}</span>
                                    </p>
                                    <div className="mt-3 flex items-center gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="h-8 text-xs w-full"
                                            onClick={() => handleDownload(doc)}
                                        >
                                            <Download className="w-3 h-3 mr-2" />
                                            {t('download', 'Baixar')}
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>

                    <footer className="text-center py-6 text-xs text-gray-400 dark:text-gray-600 border-t border-gray-200 dark:border-gray-800 mt-auto">
                        <p>&copy; {new Date().getFullYear()} Zedeck's Training System.</p>
                    </footer>
                </main>
            </div>
        </div>
    );
}
