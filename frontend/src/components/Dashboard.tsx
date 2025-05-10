import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { taskService } from '../services/api';
import { Task, Comment } from '../types';
import { TaskForm } from './TaskForm';
import { CommentSection } from './CommentSection';
import { ActivityLog } from './ActivityLog';

export const Dashboard: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showTaskForm, setShowTaskForm] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const { user } = useAuth();

    useEffect(() => {
        loadTasks();
    }, []);

    const loadTasks = async () => {
        try {
            setLoading(true);
            const data = await taskService.getTasks();
            setTasks(data);
            setError(null);
        } catch (err: any) {
            setError('Failed to load tasks');
            console.error('Error loading tasks:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTask = async (taskData: Partial<Task>) => {
        try {
            const newTask = await taskService.createTask(taskData);
            setTasks(prev => [...prev, newTask]);
            setShowTaskForm(false);
        } catch (err: any) {
            throw err;
        }
    };

    const handleUpdateTask = async (taskData: Partial<Task>) => {
        if (!editingTask) return;
        try {
            setError(null);
            const updatedTask = await taskService.updateTask(editingTask.id, taskData);
            setTasks(prev => prev.map(task => 
                task.id === editingTask.id ? { ...task, ...updatedTask } : task
            ));
            setEditingTask(null);
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Failed to update task');
            throw err;
        }
    };

    const handleDeleteTask = async (taskId: number) => {
        if (!window.confirm('Are you sure you want to delete this task?')) return;
        try {
            await taskService.deleteTask(taskId);
            setTasks(prev => prev.filter(task => task.id !== taskId));
        } catch (err: any) {
            setError('Failed to delete task');
            console.error('Error deleting task:', err);
        }
    };

    const handleEditClick = (task: Task) => {
        setEditingTask(task);
    };

    const handleCommentAdded = (taskId: number, newComment: Comment) => {
        setTasks(prev => prev.map(task => {
            if (task.id === taskId) {
                return {
                    ...task,
                    comments: [...task.comments, newComment]
                };
            }
            return task;
        }));
    };

    if (loading) {
        return <div>Loading tasks...</div>;
    }

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <h1>Welcome, {user?.first_name || user?.username}!</h1>
                <button 
                    className="create-task-btn"
                    onClick={() => setShowTaskForm(true)}
                >
                    Create New Task
                </button>
            </header>

            <div className="tasks-container">
                <h2>Your Tasks</h2>
                {error && <div className="error">{error}</div>}
                {tasks.length === 0 ? (
                    <p>No tasks found. Create your first task!</p>
                ) : (
                    <div className="tasks-grid">
                        {tasks.map((task) => (
                            <div key={task.id} className="task-card">
                                <div className="task-header">
                                    <h3>{task.title}</h3>
                                    <div className="task-actions">
                                        <button 
                                            className="edit-btn"
                                            onClick={() => handleEditClick(task)}
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            className="delete-btn"
                                            onClick={() => handleDeleteTask(task.id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                                <p>{task.description}</p>
                                <div className="task-meta">
                                    <span className={`status ${task.status}`}>
                                        {task.status}
                                    </span>
                                    <span className={`priority ${task.priority}`}>
                                        {task.priority}
                                    </span>
                                </div>
                                {task.due_date && (
                                    <div className="due-date">
                                        Due: {new Date(task.due_date).toLocaleDateString()}
                                    </div>
                                )}
                                {task.tags && (
                                    <div className="task-tags">
                                        {task.tags.split(',').map((tag, index) => (
                                            <span key={index} className="tag">
                                                {tag.trim()}
                                            </span>
                                        ))}
                                    </div>
                                )}
                                
                                <CommentSection
                                    taskId={task.id}
                                    comments={task.comments}
                                    onCommentAdded={(comment) => handleCommentAdded(task.id, comment)}
                                />
                                
                                <ActivityLog activities={task.activity_logs} />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {showTaskForm && (
                <TaskForm
                    onSubmit={handleCreateTask}
                    onCancel={() => setShowTaskForm(false)}
                />
            )}

            {editingTask && (
                <TaskForm
                    onSubmit={handleUpdateTask}
                    initialData={editingTask}
                    onCancel={() => setEditingTask(null)}
                />
            )}
        </div>
    );
}; 