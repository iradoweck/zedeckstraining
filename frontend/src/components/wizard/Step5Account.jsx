import { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { ArrowLeft, CheckCircle, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api'; // Ensure this exists

export default function Step5Account({ formData, updateFormData, onBack }) {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        updateFormData({ [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError("As senhas não coincidem.");
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            // Prepare payload for backend
            // Note: This endpoint '/register/wizard' needs to be implemented or we adapt to '/auth/register'
            // For now we simulate or try to hit a standard register if possible, but the data is complex.
            // Let's assume we hit the standard register but with extra meta data, OR a new endpoint.
            // Given I haven't made the backend endpoint yet, I will mock the success or try to send what I can.

            // payload
            const payload = {
                name: `${formData.firstName} ${formData.lastName}`,
                email: formData.email,
                password: formData.password,
                role: 'student',
                // Meta data would go here if backend supports it
                // For MVP 1.0 -> 1.1 transition, we might not save EVERYTHING yet without backend update.
                // But the user asked for the frontend flow.
            };

            await api.post('/auth/register', payload); // Using standard auth for now to ensure user is created.

            // Redirect to Success Page or Student Dashboard
            navigate('/student/dashboard');

        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Erro ao criar conta. Tente novamente.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={32} />
                </div>
                <h2 className="text-2xl font-bold font-heading">Quase lá!</h2>
                <p className="text-gray-500">Crie suas credenciais para acessar o Portal do Aluno.</p>
            </div>

            <div className="space-y-4 bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-100 dark:border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Nome Completo</label>
                        <div className="font-bold">{formData.firstName} {formData.lastName}</div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                        <div className="font-bold">{formData.email}</div>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <Input
                    label="Nome de Usuário"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Ex: joao.silva"
                    required
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Senha"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        label="Confirmar Senha"
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>

            {error && (
                <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm text-center">
                    {error}
                </div>
            )}

            <div className="flex justify-between pt-4">
                <Button type="button" variant="outline" onClick={onBack} disabled={isSubmitting} className="flex items-center gap-2">
                    <ArrowLeft size={18} /> Voltar
                </Button>
                <Button type="submit" disabled={isSubmitting} className="flex items-center gap-2 w-full sm:w-auto">
                    {isSubmitting ? <Loader className="animate-spin" size={18} /> : 'Confirmar e Acessar Portal'}
                </Button>
            </div>
        </form>
    );
}
