import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import api from '../services/api';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { CheckCircle, XCircle, Clock, ArrowLeft, Plus, Save } from 'lucide-react';
import { Modal } from '../components/ui/Modal';

export default function ClassManagement() {
    const { classId } = useParams();
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
            <div className="mb-6">
                <Link to="/dashboard" className="inline-flex items-center text-gray-500 hover:text-primary transition-colors">
                    <ArrowLeft size={18} className="mr-2" />
                    Back to Dashboard
                </Link>
            </div>

            <header className="mb-8 flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{academicClass.name}</h1>
                    <p className="text-gray-500 mt-1">{academicClass.course?.title} • <span className="capitalize">{academicClass.format}</span></p>
                </div>
                <div className="flex gap-2">
                    {/* Actions like "Generate Report" could go here */}
                </div>
            </header>

            <div className="flex gap-4 mb-6 border-b border-gray-200 dark:border-gray-700">
                <button
                    onClick={() => setActiveTab('attendance')}
                    className={`px-4 py-3 font-medium text-sm transition-all border-b-2 ${activeTab === 'attendance' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    Attendance
                </button>
                <button
                    onClick={() => setActiveTab('grades')}
                    className={`px-4 py-3 font-medium text-sm transition-all border-b-2 ${activeTab === 'grades' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
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

    // Fetch existing attendance for this date
    const { data: existingAttendance } = useQuery({
        queryKey: ['attendance', classId, date],
        queryFn: async () => {
            const res = await api.get(`/attendance?class_id=${classId}&date=${date}`);
            return res.data;
        }
    });

    // Populate statusMap when existingAttendance updates
    useEffect(() => {
        if (existingAttendance && existingAttendance.length > 0) {
            const newMap = {};
            existingAttendance.forEach(record => {
                newMap[record.user_id] = record.status;
            });
            setStatusMap(newMap);
        } else {
            // Reset if no attendance for this date (or optional: keep previous edits?)
            // For now, reset to empty or default to 'present' if we want to be helpful
            setStatusMap({});
        }
    }, [existingAttendance, date]);


    const mutation = useMutation({
        mutationFn: async (data) => {
            return await api.post('/attendance', data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['attendance', classId, date]);
            alert('Attendance saved successfully!');
        }
    });

    const handleSave = () => {
        const attendances = students.map(enrollment => ({
            user_id: enrollment.user_id,
            status: statusMap[enrollment.user_id] || 'present' // Default to present if undefined
        }));

        mutation.mutate({
            class_id: classId,
            date,
            attendances
        });
    };

    const markAll = (status) => {
        const newMap = {};
        students.forEach(s => newMap[s.user_id] = status);
        setStatusMap(newMap);
    };

    return (
        <Card className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <div className="flex items-center gap-4">
                    <h2 className="text-lg font-bold">Daily Attendance</h2>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="text-xs h-9" onClick={() => markAll('present')}>All Present</Button>
                    <Button variant="outline" className="text-xs h-9" onClick={() => markAll('absent')}>All Absent</Button>
                </div>
            </div>

            <div className="overflow-x-auto rounded-lg border border-gray-100 dark:border-gray-700">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300">
                        <tr>
                            <th className="px-4 py-3 font-semibold text-sm">Student</th>
                            <th className="px-4 py-3 font-semibold text-sm text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {students?.map((enrollment) => {
                            const status = statusMap[enrollment.user_id];
                            return (
                                <tr key={enrollment.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                                                {enrollment.user.name.charAt(0)}
                                            </div>
                                            {enrollment.user.name}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex justify-center gap-2">
                                            <button
                                                onClick={() => setStatusMap(prev => ({ ...prev, [enrollment.user_id]: 'present' }))}
                                                className={`p-2 rounded-lg transition-all ${status === 'present' || (!status && !existingAttendance) ? 'bg-green-100 text-green-700 ring-2 ring-green-500 ring-offset-1' : 'text-gray-400 hover:bg-gray-100'}`}
                                                title="Present"
                                            >
                                                <CheckCircle size={20} />
                                            </button>
                                            <button
                                                onClick={() => setStatusMap(prev => ({ ...prev, [enrollment.user_id]: 'absent' }))}
                                                className={`p-2 rounded-lg transition-all ${status === 'absent' ? 'bg-red-100 text-red-700 ring-2 ring-red-500 ring-offset-1' : 'text-gray-400 hover:bg-gray-100'}`}
                                                title="Absent"
                                            >
                                                <XCircle size={20} />
                                            </button>
                                            <button
                                                onClick={() => setStatusMap(prev => ({ ...prev, [enrollment.user_id]: 'excused' }))}
                                                className={`p-2 rounded-lg transition-all ${status === 'excused' ? 'bg-yellow-100 text-yellow-700 ring-2 ring-yellow-500 ring-offset-1' : 'text-gray-400 hover:bg-gray-100'}`}
                                                title="Excused"
                                            >
                                                <Clock size={20} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            <div className="mt-6 flex justify-end">
                <Button onClick={handleSave} className="w-auto px-8 shadow-lg shadow-primary/20" disabled={mutation.isPending}>
                    {mutation.isPending ? 'Saving...' : 'Save Attendance'}
                </Button>
            </div>
        </Card>
    );
}

function GradesView({ classId, students }) {
    const queryClient = useQueryClient();
    const [assignments, setAssignments] = useState([]);
    const [isAddAssignmentOpen, setIsAddAssignmentOpen] = useState(false);
    const [newAssignmentName, setNewAssignmentName] = useState('');

    // Fetch all grades for the class
    const { data: gradesData, isLoading } = useQuery({
        queryKey: ['grades', classId],
        queryFn: async () => {
            const res = await api.get(`/grades?class_id=${classId}`);
            return res.data;
        }
    });

    useEffect(() => {
        if (gradesData) {
            // Extract unique assignment names
            const names = [...new Set(gradesData.map(g => g.assignment_name))];
            setAssignments(names);
        }
    }, [gradesData]);

    const mutation = useMutation({
        mutationFn: async ({ enrollment_id, score, assignment_name }) => {
            return await api.post('/grades', {
                enrollment_id,
                assignment_name,
                score,
                feedback: '' // Optional
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['grades', classId]);
        }
    });

    const handleAddAssignment = (e) => {
        e.preventDefault();
        if (newAssignmentName.trim()) {
            setAssignments([...assignments, newAssignmentName]);
            setNewAssignmentName('');
            setIsAddAssignmentOpen(false);
        }
    };

    const getGrade = (enrollmentId, assignmentName) => {
        return gradesData?.find(g => g.enrollment_id === enrollmentId && g.assignment_name === assignmentName);
    };

    const handleScoreChange = (enrollmentId, assignmentName, value) => {
        // Debouncing would be ideal here, but for now we'll update on blur or use a local state cell component
        mutation.mutate({
            enrollment_id: enrollmentId,
            assignment_name: assignmentName,
            score: value
        });
    };

    return (
        <Card className="p-0 overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50">
                <h2 className="text-lg font-bold">Gradebook</h2>
                <Button onClick={() => setIsAddAssignmentOpen(true)} className="w-auto px-4 text-xs h-9">
                    <Plus size={16} className="mr-2" /> Add Assignment
                </Button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 dark:bg-gray-700/50">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-sm border-b dark:border-gray-700 sticky left-0 bg-gray-50 dark:bg-gray-800 z-10 w-48">Student</th>
                            {assignments.map(assign => (
                                <th key={assign} className="px-6 py-4 font-semibold text-sm border-b dark:border-gray-700 min-w-[120px] text-center">
                                    {assign}
                                </th>
                            ))}
                            {assignments.length === 0 && <th className="px-6 py-4 text-sm text-gray-400 italic font-normal">No assignments yet</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {students?.map((enrollment) => (
                            <tr key={enrollment.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                <td className="px-6 py-4 font-medium sticky left-0 bg-white dark:bg-gray-900 z-10 border-r border-gray-100 dark:border-gray-700 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                                    <div className="truncate w-40" title={enrollment.user.name}>
                                        {enrollment.user.name}
                                    </div>
                                </td>
                                {assignments.map(assign => {
                                    const grade = getGrade(enrollment.id, assign);
                                    return (
                                        <td key={assign} className="px-4 py-3 text-center border-r border-gray-50 dark:border-gray-800 last:border-0">
                                            <EditableGradeCell
                                                grade={grade}
                                                onSave={(val) => handleScoreChange(enrollment.id, assign, val)}
                                            />
                                        </td>
                                    );
                                })}
                                {assignments.length === 0 && <td className="px-6 py-4"></td>}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal
                isOpen={isAddAssignmentOpen}
                onClose={() => setIsAddAssignmentOpen(false)}
                title="Add New Assignment"
            >
                <form onSubmit={handleAddAssignment} className="space-y-4">
                    <Input
                        label="Assignment Name"
                        placeholder="e.g. Midterm Exam"
                        value={newAssignmentName}
                        onChange={(e) => setNewAssignmentName(e.target.value)}
                        required
                        autoFocus
                    />
                    <div className="flex justify-end gap-2 pt-2">
                        <Button type="button" variant="outline" onClick={() => setIsAddAssignmentOpen(false)}>Cancel</Button>
                        <Button type="submit">Add Column</Button>
                    </div>
                </form>
            </Modal>
        </Card>
    );
}

function EditableGradeCell({ grade, onSave }) {
    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState(grade?.score || '');

    useEffect(() => {
        setValue(grade?.score || '');
    }, [grade]);

    const handleBlur = () => {
        setIsEditing(false);
        if (value !== (grade?.score || '') && value !== '') {
            onSave(value);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleBlur();
        }
    };

    if (isEditing) {
        return (
            <input
                type="number"
                min="0"
                max="100"
                className="w-16 text-center border rounded px-1 py-1 text-sm bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:outline-none"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                autoFocus
            />
        );
    }

    return (
        <div
            onClick={() => setIsEditing(true)}
            className={`w-16 mx-auto py-1 rounded cursor-pointer text-sm font-medium transition-colors ${grade ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200' : 'text-gray-300 hover:text-gray-400 hover:bg-gray-50 h-7 border border-dashed border-gray-200'}`}
        >
            {grade?.score ?? '-'}
        </div>
    );
}
