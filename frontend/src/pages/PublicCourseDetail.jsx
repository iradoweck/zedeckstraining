import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import PublicLayout from '../components/layout/PublicLayout';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { useAuth } from '../context/AuthContext'; // To check if user is logged in
import api from '../services/api';
import { PlayCircle, FileText, Lock, CheckCircle2 } from 'lucide-react';

export default function PublicCourseDetail() {
    const { courseId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    const { data: course, isLoading } = useQuery({
        queryKey: ['public-course', courseId],
        queryFn: async () => {
            const res = await api.get(`/courses/${courseId}`);
            return res.data;
        }
    });

    const handleEnroll = () => {
        if (!user) {
            navigate('/login', { state: { from: `/courses/${courseId}` } });
            return;
        }

        // For now, straightforward enrollment or redirect to payment
        alert("Enrollment logic would go here (e.g., payment gateway). For prototype, assume enrolled via Instructor or Admin.");
    };

    if (isLoading) return <PublicLayout><div className="p-20 text-center">Loading course details...</div></PublicLayout>;
    if (!course) return <PublicLayout><div className="p-20 text-center">Course not found.</div></PublicLayout>;

    return (
        <PublicLayout>
            {/* Header / Hero */}
            <div className="bg-gray-900 text-white py-16 md:py-24">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="md:col-span-2 space-y-6">
                        <h1 className="text-4xl md:text-5xl font-bold font-heading">{course.title}</h1>
                        <p className="text-xl text-gray-300 leading-relaxed max-w-2xl">
                            {course.description || "Unlock your potential with this comprehensive course designed for all skill levels."}
                        </p>
                        <div className="flex items-center gap-4 pt-4">
                            <div className="flex items-center gap-2 text-sm font-medium">
                                {course.trainer?.profile_photo ? (
                                    <img src={course.trainer.profile_photo} alt={course.trainer.name} className="w-10 h-10 rounded-full border-2 border-primary" />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-bold">
                                        {course.trainer?.name?.charAt(0)}
                                    </div>
                                )}
                                <span>Created by <span className="text-primary">{course.trainer?.name || "Instructor"}</span></span>
                            </div>
                            <span className="text-gray-500">•</span>
                            <div className="flex items-center gap-1 text-yellow-400">
                                <span>★★★★★</span>
                                <span className="text-gray-400 text-sm ml-1">(4.8 ratings)</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-12 -mt-20">
                {/* Main Content: Curriculum */}
                <div className="md:col-span-2 space-y-12">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
                        <h2 className="text-2xl font-bold mb-6">What you'll learn</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {['Master the core concepts', 'Build real-world projects', 'Get certified', 'Access community'].map((item, i) => (
                                <div key={i} className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                                    <CheckCircle2 size={18} className="text-green-500 shrink-0" />
                                    <span>{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold mb-6">Course Content</h2>
                        <div className="space-y-4">
                            {course.modules?.map((module, index) => (
                                <div key={module.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                                    <div className="bg-gray-50 dark:bg-gray-800 px-6 py-4 font-medium flex justify-between items-center">
                                        <span>Module {index + 1}: {module.title}</span>
                                        <span className="text-sm text-gray-500">{module.lessons?.length || 0} lessons</span>
                                    </div>
                                    <div className="divide-y divide-gray-100 dark:divide-gray-700">
                                        {module.lessons?.map(lesson => (
                                            <div key={lesson.id} className="group flex items-center justify-between px-6 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                                <div className="flex items-center gap-3 text-sm">
                                                    {lesson.type === 'video' ? <PlayCircle size={16} className="text-gray-400" /> : <FileText size={16} className="text-gray-400" />}
                                                    <span className="group-hover:text-primary transition-colors">{lesson.title}</span>
                                                </div>
                                                {lesson.is_preview ? (
                                                    <span className="text-xs text-primary font-medium">Preview</span>
                                                ) : (
                                                    <Lock size={14} className="text-gray-300" />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            {!course.modules?.length && <p className="text-gray-500 italic">Curriculum is being updated.</p>}
                        </div>
                    </div>
                </div>

                {/* Sidebar: Pricing & Enroll */}
                <div className="md:col-span-1">
                    <div className="sticky top-24">
                        <Card className="p-6 shadow-xl border-t-4 border-t-primary">
                            <div className="mb-6">
                                <span className="text-4xl font-bold text-gray-900 dark:text-white">${course.price}</span>
                            </div>

                            <Button className="w-full h-12 text-base mb-4" onClick={handleEnroll}>
                                Enroll Now
                            </Button>

                            <p className="text-center text-sm text-gray-500 mb-6">30-Day Money-Back Guarantee</p>

                            <div className="space-y-4">
                                <h4 className="font-bold text-sm text-gray-900 dark:text-white">This course includes:</h4>
                                <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                                    <li className="flex items-center gap-3"><PlayCircle size={16} /> {course.modules?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) || 0} Lessons</li>
                                    <li className="flex items-center gap-3"><FileText size={16} /> Full lifetime access</li>
                                    <li className="flex items-center gap-3"><Lock size={16} /> Access on mobile and TV</li>
                                    <li className="flex items-center gap-3"><Award size={16} /> Certificate of completion</li>
                                </ul>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
