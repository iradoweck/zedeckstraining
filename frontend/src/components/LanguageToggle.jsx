import React from 'react';
import { useTranslation } from 'react-i18next';

export default function LanguageToggle() {
    const { i18n } = useTranslation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    return (
        <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
                onClick={() => changeLanguage('pt')}
                className={`p-1.5 rounded-md transition-all ${i18n.language === 'pt' ? 'bg-white dark:bg-gray-700 shadow-sm opacity-100' : 'opacity-50 hover:opacity-100'}`}
                title="Português (Mozambique)"
            >
                <span className="fi fi-mz text-xl rounded-sm"></span>
            </button>
            <button
                onClick={() => changeLanguage('en')}
                className={`p-1.5 rounded-md transition-all ${i18n.language === 'en' ? 'bg-white dark:bg-gray-700 shadow-sm opacity-100' : 'opacity-50 hover:opacity-100'}`}
                title="English (UK)"
            >
                <span className="fi fi-gb text-xl rounded-sm"></span>
            </button>
        </div>
    );
}
