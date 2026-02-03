import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation Resources
const resources = {
    pt: {
        translation: {
            "welcome": "Bem-vindo ao ZTS",
            "login_title": "Entrar na Plataforma",
            "login_subtitle": "Insira suas credenciais para acessar a plataforma",
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
            "language": "Idioma",
            "back_home": "Voltar ao Início",
            "forgot_password": "Esqueceu sua senha?",
            "no_account": "Não tem uma conta?",
            "register_link": "Inscreva-se aqui",
            "rights_reserved": "Todos os direitos reservados",
            "nav_home": "Início",
            "nav_courses": "Cursos",
            "nav_about": "Sobre",
            "nav_contact": "Contato",
            "nav_dashboard": "Painel",
            "nav_login": "Entrar",
            "nav_get_started": "Começar",
            "hero_title_1": "Potencialize",
            "hero_title_2": "Sua",
            "hero_title_3": "Carreira",
            "hero_title_4": "com",
            "hero_title_5": "Excelência.",
            "hero_subtitle": "O <strong>Zedeck Training System (ZTS)</strong> é a plataforma de ensino de elite da Zedeck’s IT. Oferecemos formação técnica de alto nível, conectando teoria avançada à prática exigida pelo mercado global.",
            "hero_cta_primary": "Iniciar Jornada",
            "hero_cta_secondary": "Explorar Cursos",
            "about_title": "Quem Somos",
            "about_p1": "Fundada em 2025 como braço educacional da <strong>Zedeck’s IT</strong>, o ZTS nasce para suprir a lacuna de talentos tecnológicos de alta performance.",
            "about_p2": "Nossa missão é <strong>forjar profissionais completos</strong> através de uma metodologia imersiva. Acreditamos que a educação técnica deve ser um catalisador direto para inovação e empregabilidade.",
            "feat_tech_title": "Tecnologia",
            "feat_tech_desc": "Programação, Web Design, Informática Avançada.",
            "feat_biz_title": "Negócios",
            "feat_biz_desc": "Contabilidade, Gestão, Marketing, Secretariado.",
            "feat_com_title": "Comunicação",
            "feat_com_desc": "Inglês Profissional, Comunicação Organizacional.",
            "feat_net_title": "Networking",
            "feat_net_desc": "Conexão direta com o ecossistema Zedeck's IT.",
            "why_title": "Por que escolher a Zedeck's Training?",
            "why_1_title": "Prática acima da Teoria",
            "why_1_desc": "Cursos desenvolvidos com foco em execução e projetos reais.",
            "why_2_title": "Conexão com Mercado",
            "why_2_desc": "Oportunidades de estágio e integração em projetos da Zedeck's IT.",
            "why_3_title": "Formação Híbrida",
            "why_3_desc": "Flexibilidade com modalidades presencial, online e híbrida."
        }
    },
    en: {
        translation: {
            "welcome": "Welcome to ZTS",
            "login_title": "Login to Platform",
            "login_subtitle": "Enter your credentials to access the platform",
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
            "language": "Language",
            "back_home": "Back to Home",
            "forgot_password": "Forgot your password?",
            "no_account": "Don't have an account?",
            "register_link": "Register here",
            "rights_reserved": "All Rights Reserved",
            "nav_home": "Home",
            "nav_courses": "Courses",
            "nav_about": "About",
            "nav_contact": "Contact",
            "nav_dashboard": "Dashboard",
            "nav_login": "Login",
            "nav_get_started": "Get Started",
            "hero_title_1": "Empower",
            "hero_title_2": "Your",
            "hero_title_3": "Career",
            "hero_title_4": "with",
            "hero_title_5": "Excellence.",
            "hero_subtitle": "The <strong>Zedeck Training System (ZTS)</strong> is Zedeck’s IT elite educational platform. We offer high-level technical training, connecting advanced theory to the practice required by the global market.",
            "hero_cta_primary": "Start Journey",
            "hero_cta_secondary": "Explore Courses",
            "about_title": "Who We Are",
            "about_p1": "Founded in 2025 as the educational arm of <strong>Zedeck’s IT</strong>, ZTS was born to bridge the gap for high-performance technological talents.",
            "about_p2": "Our mission is to <strong>forge complete professionals</strong> through an immersive methodology. We believe technical education should be a direct catalyst for innovation and employability.",
            "feat_tech_title": "Technology",
            "feat_tech_desc": "Programming, Web Design, Advanced Computing.",
            "feat_biz_title": "Business",
            "feat_biz_desc": "Accounting, Management, Marketing, Secretarial.",
            "feat_com_title": "Communication",
            "feat_com_desc": "Professional English, Organizational Communication.",
            "feat_net_title": "Networking",
            "feat_net_desc": "Direct connection with the Zedeck's IT ecosystem.",
            "why_title": "Why choose Zedeck's Training?",
            "why_1_title": "Practice over Theory",
            "why_1_desc": "Courses developed with a focus on execution and real projects.",
            "why_2_title": "Market Connection",
            "why_2_desc": "Internship opportunities and integration into Zedeck's IT projects.",
            "why_3_title": "Hybrid Training",
            "why_3_desc": "Flexibility with in-person, online, and hybrid modalities."
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
