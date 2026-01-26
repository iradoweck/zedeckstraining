import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AdminLayout from '../components/layout/AdminLayout';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Search, Eye, CheckCircle, XCircle, BookOpen } from 'lucide-react';
import api from '../services/api';

export default function AdminCourses() {
    const [search, setSearch] = useState('');
    const queryClient = useQueryClient();

    // Fetch Courses (Using correct public endpoint or specific admin one if exists)
    // For now we use the public GET /courses but maybe we need all courses including unpublished
    // Ideally GET /admin/courses
    // Lets stick to /courses for MVP, assuming it returns published. 
    // If we need unpublished, we need new endpoint. 
    // Let's assume for now we list what we have and maybe we can toggle publish status.
    const { data: courses, isLoading } = useQuery({
        queryKey: ['admin-courses'],
        queryFn: async () => {
            const res = await api.get('/courses');
            return res.data;
        }
    });

    const togglePublishMutation = useMutation({
        mutationFn: ({ id, is_published }) => api.put(`/courses/${id}`, { is_published }),
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-courses']);
        }
    });

    const handleTogglePublish = (course) => {
        // Toggle logic
        togglePublishMutation.mutate({
            id: course.id,
            is_published: !course.is_published
        });
    };

    const filteredCourses = courses?.filter(c =>
        c.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AdminLayout>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold font-heading text-gray-900 dark:text-white">Course Management</h1>
                    <p className="text-gray-500">Oversee all courses and their publication status.</p>
                </div>
                {/* Maybe Add Course button triggers trainer flow or admin override */}
            </div>

            <Card className="p-4 mb-6">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search courses..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800"
                    />
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                    <div className="col-span-full py-12 text-center text-gray-500">Loading courses...</div>
                ) : filteredCourses?.length === 0 ? (
                    <div className="col-span-full py-12 text-center text-gray-500">No courses found</div>
                ) : filteredCourses?.map((course) => (
                    <Card key={course.id} className="flex flex-col overflow-hidden group hover:shadow-lg transition-shadow">
                        <div className="h-40 bg-gray-100 dark:bg-gray-800 relative">
                            {course.cover_image ? (
                                <img src={course.cover_image} alt={course.title} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                    <BookOpen size={40} />
                                </div>
                            )}
                            <div className="absolute top-2 right-2 flex gap-1">
                                <span className={`px-2 py-1 rounded text-xs font-bold ${course.is_published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                    {course.is_published ? 'Published' : 'Draft'}
                                </span>
                            </div>
                        </div>
                        <div className="p-5 flex-1 flex flex-col">
                            <h3 className="font-bold text-lg mb-2 line-clamp-1">{course.title}</h3>
                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                                <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold">
                                    {course.trainer?.name?.charAt(0)}
                                </div>
                                <span>{course.trainer?.name}</span>
                            </div>

                            <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                                <div className="font-bold text-lg">${course.price}</div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleTogglePublish(course)}
                                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500"
                                        title={course.is_published ? "Unpublish" : "Publish"}
                                    >
                                        {course.is_published ? <XCircle size={20} className="text-red-500" /> : <CheckCircle size={20} className="text-green-500" />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </AdminLayout>
    );
}
