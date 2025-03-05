import { createContext, useContext, useState } from 'react';
import { useFetch } from '@/hooks/useFetch';
import useLocalStorage from './useLocalStorage';

interface AuthUser {
    token: string;
    user: {
        id: string;
        username: string;
        email: string;
    };
}

interface LoginCredentials {
    emailOrUsername: string;
    password: string;
}

interface RegisterCredentials
{
    username: string;
    enail: string;
    password: string;   
}

interface AuthContextType {
    user: AuthUser | null;
    loading: boolean;
    error: string | null;
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = "https://api-mnyt.purintech.id.vn/api/Authentication";

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useLocalStorage<AuthUser | null>('user', null);
    const { fetchData, loading, error } = useFetch();

    const login = async (credentials: LoginCredentials) => {
        try {
            const response = await fetchData<{ success: boolean; data: AuthUser }>(
                `${API_URL}/login`,
                {
                    method: 'POST',
                    body: JSON.stringify(credentials)
                }
            ).then(response => {
                if (response.success) {
                    setUser(response.data);
                    localStorage.setItem('token', response.data.token);
                    localStorage.setItem('user', JSON.stringify(response.data));
                }
            });
        } catch (error) {
            throw error;
        }
    };

    const logout = async () => {
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    // const register = async (credentials: RegisterCredentials) => 
    // {
    //     try
    //     {
    //         const reponse = await fetchData <{success : boolean; data: }>
    //     }
    //     catch (error)
    //     {
    //         throw error;
    //     }
    // }

    return (
        <AuthContext.Provider value={{ user, loading, error, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}