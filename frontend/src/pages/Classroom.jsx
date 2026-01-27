import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { PlayCircle, FileText, CheckCircle, Lock } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';

export default function Classroom() {
    const { classId } = useParams();

    // Fetch class details + course + modules + lessons
    const { data: academicClass, isLoading } = useQuery({
        queryKey: ['class', classId],
        queryFn: async () => {
            // Check if backend supports this deep nesting or if we need multiple calls
            // Based on AcademicClassController::show we load ['course', 'enrollments.user', 'attendances']
            // We probably need to fetch the Course with modules separately or update the Class controller.
            // Let's rely on fetching the course details using the course_id from the class.

            const classRes = await api.get(`/classes/${classId}`);
            const courseId = classRes.data.course_id;

            const courseRes = await api.get(`/courses/${courseId}`);
            return { ...classRes.data, course: courseRes.data };
        }
    });

    if (isLoading) return <div className="p-8 text-center">Loading classroom...</div>;

    const { course } = academicClass;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
            {/* Header */}
            <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between shadow-sm z-10">
                <div>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">{course.title}</h1>
                    <p className="text-sm text-gray-500">{academicClass.name}</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="hidden md:block w-48 bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '15%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">15% Complete</span>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar (Modules) */}
                <aside className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto hidden md:block">
                    <div className="p-4">
                        <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Course Content</h2>
                        <div className="space-y-4">
                            {course.modules?.map((module, i) => (
                                <div key={module.id} className="space-y-2">
                                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider px-2">
                                        Module {i + 1}: {module.title}
                                    </h3>
                                    <div className="space-y-1">
                                        {module.lessons?.map((lesson) => (
                                            <button
                                                key={lesson.id}
                                                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-left rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
                                            >
                                                {lesson.type === 'video' ? <PlayCircle size={16} /> : <FileText size={16} />}
                                                <span className="flex-1 truncate">{lesson.title}</span>
                                                {/* <CheckCircle size={14} className="text-green-500" /> */}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Main Content (Video/Text) */}
                <main className="flex-1 overflow-y-auto p-6 md:p-8">
                    <div className="max-w-4xl mx-auto space-y-6">
                        <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-2xl relative group">
                            {/* Placeholder Video Player */}
                            <div className="absolute inset-0 flex items-center justify-center text-white/50">
                                <PlayCircle size={64} className="group-hover:text-white transition-colors cursor-pointer" />
                            </div>
                            <img
                                src="https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=1000"
                                alt="Lesson Thumbnail"
                                className="w-full h-full object-cover opacity-50"
                            />
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Introduction to the Course</h2>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                Welcome to this course. In this lesson, we will cover the basics and what you can expect to learn over the next few weeks.
                                Please ensure you have all the necessary software installed.
                            </p>
                        </div>

                        <div className="flex justify-between pt-8 border-t border-gray-100 dark:border-gray-700">
                            <Button variant="outline" className="w-auto">Previous Lesson</Button>
                            <Button className="w-auto">Mark as Complete & Next</Button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
