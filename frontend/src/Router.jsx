import { createBrowserRouter } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Classroom from './pages/Classroom';
import ClassManagement from './pages/ClassManagement';
import ProtectedRoute from './components/layout/ProtectedRoute';

const router = createBrowserRouter([
    {
        path: '/login',
        element: <Login />
    },
    {
        path: '/',
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
