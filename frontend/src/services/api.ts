import axios from 'axios';
import { AuthResponse, User, Task } from '../types';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem('refresh_token');
                const response = await axios.post<AuthResponse>(`${API_URL}/token/refresh/`, {
                    refresh: refreshToken,
                });
                localStorage.setItem('access_token', response.data.access);
                originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
                return api(originalRequest);
            } catch (error) {
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export const authService = {
    login: async (username: string, password: string) => {
        const response = await api.post<AuthResponse>('/token/', {
            username,
            password,
        });
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
    },

    getCurrentUser: async () => {
        const response = await api.get<User>('/users/me/');
        return response.data;
    },

    register: async (userData: {
        username: string;
        password: string;
        password2: string;
        email: string;
        first_name: string;
        last_name: string;
    }) => {
        const response = await api.post<User>('/users/', userData);
        return response.data;
    },
};

export const taskService = {
    getTasks: async () => {
        const response = await api.get<Task[]>('/tasks/');
        return response.data;
    },

    getTask: async (id: number) => {
        const response = await api.get<Task>(`/tasks/${id}/`);
        return response.data;
    },

    createTask: async (taskData: Partial<Task>) => {
        const response = await api.post<Task>('/tasks/', taskData);
        return response.data;
    },

    updateTask: async (id: number, taskData: Partial<Task>) => {
        const response = await api.patch<Task>(`/tasks/${id}/`, taskData);
        return response.data;
    },

    deleteTask: async (id: number) => {
        await api.delete(`/tasks/${id}/`);
    },

    addComment: async (taskId: number, content: string) => {
        const response = await api.post(`/tasks/${taskId}/add_comment/`, { content });
        return response.data;
    },
};

export default api; 