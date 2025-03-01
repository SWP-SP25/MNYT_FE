import { useState, useEffect } from 'react';

function useLocalStorage<T>(key: string, initialValue: T) {
    // Khởi tạo state với callback để tránh đọc localStorage
    // mỗi lần component re-render
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            // Kiểm tra môi trường browser
            if (typeof window !== 'undefined') {
                const item = window.localStorage.getItem(key);
                return item ? JSON.parse(item) : initialValue;
            }
            return initialValue;
        } catch (error) {
            console.error(error);
            return initialValue;
        }
    });

    // Cập nhật localStorage khi state thay đổi
    useEffect(() => {
        try {
            if (typeof window !== 'undefined') {
                window.localStorage.setItem(key, JSON.stringify(storedValue));
            }
        } catch (error) {
            console.error(error);
        }
    }, [key, storedValue]);

    return [storedValue, setStoredValue] as const;
}

export default useLocalStorage;