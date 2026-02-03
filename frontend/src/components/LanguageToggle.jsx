import React from 'react';
import { useTranslation } from 'react-i18next';

export default function LanguageToggle() {
    const { i18n } = useTranslation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    return (
    return (
        <button
            onClick={() => changeLanguage(i18n.language === 'pt' ? 'en' : 'pt')}
            className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full px-3 py-1.5 transition-all shadow-sm border border-gray-200 dark:border-gray-700"
            title={i18n.language === 'pt' ? "Switch to English" : "Mudar para Português"}
        >
            <span className={`fi fi-${i18n.language === 'pt' ? 'mz' : 'gb'} text-lg rounded-full w-5 h-5 flex-shrink-0 object-cover`}></span>
            <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                {i18n.language === 'pt' ? 'PT' : 'EN'}
            </span>
        </button>
    );
}
    );
}
