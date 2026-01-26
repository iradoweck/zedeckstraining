import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import { Card } from '../ui/Card';
import { BookOpen, Calendar, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function StudentDashboard({ user }) {
    const { data: classes, isLoading } = useQuery({
        queryKey: ['my-classes'],
        queryFn: async () => {
            const res = await api.get('/classes');
            return res.data;
        }
    });

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 border-none text-white">
                    <h3 className="text-blue-100 text-sm font-medium mb-1">Enrolled Courses</h3>
                    <p className="text-3xl font-bold">{classes?.length || 0}</p>
                </Card>
                <Card className="p-6">
                    <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Assignments Pending</h3>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">0</p>
                </Card>
                <Card className="p-6">
                    <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Attendance Rate</h3>
                    <p className="text-3xl font-bold text-green-600">100%</p>
                </Card>
            </div>

            <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">My Active Classes</h2>

                {isLoading ? (
                    <p>Loading classes...</p>
                ) : classes?.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {classes.map((cls) => (
                            <Card key={cls.id} className="flex flex-col h-full hover:shadow-2xl transition-shadow">
                                <div className="h-32 bg-gray-100 dark:bg-gray-700 w-full relative">
                                    {/* Placeholder for course image */}
                                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                        <BookOpen size={40} />
                                    </div>
                                    <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur px-2 py-1 rounded text-xs font-bold uppercase tracking-wider text-primary">
                                        {cls.format}
                                    </div>
                                </div>
                                <div className="p-6 flex-1 flex flex-col">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{cls.course.title}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{cls.name}</p>

                                    <div className="mt-auto space-y-2">
                                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                            <Calendar size={16} />
                                            <span>Starts: {new Date(cls.start_date).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                            <Clock size={16} />
                                            <span>Active</span>
                                        </div>
                                    </div>

                                    <Link
                                        to={`/classroom/${cls.id}`}
                                        className="mt-4 block w-full py-2 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-primary font-medium rounded-lg transition-colors text-sm text-center"
                                    >
                                        Access Classroom
                                    </Link>
                                </div>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card className="p-8 text-center">
                        <p className="text-gray-500">You are not enrolled in any classes yet.</p>
                        <button className="mt-4 text-primary font-medium hover:underline">
                            Browse Available Courses
                        </button>
                    </Card>
                )}
            </div>
        </div>
    );
}
