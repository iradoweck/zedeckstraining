import { useState, useMemo } from 'react';
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
            return res.data;
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

    // Calculate Dynamic Options based on selected courses
    const selectedCourseObjects = useMemo(() => {
        if (!availableCourses) return [];
        return availableCourses.filter(c => formData.courses.includes(c.id));
    }, [availableCourses, formData.courses]);

    // 1. Schedules: Merge all available schedules from selected courses
    // If no specific schedules defined in DB, fallback to defaults.
    const uniqueSchedules = useMemo(() => {
        if (selectedCourseObjects.length === 0) return [];
        const allSchedules = selectedCourseObjects.flatMap(c => c.schedules || []);
        if (allSchedules.length === 0) return ["Manhã (08:00 - 10:00)", "Manhã (10:00 - 12:00)", "Tarde (14:00 - 16:00)", "Pós-Laboral (17:30 - 19:30)"];
        return [...new Set(allSchedules)];
    }, [selectedCourseObjects]);

    // 2. Conditional Fields
    const languageCourse = selectedCourseObjects.find(c => c.options?.type === 'language');
    const programmingCourse = selectedCourseObjects.find(c => c.options?.type === 'programming');

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
                            <p className="text-sm text-gray-500">
                                {Number(course.price).toLocaleString('pt-MZ', { minimumFractionDigits: 2 })} MT
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {formData.courses.length === 0 && (
                <p className="text-red-500 text-sm">Selecione pelo menos um curso.</p>
            )}

            {formData.courses.length > 0 && uniqueSchedules.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-bottom-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Horário Preferencial</label>
                        <select
                            name="schedule"
                            value={formData.schedule}
                            onChange={(e) => updateFormData({ schedule: e.target.value })}
                            className="w-full h-11 px-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all"
                            required
                        >
                            <option value="">Selecione...</option>
                            {uniqueSchedules.map(sch => (
                                <option key={sch} value={sch}>{sch}</option>
                            ))}
                        </select>
                    </div>

                    {/* Language Options */}
                    {languageCourse && languageCourse.options?.exams && (
                        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-700">
                            <h4 className="font-bold text-yellow-800 dark:text-yellow-200 mb-2">Opção de Exame ({languageCourse.title})</h4>
                            <div className="flex flex-col sm:flex-row gap-4">
                                {languageCourse.options.exams.map(exam => (
                                    <label key={exam} className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="examModality"
                                            value={exam}
                                            checked={formData.examModality === exam}
                                            onChange={(e) => updateFormData({ examModality: e.target.value })}
                                            className="text-yellow-600 focus:ring-yellow-500"
                                        />
                                        <span className="text-gray-900 dark:text-gray-100">{exam}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Programming Options */}
                    {programmingCourse && programmingCourse.options?.stacks && (
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                            <h4 className="font-bold text-blue-800 dark:text-blue-200 mb-2">Foco da Programação</h4>
                            <select
                                name="programmingType"
                                value={formData.programmingType}
                                onChange={(e) => updateFormData({ programmingType: e.target.value })}
                                className="w-full h-11 px-4 rounded-lg border border-blue-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            >
                                <option value="">Selecione...</option>
                                {programmingCourse.options.stacks.map(stack => (
                                    <option key={stack} value={stack}>{stack}</option>
                                ))}
                            </select>
                        </div>
                    )}
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
