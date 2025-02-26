import { createContext, useContext, useState } from 'react';
import { useFetch } from '@/hooks/useFetch';

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
    const [user, setUser] = useState<AuthUser | null>(null);
    const { fetchData, loading, error } = useFetch();

    const login = async (credentials: LoginCredentials) => {
        try {
            const response = await fetchData<{success: boolean; data: AuthUser}>(
                `${API_URL}/login`,
                {
                    method: 'POST',
                    body: JSON.stringify(credentials)
                }
            );

            if (response.success) {
                setUser(response.data);
                localStorage.setItem('token', response.data.token);
            }
        } catch (error) {
            throw error;
        }
    };

    const logout = async () => {
        setUser(null);
        localStorage.removeItem('token');
    };

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