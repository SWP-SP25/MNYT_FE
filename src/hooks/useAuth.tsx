import { createContext, useContext, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { User } from '@/types/user';
import { Pregnancy } from '@/types/pregnancy';

interface LoginCredentials {
    emailOrUsername: string;
    password: string;
}

interface LoginResponse {
    success: boolean;
    data: User;
    message: string;
    errors: null | any;
    token?: string;
}

interface RegisterCredentials {
    username: string;
    enail: string;
    password: string;
}

interface AuthContextType {
    user: User | null;
    pregnancy: Pregnancy | null;
    loading: boolean;
    error: string | null;
    login: (credentials: LoginCredentials) => Promise<User | null>;
    logout: () => Promise<void>;
    getPregnancy: (accountId: number) => Promise<Pregnancy | null>;
    setPregnancy: (pregnancy: Pregnancy | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = "https://api-mnyt.purintech.id.vn/api";

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(() => {
        const savedUser = Cookies.get('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [pregnancy, setPregnancy] = useState<Pregnancy | null>(() => {
        const savedPregnancy = Cookies.get('pregnancy');
        return savedPregnancy ? JSON.parse(savedPregnancy) : null;
    });
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Cấu hình axios
    const axiosInstance = axios.create({
        baseURL: API_URL,
        headers: {
            'Content-Type': 'application/json',
        }
    });

    // Thêm interceptor để tự động thêm token vào header
    axiosInstance.interceptors.request.use(
        (config) => {
            const token = Cookies.get('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    const login = async (credentials: LoginCredentials): Promise<User | null> => {
        setLoading(true);
        setError(null);

        try {
            const response = await axiosInstance.post<LoginResponse>('/Authentication/login', credentials);

            if (response.data.success) {
                const userData = response.data.data;
                const token = response.data.token || '';

                setUser(userData);

                // Lưu token và user
                Cookies.set('token', token, { expires: 7 });
                Cookies.set('user', JSON.stringify(userData), { expires: 7 });

                // Kiểm tra xem người dùng đã có pregnancy chưa
                try {
                    const pregnancyResponse = await axiosInstance.get<Pregnancy[]>(`/Pregnancy/account/${userData.id}`);

                    if (pregnancyResponse.data && pregnancyResponse.data.length > 0) {
                        // Đã có pregnancy, lưu vào state và cookie
                        const activePregnancy = pregnancyResponse.data.find(p => p.status === 'active') || pregnancyResponse.data[0];
                        setPregnancy(activePregnancy);
                        Cookies.set('pregnancy', JSON.stringify(activePregnancy), { expires: 7 });
                    } else {
                        // Chưa có pregnancy
                        setPregnancy(null);
                        Cookies.remove('pregnancy');
                    }
                } catch (pregnancyErr) {
                    console.error('Lỗi khi lấy thông tin thai kỳ:', pregnancyErr);
                }

                return userData;
            } else {
                throw new Error(response.data.message || 'Đăng nhập thất bại');
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || 'Đăng nhập thất bại';
            setError(errorMessage);
            console.error('Lỗi đăng nhập:', err);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const getPregnancy = async (accountId: number): Promise<Pregnancy | null> => {
        setLoading(true);
        setError(null);

        try {
            const response = await axiosInstance.get<Pregnancy[]>(`/Pregnancy/account/${accountId}`);

            if (response.data && response.data.length > 0) {
                const activePregnancy = response.data.find(p => p.status === 'active') || response.data[0];
                setPregnancy(activePregnancy);
                Cookies.set('pregnancy', JSON.stringify(activePregnancy), { expires: 7 });
                return activePregnancy;
            } else {
                // Không có pregnancy, đặt state là null
                setPregnancy(null);
                Cookies.remove('pregnancy');
                return null;
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Lỗi khi lấy thông tin thai kỳ';
            setError(errorMessage);
            console.error("Lỗi khi lấy thông tin thai kỳ:", err);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const logout = async (): Promise<void> => {
        setUser(null);
        setPregnancy(null);
        // Xóa token, user và pregnancy khỏi cookie
        Cookies.remove('token');
        Cookies.remove('user');
        Cookies.remove('pregnancy');
    };

    return (
        <AuthContext.Provider value={{
            user,
            pregnancy,
            loading,
            error,
            login,
            logout,
            getPregnancy,
            setPregnancy
        }}>
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