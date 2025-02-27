import { useState } from 'react';

interface FetchOptions extends RequestInit {
    body?: any;
    skipAuthRefresh?: boolean;
}

interface ApiError extends Error {
    status?: number;
    data?: any;
}

export function useFetch() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getHeaders = (options: FetchOptions) => {
        const token = localStorage.getItem('token');
        return {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers,
        };
    };

    const handleApiError = (error: ApiError, url: string) => {
        const message = error.data?.message || error.message || 'Có lỗi xảy ra';
        setError(message);

        console.error(`API Error (${url}):`, {
            status: error.status,
            message: message,
            data: error.data
        });

        throw error;
    };

    const fetchWithRetry = async <T>(url: string, options: FetchOptions = {}): Promise<T> => {
        try {
            const response = await fetch(url, {
                ...options,
                headers: getHeaders(options),
            });

            const data = await response.json();

            if (!response.ok) {
                const error = new Error(data.message || 'Có lỗi xảy ra') as ApiError;
                error.status = response.status;
                error.data = data;
                throw error;
            }

            return data as T;
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Có lỗi xảy ra');
        }
    };

    const fetchData = async <T>(url: string, options: FetchOptions = {}): Promise<T> => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetchWithRetry<T>(url, options);
            return response;

        } catch (error: any) {
            if (error.status === 401 && !options.skipAuthRefresh) {
                try {
                    const refreshEvent = new CustomEvent('REFRESH_TOKEN_NEEDED');
                    window.dispatchEvent(refreshEvent);

                    return await fetchWithRetry<T>(url, options);
                } catch (refreshError) {
                    window.dispatchEvent(new Event('FORCE_LOGOUT'));
                    throw new Error('Phiên đăng nhập đã hết hạn');
                }
            }

            return handleApiError(error, url);
        } finally {
            setLoading(false);
        }
    };

    return { fetchData, loading, error };
}