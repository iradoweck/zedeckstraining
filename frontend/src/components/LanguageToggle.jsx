import React from 'react';
import { useTranslation } from 'react-i18next';

export default function LanguageToggle() {
    const { i18n } = useTranslation();

    const toggleLanguage = () => {
        const newLang = i18n.language === 'pt' ? 'en' : 'pt';
        i18n.changeLanguage(newLang);
    };

    return (
        <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors
                 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-navy-light"
            title="Switch Language / Mudar Idioma"
        >
            <span className={i18n.language === 'pt' ? 'font-bold text-primary' : ''}>PT</span>
            <span className="text-gray-300 dark:text-gray-600">|</span>
            <span className={i18n.language === 'en' ? 'font-bold text-primary' : ''}>EN</span>
        </button>
    );
}
