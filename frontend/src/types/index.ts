export interface User {
    id: number;
    username: string;
    email: string;
    role: 'admin' | 'user';
    first_name: string;
    last_name: string;
}

export interface Task {
    id: number;
    title: string;
    description: string;
    created_by: User;
    assigned_to: User | null;
    status: 'TODO' | 'IN_PROGRESS' | 'DONE';
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    due_date: string | null;
    created_at: string;
    updated_at: string;
    tags: string;
    comments: Comment[];
    activity_logs: ActivityLog[];
}

export interface Comment {
    id: number;
    task: number;
    user: User;
    content: string;
    created_at: string;
    updated_at: string;
}

export interface ActivityLog {
    id: number;
    task: number;
    user: User;
    action: string;
    details: string;
    created_at: string;
}

export interface AuthResponse {
    access: string;
    refresh: string;
} 