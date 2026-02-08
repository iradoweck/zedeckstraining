import React, { useState } from 'react';
import { CheckCircle, Plus, Circle, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import { useTranslation } from 'react-i18next';

export const TasksWidget = () => {
    const { t } = useTranslation();
    const [tasks, setTasks] = useState([
        { id: 1, textKey: "task_admin_profile", completed: false, type: 'admin' },
        { id: 2, textKey: "task_trainer_assignment", completed: false, type: 'trainer' },
        { id: 3, textKey: "task_financial_download", completed: true, type: 'user' },
    ]);
    const [newTask, setNewTask] = useState("");

    const handleAddTask = (e) => {
        e.preventDefault();
        if (!newTask.trim()) return;
        // User tasks don't have a specific textKey, they are literal text
        setTasks([...tasks, { id: Date.now(), text: newTask, completed: false, type: 'user' }]);
        setNewTask("");
    };

    const toggleTask = (id) => {
        setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    };

    const removeTask = (id) => {
        setTasks(tasks.filter(t => t.id !== id));
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 h-full flex flex-col">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 flex justify-between items-center">
                {t('my_tasks', 'Minhas Tarefas')}
                <span className="bg-blue-100 text-blue-800 text-[10px] px-2 py-0.5 rounded-full">{tasks.filter(t => !t.completed).length}</span>
            </h3>

            <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                <style>{`
                    .custom-scrollbar::-webkit-scrollbar { display: none; }
                `}</style>

                {tasks.map(task => (
                    <div key={task.id} className={`group flex flex-col gap-1 p-2 rounded-lg transition-colors ${task.completed ? 'opacity-50' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                        <div className="flex items-start gap-3 w-full">
                            <button onClick={() => toggleTask(task.id)} className="mt-0.5 text-gray-400 hover:text-blue-500 transition-colors">
                                {task.completed ? <CheckCircle className="w-5 h-5 text-green-500" /> : <Circle className="w-5 h-5" />}
                            </button>
                            <div className="flex-1">
                                <span className={`text-sm block ${task.completed ? 'line-through text-gray-400' : 'text-gray-700 dark:text-gray-200'}`}>
                                    {task.textKey ? t(task.textKey) : task.text}
                                </span>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded border ${task.type === 'admin' ? 'bg-red-50 text-red-600 border-red-100' :
                                            task.type === 'trainer' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                                                'bg-gray-50 text-gray-500 border-gray-100'
                                        }`}>
                                        {task.type === 'admin' ? t('source_admin', 'Admin') :
                                            task.type === 'trainer' ? t('source_trainer', 'Formador') :
                                                t('source_student', 'Eu')}
                                    </span>
                                </div>
                            </div>
                            {task.type === 'user' && (
                                <button onClick={() => removeTask(task.id)} className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition-opacity">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <form onSubmit={handleAddTask} className="mt-4 flex gap-2 border-t border-gray-100 dark:border-gray-700 pt-4">
                <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder={t('add_task', 'Adicionar nova tarefa...')}
                    className="flex-1 text-sm bg-transparent border-none focus:ring-0 placeholder-gray-400 text-gray-700 dark:text-white px-0"
                />
                <Button size="icon" variant="ghost" type="submit" disabled={!newTask.trim()} className="h-8 w-8 text-blue-600">
                    <Plus className="w-4 h-4" />
                </Button>
            </form>
        </div>
    );
};
