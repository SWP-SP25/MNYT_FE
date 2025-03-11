

import { useState, useEffect } from "react";

export default function Counter() {
  const [count, setCount] = useState(null);

  useEffect(() => {
    const savedValue = window.localStorage.getItem("count");
    setCount(savedValue ? Number(savedValue) : 0);
  }, []);

  useEffect(() => {
    if (typeof count === "number") {
      window.localStorage.setItem("count", count);
    }
  }, [count]);

  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {typeof count === "number" ? count : <span>...</span>}
    </button>
  );
}

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