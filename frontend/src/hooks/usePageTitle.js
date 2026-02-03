import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

export function usePageTitle() {
    const { user } = useAuth();
    const location = useLocation();
    const { t } = useTranslation();

    useEffect(() => {
        const baseTitlePublic = "Zedeck Training System";
        const baseTitleAcademic = "Plataforma Académica ZT";

        // Logic for title
        let title = baseTitlePublic;

        if (user) {
            if (user.role === 'student' || user.role === 'trainer') {
                title = baseTitleAcademic;
            } else if (user.role === 'admin') {
                title = baseTitlePublic; // Admin uses the standard system title or specific if needed
            }
        }

        // Optional: Add specific page suffixes if needed
        // e.g., if (location.pathname === '/login') title += " - Login";

        document.title = title;

    }, [user, location, t]);
}
