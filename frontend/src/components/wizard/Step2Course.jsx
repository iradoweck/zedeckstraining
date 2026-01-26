import { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';

export default function Step2Course({ formData, updateFormData, onNext, onBack }) {
    // Fetch courses from API
    const { data: availableCourses, isLoading } = useQuery({
        queryKey: ['public-courses'],
        queryFn: async () => {
            const res = await api.get('/courses');
            return res.data; // Assuming API returns { data: [...] } or array
        }
    });

    const handleCourseSelect = (courseId) => {
        let newCourses = [...formData.courses];
        if (newCourses.includes(courseId)) {
            newCourses = newCourses.filter(id => id !== courseId);
        } else {
            if (newCourses.length < 2) {
                newCourses.push(courseId);
            }
        }
        updateFormData({ courses: newCourses });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onNext();
    };

    // Helper to check if English II/III is selected
    const isEnglishSelected = availableCourses?.some(c =>
        formData.courses.includes(c.id) && (c.title.includes('Inglês II') || c.title.includes('Inglês III'))
    );

    // Helper to check if Programming - though API driven, we infer by Title or assume specific ID
    const isProgrammingSelected = availableCourses?.some(c =>
        formData.courses.includes(c.id) && c.title.toLowerCase().includes('programação')
    );

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <h2 className="text-2xl font-bold font-heading">Escolha seu Curso</h2>

            {isLoading ? (
                <div>Loading courses...</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {availableCourses?.map(course => (
                        <div
                            key={course.id}
                            onClick={() => handleCourseSelect(course.id)}
                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.courses.includes(course.id)
                                    ? 'border-primary bg-primary/5'
                                    : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
                                }`}
                        >
                            <h3 className="font-bold">{course.title}</h3>
                            <p className="text-sm text-gray-500">{course.price} MT</p>
                        </div>
                    ))}
                </div>
            )}

            {formData.courses.length === 0 && (
                <p className="text-red-500 text-sm">Selecione pelo menos um curso.</p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Horário Preferencial</label>
                    <select
                        name="schedule"
                        value={formData.schedule}
                        onChange={(e) => updateFormData({ schedule: e.target.value })}
                        className="w-full h-11 px-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                        required
                    >
                        <option value="">Selecione...</option>
                        <option value="Manhã (08:00 - 10:00)">Manhã (08:00 - 10:00)</option>
                        <option value="Manhã (10:00 - 12:00)">Manhã (10:00 - 12:00)</option>
                        <option value="Tarde (14:00 - 16:00)">Tarde (14:00 - 16:00)</option>
                        <option value="Pos-Laboral (17:30 - 19:30)">Pós-Laboral (17:30 - 19:30)</option>
                    </select>
                </div>
            </div>

            {/* Conditional Fields */}
            {isEnglishSelected && (
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-700">
                    <h4 className="font-bold text-yellow-800 dark:text-yellow-200 mb-2">Opção de Exame (Inglês)</h4>
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2">
                            <input type="radio" name="examModality" value="Cambridge" checked={formData.examModality === 'Cambridge'} onChange={(e) => updateFormData({ examModality: e.target.value })} />
                            <span>Cambridge</span>
                        </label>
                        <label className="flex items-center gap-2">
                            <input type="radio" name="examModality" value="TOEFL" checked={formData.examModality === 'TOEFL'} onChange={(e) => updateFormData({ examModality: e.target.value })} />
                            <span>TOEFL</span>
                        </label>
                        <label className="flex items-center gap-2">
                            <input type="radio" name="examModality" value="Normal" checked={formData.examModality === 'Normal'} onChange={(e) => updateFormData({ examModality: e.target.value })} />
                            <span>Normal (Interno)</span>
                        </label>
                    </div>
                </div>
            )}

            {isProgrammingSelected && (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                    <h4 className="font-bold text-blue-800 dark:text-blue-200 mb-2">Foco da Programação</h4>
                    <select
                        name="programmingType"
                        value={formData.programmingType}
                        onChange={(e) => updateFormData({ programmingType: e.target.value })}
                        className="w-full h-11 px-4 rounded-lg border border-blue-200 dark:border-gray-600"
                    >
                        <option value="">Selecione...</option>
                        <option value="Web Development">Web Development (Fullstack)</option>
                        <option value="Mobile Development">Mobile Apps</option>
                        <option value="Software Engineering">Software Engineering (Java/C#)</option>
                    </select>
                </div>
            )}

            <div className="flex justify-between pt-4">
                <Button type="button" variant="outline" onClick={onBack} className="flex items-center gap-2">
                    <ArrowLeft size={18} /> Voltar
                </Button>
                <Button type="submit" disabled={formData.courses.length === 0} className="flex items-center gap-2">
                    Próximo <ArrowRight size={18} />
                </Button>
            </div>
        </form>
    );
}
