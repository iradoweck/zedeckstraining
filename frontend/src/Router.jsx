import { createBrowserRouter } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Classroom from './pages/Classroom';
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
    }
]);

export default router;
