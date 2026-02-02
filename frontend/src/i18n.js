import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation Resources
const resources = {
    pt: {
        translation: {
            "welcome": "Bem-vindo ao ZTS",
            "login_title": "Entrar na Plataforma",
            "email_label": "Email",
            "password_label": "Senha",
            "login_button": "Entrar",
            "loading": "Carregando...",
            "dashboard": "Painel",
            "courses": "Cursos",
            "my_learning": "Meu Aprendizado",
            "logout": "Sair",
            "theme_dark": "Modo Escuro",
            "theme_light": "Modo Claro",
            "theme_system": "Sistema",
            "language": "Idioma"
        }
    },
    en: {
        translation: {
            "welcome": "Welcome to ZTS",
            "login_title": "Login to Platform",
            "email_label": "Email",
            "password_label": "Password",
            "login_button": "Log In",
            "loading": "Loading...",
            "dashboard": "Dashboard",
            "courses": "Courses",
            "my_learning": "My Learning",
            "logout": "Logout",
            "theme_dark": "Dark Mode",
            "theme_light": "Light Mode",
            "theme_system": "System",
            "language": "Language"
        }
    }
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'pt', // Default to Portuguese (Mozambique context)
        interpolation: {
            escapeValue: false // React already escapes values
        },
        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage'] // Persist language choice
        }
    });

export default i18n;
