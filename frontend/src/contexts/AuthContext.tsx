import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { authService } from '../services/api';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    error: string | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    register: (userData: {
        username: string;
        password: string;
        password2: string;
        email: string;
        first_name: string;
        last_name: string;
    }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const initAuth = async () => {
            try {
                const token = localStorage.getItem('access_token');
                if (token) {
                    const userData = await authService.getCurrentUser();
                    setUser(userData);
                }
            } catch (error) {
                console.error('Failed to initialize auth:', error);
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, []);

    const login = async (username: string, password: string) => {
        try {
            setError(null);
            await authService.login(username, password);
            const userData = await authService.getCurrentUser();
            setUser(userData);
        } catch (error: any) {
            setError(error.response?.data?.detail || 'Login failed');
            throw error;
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    const register = async (userData: {
        username: string;
        password: string;
        password2: string;
        email: string;
        first_name: string;
        last_name: string;
    }) => {
        try {
            setError(null);
            await authService.register(userData);
            await login(userData.username, userData.password);
        } catch (error: any) {
            setError(error.response?.data?.detail || 'Registration failed');
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, error, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 