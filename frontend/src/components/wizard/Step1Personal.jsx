import { useState, useMemo } from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { ArrowRight } from 'lucide-react';

const COUNTRIES = [
    "África do Sul", "Alemanha", "Angola", "Brasil", "Cabo Verde", "China", "Espanha", "Estados Unidos", "França", "Guiné-Bissau", "Índia", "Moçambique", "Portugal", "Reino Unido", "São Tomé e Príncipe", "Zimbabué"
];

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
        <form onSubmit={handleSubmit} className="relative space-y-6 z-10">
            {/* Liquid Background */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none opacity-30 dark:opacity-10">
                <div className="absolute top-0 left-1/4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
                <div className="absolute top-0 right-1/4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-1/3 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
            </div>

            <h2 className="text-2xl font-bold font-heading mb-6">Informações Pessoais</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Nome" name="firstName" value={formData.firstName} onChange={handleChange} required />
                <Input label="Apelido" name="lastName" value={formData.lastName} onChange={handleChange} required />

                <div className="md:col-span-2">
                    <Input label="Filiação (Pais)" placeholder="Nome Completo do Pai / Mãe" name="filiation" value={formData.filiation} onChange={handleChange} />
                </div>

                <div className="md:col-span-2">
                    <Input label="Email" type="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>

                <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Data de Nascimento</label>
                    <input
                        type="date"
                        name="birthDate"
                        value={formData.birthDate}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary outline-none"
                        required
                    />
                </div>

                <Input label="Naturalidade" name="birthPlace" value={formData.birthPlace} onChange={handleChange} required />

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nacionalidade</label>
                    <select
                        name="nationality"
                        value={formData.nationality}
                        onChange={handleChange}
                        className="w-full h-11 px-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all"
                        required
                    >
                        <option value="">Selecione...</option>
                        {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Gênero</label>
                    <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="w-full h-11 px-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all"
                        required
                    >
                        <option value="">Selecione...</option>
                        <option value="Masculino">Masculino</option>
                        <option value="Feminino">Feminino</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Estado Civil</label>
                    <select
                        name="maritalStatus"
                        value={formData.maritalStatus}
                        onChange={handleChange}
                        className="w-full h-11 px-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all"
                        required
                    >
                        <option value="">Selecione...</option>
                        <option value="Solteiro(a)">Solteiro(a)</option>
                        <option value="Casado(a)">Casado(a)</option>
                        <option value="Divorciado(a)">Divorciado(a)</option>
                        <option value="Viúvo(a)">Viúvo(a)</option>
                    </select>
                </div>

                <Input label="Ocupação Actual" name="occupation" value={formData.occupation} onChange={handleChange} />

                <div className="grid grid-cols-2 gap-4 md:col-span-2">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tipo de Documento</label>
                        <select
                            name="documentType"
                            value={formData.documentType}
                            onChange={handleChange}
                            className="w-full h-11 px-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all"
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
                        className="w-full h-11 px-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all"
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
