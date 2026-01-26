import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import api from '../services/api';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

export default function ClassManagement() {
    const { classId } = useParams();
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState('attendance'); // attendance | grades

    // Fetch Class Details (including enrollments)
    const { data: academicClass, isLoading } = useQuery({
        queryKey: ['class-manage', classId],
        queryFn: async () => {
            const res = await api.get(`/classes/${classId}`);
            return res.data;
        }
    });

    if (isLoading) return <div className="p-8 text-center">Loading class data...</div>;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 md:p-8">
            <header className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{academicClass.name}</h1>
                <p className="text-gray-500">{academicClass.course?.title} • {academicClass.format}</p>
            </header>

            <div className="flex gap-4 mb-6">
                <button
                    onClick={() => setActiveTab('attendance')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'attendance' ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                >
                    Attendance
                </button>
                <button
                    onClick={() => setActiveTab('grades')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'grades' ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                >
                    Grades
                </button>
            </div>

            {activeTab === 'attendance' && <AttendanceView classId={classId} students={academicClass.enrollments} />}
            {activeTab === 'grades' && <GradesView classId={classId} students={academicClass.enrollments} />}
        </div>
    );
}

function AttendanceView({ classId, students }) {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const queryClient = useQueryClient();
    const [statusMap, setStatusMap] = useState({});

    const mutation = useMutation({
        mutationFn: async (data) => {
            return await api.post('/attendance', data);
        },
        onSuccess: () => {
            alert('Attendance saved!');
            queryClient.invalidateQueries(['attendance', classId, date]);
        }
    });

    const handleSave = () => {
        const attendances = students.map(enrollment => ({
            user_id: enrollment.user_id,
            status: statusMap[enrollment.user_id] || 'present' // Default to present
        }));

        mutation.mutate({
            class_id: classId,
            date,
            attendances
        });
    };

    return (
        <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold">Daily Attendance</h2>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="border rounded-md px-3 py-2 text-sm bg-transparent"
                />
            </div>

            <table className="w-full text-left">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                    <tr>
                        <th className="px-4 py-3 rounded-l-lg">Student</th>
                        <th className="px-4 py-3 rounded-r-lg text-center">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {students?.map((enrollment) => (
                        <tr key={enrollment.id}>
                            <td className="px-4 py-3 font-medium">{enrollment.user.name}</td>
                            <td className="px-4 py-3 flex justify-center gap-2">
                                <button
                                    onClick={() => setStatusMap(prev => ({ ...prev, [enrollment.user_id]: 'present' }))}
                                    className={`p-2 rounded-full transition-colors ${statusMap[enrollment.user_id] === 'present' || !statusMap[enrollment.user_id] ? 'bg-green-100 text-green-600' : 'text-gray-400'}`}
                                >
                                    <CheckCircle size={20} />
                                </button>
                                <button
                                    onClick={() => setStatusMap(prev => ({ ...prev, [enrollment.user_id]: 'absent' }))}
                                    className={`p-2 rounded-full transition-colors ${statusMap[enrollment.user_id] === 'absent' ? 'bg-red-100 text-red-600' : 'text-gray-400'}`}
                                >
                                    <XCircle size={20} />
                                </button>
                                <button
                                    onClick={() => setStatusMap(prev => ({ ...prev, [enrollment.user_id]: 'excused' }))}
                                    className={`p-2 rounded-full transition-colors ${statusMap[enrollment.user_id] === 'excused' ? 'bg-yellow-100 text-yellow-600' : 'text-gray-400'}`}
                                >
                                    <Clock size={20} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="mt-6 flex justify-end">
                <Button onClick={handleSave} className="w-auto px-8" disabled={mutation.isPending}>
                    {mutation.isPending ? 'Saving...' : 'Save Attendance'}
                </Button>
            </div>
        </Card>
    );
}

function GradesView({ classId, students }) {
    // Simplified for demo: Just one assignment entry
    const [assignment, setAssignment] = useState('Final Exam');
    const [scores, setScores] = useState({});

    const mutation = useMutation({
        mutationFn: async ({ enrollment_id, score }) => {
            return await api.post('/grades', {
                enrollment_id,
                assignment_name: assignment,
                score,
                feedback: 'Good job!'
            });
        },
        onSuccess: () => alert('Grade saved!')
    });

    return (
        <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold">Gradebook</h2>
                <Input
                    value={assignment}
                    onChange={(e) => setAssignment(e.target.value)}
                    placeholder="Assignment Name"
                    className="w-64"
                />
            </div>

            <div className="space-y-4">
                {students?.map((enrollment) => (
                    <div key={enrollment.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                            <p className="font-medium">{enrollment.user.name}</p>
                            <p className="text-xs text-gray-500">{enrollment.user.email}</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <Input
                                type="number"
                                min="0"
                                max="100"
                                placeholder="Score"
                                className="w-24 text-center"
                                value={scores[enrollment.id] || ''}
                                onChange={(e) => setScores(prev => ({ ...prev, [enrollment.id]: e.target.value }))}
                            />
                            <Button
                                className="w-auto px-4 py-2 text-xs"
                                onClick={() => mutation.mutate({ enrollment_id: enrollment.id, score: scores[enrollment.id] })}
                            >
                                Save
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
}
