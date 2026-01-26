import { Link } from 'react-router-dom';
import PublicLayout from '../components/layout/PublicLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Search } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

export default function PublicCourses() {
    const { data: courses, isLoading } = useQuery({
        queryKey: ['public-courses'],
        queryFn: async () => {
            const res = await api.get('/courses');
            return res.data;
        }
    });

    return (
        <PublicLayout>
            <div className="bg-gray-50 dark:bg-gray-900 py-12 md:py-20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h1 className="text-4xl font-bold mb-4 font-heading text-gray-900 dark:text-white">Explore Courses</h1>
                        <p className="text-gray-500">Discover our range of courses designed to help you master new skills and advance your career.</p>

                        <div className="mt-8 relative max-w-md mx-auto">
                            <input
                                type="text"
                                placeholder="Search courses..."
                                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm focus:ring-2 focus:ring-primary outline-none dark:bg-gray-800"
                            />
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="text-center py-20 text-gray-500">Loading courses...</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {courses?.map(course => (
                                <CourseCard key={course.id} course={course} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </PublicLayout>
    );
}

function CourseCard({ course }) {
    return (
        <Card className="flex flex-col h-full hover:-translate-y-1 transition-transform duration-300">
            <div className="h-48 bg-gray-200 dark:bg-gray-800 rounded-t-xl relative overflow-hidden">
                {course.cover_image ? (
                    <img src={course.cover_image} alt={course.title} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                        {/* Placeholder generic pattern or color */}
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700"></div>
                        <span className="relative z-10 font-bold text-2xl opacity-20">{course.title.charAt(0)}</span>
                    </div>
                )}
                <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/80 backdrop-blur px-3 py-1 rounded-full text-sm font-bold text-gray-900 dark:text-white shadow-sm">
                    ${course.price}
                </div>
            </div>
            <div className="p-6 flex-1 flex flex-col">
                <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">{course.title}</h3>
                    <p className="text-gray-500 text-sm line-clamp-3">{course.description || "No description available."}</p>
                </div>

                <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {course.trainer?.profile_photo ? (
                            <img src={course.trainer.profile_photo} alt={course.trainer.name} className="w-8 h-8 rounded-full" />
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                                {course.trainer?.name?.charAt(0) || "T"}
                            </div>
                        )}
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-300">{course.trainer?.name || "Instructor"}</span>
                    </div>
                    <Link to={`/courses/${course.id}`}> {/* Using ID until slugs are widespread */}
                        <Button variant="outline" className="text-xs px-3 h-8">View Details</Button>
                    </Link>
                </div>
            </div>
        </Card>
    );
}
