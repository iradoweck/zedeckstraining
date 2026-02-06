import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Landing from './pages/Landing';
import StudentLayout from './app/dashboard/estudante/layout';
import StudentOverview from './app/dashboard/estudante/overview/page';

import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/password-reset/:token" element={<ResetPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Student Dashboard Routes (v1.2.3 Architecture) */}
          <Route path="/dashboard" element={<Navigate to="/dashboard/estudante" replace />} />

          <Route path="/dashboard/estudante" element={<StudentLayout />}>
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<StudentOverview />} />
            {/* Placeholders for future phases to prevent 404 crashes on click */}
            <Route path="*" element={<div className="p-10">Página em construção (v1.2.x)</div>} />
          </Route>
          {/* Add more routes as needed */}
        </Routes>
      </Router>
      <Toaster position="top-right" />
    </AuthProvider>
  );
}

export default App;
