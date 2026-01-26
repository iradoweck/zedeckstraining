import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';

export function ClassModal({ isOpen, onClose, classToEdit = null, courses = [] }) {
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState({
        name: '',
        course_id: '',
        start_date: '',
        end_date: '',
        format: 'online',
        location: ''
    });

    useEffect(() => {
        if (classToEdit) {
            setFormData({
                name: classToEdit.name,
                course_id: classToEdit.course_id,
                start_date: classToEdit.start_date,
                end_date: classToEdit.end_date,
                format: classToEdit.format,
                location: classToEdit.location || ''
            });
        } else {
            setFormData({
                name: '',
                course_id: '',
                start_date: '',
                end_date: '',
                format: 'online',
                location: ''
            });
        }
    }, [classToEdit, isOpen]);

    const mutation = useMutation({
        mutationFn: async (data) => {
            if (classToEdit) {
                return await api.put(`/classes/${classToEdit.id}`, data);
            } else {
                return await api.post('/classes', data);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['trainer-classes']);
            onClose();
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        mutation.mutate(formData);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={classToEdit ? 'Edit Class' : 'Create New Class'}
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label="Class Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                />

                <Select
                    label="Course"
                    value={formData.course_id}
                    onChange={(e) => setFormData({ ...formData, course_id: e.target.value })}
                    options={courses.map(c => ({ value: c.id, label: c.title }))}
                    required
                />

                <div className="grid grid-cols-2 gap-4">
                    <Input
                        type="date"
                        label="Start Date"
                        value={formData.start_date}
                        onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                        required
                    />
                    <Input
                        type="date"
                        label="End Date"
                        value={formData.end_date}
                        onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                        required
                    />
                </div>

                <Select
                    label="Format"
                    value={formData.format}
                    onChange={(e) => setFormData({ ...formData, format: e.target.value })}
                    options={[
                        { value: 'online', label: 'Online' },
                        { value: 'in-person', label: 'In Person' }
                    ]}
                    required
                />

                {formData.format === 'in-person' && (
                    <Input
                        label="Location"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    />
                )}

                <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={mutation.isPending}>
                        {mutation.isPending ? 'Saving...' : (classToEdit ? 'Update Class' : 'Create Class')}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
