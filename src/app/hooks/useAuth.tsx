import { createContext, useContext, useState, useEffect } from 'react';
import { useFetch } from '@/app/hooks/useFetch';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
    refreshUserSession: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = "https://api-mnyt.purintech.id.vn/api/Authentication";

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const { fetchData, loading, error } = useFetch();

    useEffect(() => {
        // Khôi phục phiên đăng nhập từ localStorage
        const initializeAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    await refreshUserSession();
                } catch (error) {
                    // Nếu không thể khôi phục phiên đăng nhập, xóa token
                    logout();
                }
            }
        };

        initializeAuth();
    }, []);

    useEffect(() => {
        const handleForceLogout = () => {
            logout();
            toast.error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
            window.location.href = '/login';
        };

        window.addEventListener('FORCE_LOGOUT', handleForceLogout);
        return () => window.removeEventListener('FORCE_LOGOUT', handleForceLogout);
    }, []);

    const refreshUserSession = async (): Promise<boolean> => {
        try {
            const response = await fetchData<{ success: boolean; data: AuthUser }>(
                `${API_URL}/refresh-token`,
                {
                    method: 'POST',
                    body: JSON.stringify({
                        refreshToken: localStorage.getItem('refreshToken')
                    })
                }
            );

            if (response.success) {
                setUser(response.data);
                localStorage.setItem('token', response.data.token);
                return true;
            }
            return false;
        } catch (error) {
            return false;
        }
    };

    const login = async (credentials: LoginCredentials) => {
        try {
            const response = await fetchData<{ success: boolean; data: AuthUser & { refreshToken: string } }>(
                `${API_URL}/login`,
                {
                    method: 'POST',
                    body: JSON.stringify(credentials)
                }
            );

            if (response.success) {
                setUser(response.data);
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('refreshToken', response.data.refreshToken);
            }
        } catch (error) {
            toast.error('Đăng nhập thất bại');
            throw error;
        }
    };

    const logout = async () => {
        try {
            await fetchData(`${API_URL}/logout`, { method: 'POST' });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setUser(null);
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, error, login, logout, refreshUserSession }}>
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