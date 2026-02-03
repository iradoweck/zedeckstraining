import { createBrowserRouter, Outlet } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Classroom from './pages/Classroom';
import ClassManagement from './pages/ClassManagement';
import Landing from './pages/Landing';
import PublicCourses from './pages/PublicCourses';
import PublicCourseDetail from './pages/PublicCourseDetail';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminCourses from './pages/AdminCourses';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import ErrorPage from './pages/ErrorPage';
import ProtectedRoute from './components/layout/ProtectedRoute';
import RegistrationWizard from './pages/RegistrationWizard';

const router = createBrowserRouter([
    {
        path: '/',
        errorElement: <ErrorPage />,
        element: <Outlet />,
        children: [
            // Public Routes
            {
                index: true,
                element: <Landing />
            },
            {
                path: 'register',
                element: <Register />
            },
            {
                path: 'courses',
                element: <PublicCourses />
            },
            {
                path: 'courses/:courseId',
                element: <PublicCourseDetail />
            },
            {
                path: 'about',
                element: <About />
            },
            {
                path: 'contact',
                element: <Contact />
            },

            // Auth Routes
            {
                path: 'login',
                element: <Login />
            },

            // Protected Routes
            {
                path: 'dashboard',
                element: <ProtectedRoute><Dashboard /></ProtectedRoute>
            },
            {
                path: 'classroom/:classId',
                element: <ProtectedRoute><Classroom /></ProtectedRoute>
            },
            {
                path: 'manage-class/:classId',
                element: <ProtectedRoute><ClassManagement /></ProtectedRoute>
            },

            // Admin Routes (Should be protected by role check ideally)
            {
                path: 'admin/dashboard',
                element: <ProtectedRoute><AdminDashboard /></ProtectedRoute>
            },

            // Catch-all 404
            {
                path: '*',
                element: <NotFound />
            }
        ]
    }
]);

export default router;
