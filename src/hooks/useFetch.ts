import { useState } from 'react';

interface FetchOptions extends RequestInit {
    body?: any;
}

export function useFetch() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async <T>(url: string, options: FetchOptions = {}): Promise<T> => {
        try {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem('token');
            const headers = {
                'Content-Type': 'application/json',
                ...(token && { Authorization: `Bearer ${token}` }),
                ...options.headers,
            };

            const response = await fetch(url, {
                ...options,
                headers,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Có lỗi xảy ra');
            }

            return data as T;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Có lỗi xảy ra';
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { fetchData, loading, error };
}