import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
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
            // Create FormData for file upload support
            const data = new FormData();

            // Standard Auth Fields
            data.append('name', `${formData.firstName} ${formData.lastName}`);
            data.append('email', formData.email);
            data.append('password', formData.password);
            data.append('role', 'student');

            // Extended Profile Fields
            data.append('father_name', formData.fatherName || '');
            data.append('mother_name', formData.motherName || '');
            data.append('gender', formData.gender || '');
            data.append('marital_status', formData.maritalStatus || '');
            data.append('occupation', formData.occupation || '');
            data.append('nationality', formData.nationality || '');
            data.append('birth_date', formData.birthDate || '');
            data.append('document_type', formData.documentType || '');
            data.append('document_number', formData.documentNumber || '');

            // Education
            data.append('education_level', formData.educationLevel || '');

            // Courses & Config (as JSON strings or indexed arrays)
            // Laravel expects array inputs like courses[0], courses[1]
            formData.courses.forEach((courseId, index) => {
                data.append(`courses[${index}]`, courseId);
            });

            data.append('schedule', formData.schedule || '');
            data.append('uniform_option', formData.uniformOption || 'include_now');

            // Dynamic Options
            if (formData.examModality) data.append('exam_modality', formData.examModality);
            if (formData.programmingType) data.append('programming_type', formData.programmingType);

            // Payment
            data.append('payment_method', formData.paymentMethod || '');
            if (formData.paymentProof) {
                data.append('payment_proof', formData.paymentProof);
            }

            // generated ID
            data.append('student_code', formData.generatedId);

            await api.post('/auth/register', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            navigate('/dashboard');

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
