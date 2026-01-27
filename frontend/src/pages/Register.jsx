import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PublicLayout from '../components/layout/PublicLayout';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Register() {
    const navigate = useNavigate();
    const { login } = useAuth(); // We might use this to auto-login after register
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setIsLoading(true);

        try {
            const response = await api.post('/auth/register', formData);
            // Auto login logic: usually register returns token, or we redirect to login
            // Based on AuthController: return response()->json(['access_token' => $token, ...], 201);

            if (response.data.access_token) {
                localStorage.setItem('token', response.data.access_token);
                // We need to update context state, but context might only have 'login' method that takes credentials
                // Or we can just reload or redirect.
                // Ideally AuthContext has a method to setUser from token/response.
                // For now, let's redirect to login for simplicity or assume specific flow.
                // actually best UX is auto-login.
                navigate('/dashboard');
                window.location.reload(); // Quick way to hydration auth state if not exposed
            } else {
                navigate('/login');
            }
        } catch (error) {
            if (error.response?.status === 422) {
                const apiErrors = error.response.data.errors;
                // Flatten Laravel errors array to string
                const formattedErrors = {};
                Object.keys(apiErrors).forEach(key => {
                    formattedErrors[key] = apiErrors[key][0];
                });
                setErrors(formattedErrors);
            } else {
                setErrors({ general: 'Registration failed. Please try again.' });
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <PublicLayout>
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
                <Card className="max-w-md w-full p-8">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold font-heading text-gray-900 dark:text-white">Create Account</h2>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Join Zedeck's Training today
                        </p>
                    </div>

                    {errors.general && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm">
                            {errors.general}
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <Input
                            label="Full Name"
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            error={errors.name}
                        />
                        <Input
                            label="Email Address"
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            error={errors.email}
                        />
                        <Input
                            label="Password"
                            type="password"
                            required
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            error={errors.password}
                        />
                        <Input
                            label="Confirm Password"
                            type="password"
                            required
                            value={formData.password_confirmation}
                            onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                        />

                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? 'Creating Account...' : 'Sign Up'}
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Already have an account? </span>
                        <Link to="/login" className="font-medium text-primary hover:text-primary/80">
                            Sign in
                        </Link>
                    </div>
                </Card>
            </div>
        </PublicLayout>
    );
}
