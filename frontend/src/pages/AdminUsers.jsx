import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AdminLayout from '../components/layout/AdminLayout';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { Select } from '../components/ui/Select';
import { Search, Plus, Edit2, Trash2, User } from 'lucide-react';
import api from '../services/api';

export default function AdminUsers() {
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    const queryClient = useQueryClient();

    // Fetch Users
    const { data: users, isLoading } = useQuery({
        queryKey: ['admin-users'],
        queryFn: async () => {
            // In a real app we would have pagination and filtering on backend
            // For now assuming we have an endpoint or we just filter client side if endpoint is simple
            // We need an endpoint like /users that admin can access.
            // Usually /users is not exposed publically. Let's assume we need to create it or stick to mocked for now if backend missing.
            // We defined in plan: Gestão de Usuários.
            // Let's assume GET /users exists for admin, or we might need to create it in backend next step.
            const res = await api.get('/users');
            return res.data;
        }
    });

    // Create User Mutation
    const createMutation = useMutation({
        mutationFn: (newUser) => api.post('/auth/register', newUser), // Admin creating user is like register
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-users']);
            setIsModalOpen(false);
        }
    });

    // Update User Mutation
    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => api.put(`/users/${id}`, data),
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-users']);
            setIsModalOpen(false);
            setEditingUser(null);
        }
    });

    // Delete User Mutation
    const deleteMutation = useMutation({
        mutationFn: (id) => api.delete(`/users/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-users']);
        }
    });

    const handleCreate = (data) => {
        // We need to adapt data for register endpoint
        createMutation.mutate({ ...data, password_confirmation: data.password });
    };

    const handleUpdate = (data) => {
        updateMutation.mutate({ id: editingUser.id, data });
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this user?')) {
            deleteMutation.mutate(id);
        }
    };

    const filteredUsers = users?.filter(u =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AdminLayout>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold font-heading text-gray-900 dark:text-white">User Management</h1>
                    <p className="text-gray-500">Manage students, trainers, and administrators.</p>
                </div>
                <Button onClick={() => { setEditingUser(null); setIsModalOpen(true); }}>
                    <Plus size={20} className="mr-2" />
                    Add User
                </Button>
            </div>

            <Card className="p-4 mb-6">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800"
                    />
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
            </Card>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 border-b border-gray-200 dark:border-gray-700">
                            <tr>
                                <th className="px-6 py-4 font-medium">User</th>
                                <th className="px-6 py-4 font-medium">Role</th>
                                <th className="px-6 py-4 font-medium">Joined</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {isLoading ? (
                                <tr><td colSpan="4" className="px-6 py-4 text-center">Loading...</td></tr>
                            ) : filteredUsers?.length === 0 ? (
                                <tr><td colSpan="4" className="px-6 py-4 text-center">No users found</td></tr>
                            ) : filteredUsers?.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                                                {user.profile_photo ? <img src={user.profile_photo} alt="" className="w-full h-full rounded-full" /> : <User size={20} />}
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900 dark:text-white">{user.name}</div>
                                                <div className="text-gray-500 text-xs">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={clsx(
                                            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize",
                                            user.role === 'admin' ? "bg-purple-100 text-purple-800" :
                                                user.role === 'trainer' ? "bg-blue-100 text-blue-800" :
                                                    "bg-green-100 text-green-800"
                                        )}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">
                                        {new Date(user.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => { setEditingUser(user); setIsModalOpen(true); }}
                                                className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user.id)}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <UserModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                user={editingUser}
                onSubmit={editingUser ? handleUpdate : handleCreate}
            />
        </AdminLayout>
    );
}

function UserModal({ isOpen, onClose, user, onSubmit }) {
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        password: '',
        role: user?.role || 'student'
    });

    const isEdit = !!user;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? "Edit User" : "Add New User"}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label="Full Name"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    required
                />
                <Input
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    required
                />
                {!isEdit && (
                    <Input
                        label="Password"
                        type="password"
                        value={formData.password}
                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                        required
                    />
                )}

                <Select
                    label="Role"
                    value={formData.role}
                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                    options={[
                        { value: 'student', label: 'Student' },
                        { value: 'trainer', label: 'Trainer' },
                        { value: 'admin', label: 'Admin' }
                    ]}
                />

                <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                    <Button type="submit">{isEdit ? 'Update User' : 'Create User'}</Button>
                </div>
            </form>
        </Modal>
    );
}
