import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { ArrowRight } from 'lucide-react';

export default function Step1Personal({ formData, updateFormData, onNext }) {
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        updateFormData({ [name]: type === 'checkbox' ? checked : value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onNext();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-2xl font-bold font-heading mb-6">Informações Pessoais</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Nome" name="firstName" value={formData.firstName} onChange={handleChange} required />
                <Input label="Apelido" name="lastName" value={formData.lastName} onChange={handleChange} required />

                <div className="md:col-span-2">
                    <Input label="Email" type="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>

                <Input label="Data de Nascimento" type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} required />
                <Input label="Naturalidade" name="birthPlace" value={formData.birthPlace} onChange={handleChange} required />

                <Input label="Nacionalidade" name="nationality" value={formData.nationality} onChange={handleChange} required />

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tipo de Documento</label>
                        <select
                            name="documentType"
                            value={formData.documentType}
                            onChange={handleChange}
                            className="w-full h-11 px-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary outline-none transition-all"
                        >
                            <option value="BI">Bilhete de Identidade (BI)</option>
                            <option value="Passaporte">Passaporte</option>
                            <option value="DIRE">DIRE</option>
                            <option value="Outro">Outro</option>
                        </select>
                    </div>
                    <Input label="Número do Documento" name="documentNumber" value={formData.documentNumber} onChange={handleChange} required />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Último Nível Académico</label>
                    <select
                        name="educationLevel"
                        value={formData.educationLevel}
                        onChange={handleChange}
                        className="w-full h-11 px-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary outline-none transition-all"
                        required
                    >
                        <option value="">Selecione...</option>
                        <option value="Ensino Básico">Ensino Básico</option>
                        <option value="Ensino Médio T. Geral">Ensino Médio (Técnico/Geral)</option>
                        <option value="Licenciatura">Licenciatura</option>
                        <option value="Mestrado">Mestrado</option>
                        <option value="Doutoramento">Doutoramento</option>
                    </select>
                </div>

                <div className="md:col-span-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            name="hasSpecialNeeds"
                            checked={formData.hasSpecialNeeds}
                            onChange={handleChange}
                            className="w-5 h-5 text-primary rounded focus:ring-primary"
                        />
                        <span className="text-gray-700 dark:text-gray-300">Possui alguma necessidade educativa especial?</span>
                    </label>

                    {formData.hasSpecialNeeds && (
                        <div className="mt-4">
                            <Input
                                label="Descreva a necessidade (Opcional)"
                                name="specialNeedsDescription"
                                value={formData.specialNeedsDescription}
                                onChange={handleChange}
                            />
                        </div>
                    )}
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <Button type="submit" className="w-full md:w-auto flex items-center gap-2">
                    Próximo <ArrowRight size={18} />
                </Button>
            </div>
        </form>
    );
}
