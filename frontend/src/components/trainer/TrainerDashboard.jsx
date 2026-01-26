import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import { Card } from '../ui/Card';
import { Users, GraduationCap, Calendar, Edit2, Trash2, Plus } from 'lucide-react';
import { Button } from '../ui/Button';
import { Link } from 'react-router-dom';
import { ClassModal } from './ClassModal';

export default function TrainerDashboard({ user }) {
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedClass, setSelectedClass] = useState(null);

    // Fetch Classes
    const { data: classes, isLoading: isLoadingClasses } = useQuery({
        queryKey: ['trainer-classes'],
        queryFn: async () => {
            const res = await api.get('/classes');
            return res.data;
        }
    });

    // Fetch Courses (for dropdown)
    const { data: courses } = useQuery({
        queryKey: ['courses-list'],
        queryFn: async () => {
            const res = await api.get('/courses');
            return res.data;
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            await api.delete(`/classes/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['trainer-classes']);
        }
    });

    const handleEdit = (cls) => {
        setSelectedClass(cls);
        setIsModalOpen(true);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this class? This action cannot be undone.')) {
            deleteMutation.mutate(id);
        }
    };

    const handleCreate = () => {
        setSelectedClass(null);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Instructor Dashboard</h2>
                    <p className="text-gray-500">Manage your classes and students</p>
                </div>
                <div>
                    <Button onClick={handleCreate} className="w-auto px-6 flex items-center gap-2">
                        <Plus size={20} />
                        Create New Class
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                            <GraduationCap size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Active Classes</p>
                            <h3 className="text-2xl font-bold">{classes?.length || 0}</h3>
                        </div>
                    </div>
                </Card>
                <Card className="p-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                            <Users size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total Students</p>
                            <h3 className="text-2xl font-bold">--</h3>
                        </div>
                    </div>
                </Card>
                <Card className="p-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                            <Calendar size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Upcoming Sessions</p>
                            <h3 className="text-2xl font-bold">--</h3>
                        </div>
                    </div>
                </Card>
            </div>

            <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Your Classes</h3>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-200">Class Name</th>
                                <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-200">Course</th>
                                <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-200">Format</th>
                                <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-200">Status</th>
                                <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-200 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {isLoadingClasses ? (
                                <tr><td colSpan="5" className="p-6 text-center">Loading...</td></tr>
                            ) : classes?.length === 0 ? (
                                <tr><td colSpan="5" className="p-6 text-center text-gray-500">No classes found. Create one to get started.</td></tr>
                            ) : classes?.map((cls) => (
                                <tr key={cls.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{cls.name}</td>
                                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{cls.course?.title}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${cls.format === 'online' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                                            }`}>
                                            {cls.format}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="flex items-center gap-1.5 text-green-600 text-xs font-medium">
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
                                            Active
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                to={`/manage-class/${cls.id}`}
                                                className="p-2 text-gray-500 hover:text-primary transition-colors"
                                                title="Manage Class"
                                            >
                                                <Users size={18} />
                                            </Link>
                                            <button
                                                onClick={() => handleEdit(cls)}
                                                className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                                                title="Edit Class"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(cls.id)}
                                                className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                                                title="Delete Class"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <ClassModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                classToEdit={selectedClass}
                courses={courses || []}
            />
        </div>
    );
}
