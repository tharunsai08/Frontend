import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

import api from 'src/api';

interface AuthContextProps {
    user: string | null;
    token: string | null;
    isAuthenticated: boolean;
    setUser: (user: string, token: string, isSuperuser: boolean | false) => void;
    logout: () => void;
    login: (username: string, password: string) => Promise<void>;
    signup: (username: string, email: string, password: string) => Promise<void>;
    error: string | null;
    successMessage: string | null;
    clearMessages: () => void;
    onRedirect: (path: string) => void; // Callback for handling redirection
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
    onRedirect: (path: string) => void; // Accept the redirection callback
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children, onRedirect }) => {
    const [user, setUserState] = useState<string | null>(null);
    const [token, setTokenState] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    let logoutTimer: NodeJS.Timeout | null = null;

    // Inactivity timeout logic
    useEffect(() => {
        const handleActivity = () => {
            if (token) {
                resetLogoutTimer();
            }
        };

        const resetLogoutTimer = () => {
            if (logoutTimer) {
                clearTimeout(logoutTimer);
            }
            logoutTimer = setTimeout(logout, 30 * 60 * 1000); // 30 minutes
        };

        document.addEventListener('mousemove', handleActivity);
        document.addEventListener('keypress', handleActivity);

        resetLogoutTimer();

        return () => {
            document.removeEventListener('mousemove', handleActivity);
            document.removeEventListener('keypress', handleActivity);
            if (logoutTimer) {
                clearTimeout(logoutTimer);
            }
        };
    }, [token]);

    // Initialize authentication state from local storage
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
            setUserState(storedUser);
            setTokenState(storedToken);
        }
    }, []);

    const refreshToken = async () => {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) return;

        try {
            const response = await api.post(`/api/token/refresh/`, {}, {
                headers: { Authorization: `Bearer ${refreshToken}` },
            });
            const newToken = response.data.access;
            setTokenState(newToken);
            localStorage.setItem('token', newToken);
        } catch (error) {
            console.error('Error refreshing token:', error);
            logout();
        }
    };

    // Setup Axios interceptors
    useEffect(() => {
        const setupAxiosInterceptors = () => {
            api.interceptors.request.use(
                (config: InternalAxiosRequestConfig) => {
                    const token = localStorage.getItem('token');
                    if (token) {
                        config.headers = config.headers || {};
                        config.headers.Authorization = `Bearer ${token}`;
                    }
                    return config;
                },
                (error: AxiosError) => Promise.reject(error)
            );

            api.interceptors.response.use(
                (response: AxiosResponse) => response,
                async (error: AxiosError) => {
                    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

                    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
                        originalRequest._retry = true;
                        await refreshToken();
                        return axios(originalRequest);
                    }

                    return Promise.reject(error);
                }
            );
        };

        setupAxiosInterceptors();
    }, [token]);

    const setUser = (user: string, token: string, isSuperuser: boolean) => {
        setUserState(user);
        setTokenState(token);
        localStorage.setItem('token', token);
        localStorage.setItem('user', user);
        localStorage.setItem('isSuperuser', JSON.stringify(isSuperuser));
    };    

    const logout = () => {
        setUserState(null);
        setTokenState(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('refreshToken');
        localStorage.setItem('isSuperuser', JSON.stringify(false));
        onRedirect('/login'); // Use onRedirect to handle navigation
    };

    const login = async (username: string, password: string) => {
        try {
            const response = await api.post(`/api/token/`, { username, password });
            const { access, refresh, is_superuser } = response.data; // Adjust according to your API response
            setUser(username, access, is_superuser);
            localStorage.setItem('refreshToken', refresh); // Store the refresh token
            setSuccessMessage('Successfully logged in!');
            onRedirect('/');
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                setError(error.response.data.detail || 'Login failed.');
            } else {
                setError('An unknown error occurred.');
            }
        }
    };
    

    const signup = async (username: string, email: string, password: string) => {
        try {
            const response = await api.post(`/api/signup/`, { username, email, password });
            setSuccessMessage(response.data.message || 'Successfully signed up!');
            onRedirect('/login');
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                setError(error.response.data.error || 'Signup failed.');
            } else {
                setError('An unknown error occurred.');
            }
        }
    };

    const clearMessages = () => {
        setError(null);
        setSuccessMessage(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, setUser, logout, login, signup, error, successMessage, clearMessages, onRedirect }}>
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
