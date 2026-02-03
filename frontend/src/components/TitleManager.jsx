import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

export default function TitleManager() {
    const { user } = useAuth();
    const location = useLocation();
    const { t } = useTranslation();

    useEffect(() => {
        const path = location.pathname;
        let title = "Zedeck Training System"; // Default

        // Check Roles for specific title
        if (user) {
            if (user.role === 'student' || user.role === 'trainer') {
                title = "Plataforma Académica ZT";
            } else if (user.role === 'admin') {
                title = "Zedeck Training System"; // Admin keeps original
            }
        } 

        // Optional: Append Page Name (can be expanded later)
        // if (path === '/login') title = `Login - ${title}`;
        
        document.title = title;

    }, [user, location, t]);

    return null; // Logic only component
}
