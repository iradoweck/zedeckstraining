import { createBrowserRouter } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Classroom from './pages/Classroom';
import ClassManagement from './pages/ClassManagement';
import Landing from './pages/Landing';
import PublicCourses from './pages/PublicCourses';
import PublicCourseDetail from './pages/PublicCourseDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import ProtectedRoute from './components/layout/ProtectedRoute';

const router = createBrowserRouter([
    // Public Routes
    {
        path: '/',
        element: <Landing />
    },
    {
        path: '/courses',
        element: <PublicCourses />
    },
    {
        path: '/courses/:courseId',
        element: <PublicCourseDetail />
    },
    {
        path: '/about',
        element: <About />
    },
    {
        path: '/contact',
        element: <Contact />
    },

    // Auth Routes
    {
        path: '/login',
        element: <Login />
    },

    // Protected Routes
    {
        path: '/dashboard',
        element: <ProtectedRoute><Dashboard /></ProtectedRoute>
    },
    {
        path: '/classroom/:classId',
        element: <ProtectedRoute><Classroom /></ProtectedRoute>
    },
    {
        path: '/manage-class/:classId',
        element: <ProtectedRoute><ClassManagement /></ProtectedRoute>
    }
]);

export default router;
