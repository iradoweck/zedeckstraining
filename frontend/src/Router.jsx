import { createBrowserRouter, Outlet, Navigate } from 'react-router-dom';
import StudentLayout from './app/dashboard/estudante/layout';
import StudentOverview from './app/dashboard/estudante/overview/page';
import StudentFinancial from './app/dashboard/estudante/financeiro/page';
import StudentInvoices from './app/dashboard/estudante/faturas/page';
import StudentPayments from './app/dashboard/estudante/pagamentos/page';
import StudentReceipts from './app/dashboard/estudante/recibos/page';
import StudentCourses from './app/dashboard/estudante/cursos/page';
import StudentDocuments from './app/dashboard/estudante/documentos/page';
import StudentProfile from './app/dashboard/estudante/perfil/page';
import StudentSecurity from './app/dashboard/estudante/seguranca/page';
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
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

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
            {
                path: 'forgot-password',
                element: <ForgotPassword />
            },
            {
                path: 'reset-password',
                element: <ResetPassword />
            },
            {
                path: 'password-reset/:token',
                element: <ResetPassword />
            },

            // Protected Routes
            {
                path: 'dashboard',
                element: <ProtectedRoute><Dashboard /></ProtectedRoute>
            },
            {
                path: 'dashboard/estudante',
                element: <ProtectedRoute><StudentLayout /></ProtectedRoute>,
                children: [
                    {
                        index: true,
                        element: <Navigate to="overview" replace />
                    },
                    {
                        path: 'overview',
                        element: <StudentOverview />
                    },
                    {
                        path: 'financeiro',
                        element: <StudentFinancial />
                    },
                    {
                        path: 'faturas',
                        element: <StudentInvoices />
                    },
                    {
                        path: 'pagamentos',
                        element: <StudentPayments />
                    },
                    {
                        path: 'recibos',
                        element: <StudentReceipts />
                    },
                    {
                        path: 'cursos',
                        element: <StudentCourses />
                    },
                    {
                        path: 'documentos',
                        element: <StudentDocuments />
                    },
                    {
                        path: 'perfil',
                        element: <StudentProfile />
                    },
                    {
                        path: 'seguranca',
                        element: <StudentSecurity />
                    },
                    { path: '*', element: <div className="p-8">Página não encontrada.</div> }
                ]
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
