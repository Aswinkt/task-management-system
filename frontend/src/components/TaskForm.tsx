import React, { useState } from 'react';
import { Task } from '../types';

interface TaskFormProps {
    onSubmit: (taskData: Partial<Task>) => Promise<void>;
    initialData?: Partial<Task>;
    onCancel: () => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ onSubmit, initialData, onCancel }) => {
    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        description: initialData?.description || '',
        status: initialData?.status || 'TODO',
        priority: initialData?.priority || 'MEDIUM',
        due_date: initialData?.due_date ? new Date(initialData.due_date).toISOString().split('T')[0] : '',
        tags: initialData?.tags || '',
        comments: initialData?.comments || [],
        activity_logs: initialData?.activity_logs || []
    });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError(null);
            await onSubmit(formData);
            onCancel();
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Failed to save task');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="task-form-overlay">
            <div className="task-form">
                <h2>{initialData ? 'Edit Task' : 'Create New Task'}</h2>
                {error && <div className="error">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="title">Title</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="status">Status</label>
                        <select
                            id="status"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            required
                        >
                            <option value="TODO">To Do</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="DONE">Done</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="priority">Priority</label>
                        <select
                            id="priority"
                            name="priority"
                            value={formData.priority}
                            onChange={handleChange}
                            required
                        >
                            <option value="LOW">Low</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="HIGH">High</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="due_date">Due Date</label>
                        <input
                            type="date"
                            id="due_date"
                            name="due_date"
                            value={formData.due_date}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="tags">Tags (comma-separated)</label>
                        <input
                            type="text"
                            id="tags"
                            name="tags"
                            value={formData.tags}
                            onChange={handleChange}
                            placeholder="e.g., work, urgent, project"
                        />
                    </div>

                    <div className="form-actions">
                        <button type="button" onClick={onCancel} disabled={loading}>
                            Cancel
                        </button>
                        <button type="submit" disabled={loading}>
                            {loading ? 'Saving...' : 'Save Task'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}; 