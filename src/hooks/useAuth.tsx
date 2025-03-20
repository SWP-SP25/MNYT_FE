import { createContext, useContext, useState } from 'react';
import { useFetch } from '@/hooks/useFetch';
import Cookies from 'js-cookie';

export interface AuthUser {
    token: string;
    user: {
        id: string;
        userName: string;
        fullName: string;
        email: string;
        role: string;
    };
}

interface LoginCredentials {
    emailOrUsername: string;
    password: string;
}

interface RegisterCredentials {
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
    const [user, setUser] = useState<AuthUser | null>(() => {
        const savedUser = Cookies.get('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });
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
                    // Lưu token và user
                    Cookies.set('token', response.data.token, { expires: 7 });
                    Cookies.set('user', JSON.stringify(response.data), { expires: 7 });
                }
            });
        } catch (error) {
            throw error;
        }
    };

    const logout = async () => {
        setUser(null);
        // Xóa token và user khỏi cookie
        Cookies.remove('token');
        Cookies.remove('user');
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