import { useState, useEffect } from 'react';

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface FetchConfig {
  url: string;
  method?: string;
  body?: any;
  headers?: Record<string, string>;
  skip?: boolean; // Thêm option để kiểm soát khi nào gọi API
}

export function useFetch<T>(config: FetchConfig): FetchState<T> {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  useEffect(() => {
    // Nếu skip = true hoặc không có url thì không gọi API
    if (config.skip || !config.url) {
      return;
    }

    const fetchData = async () => {
      setState(prev => ({ ...prev, loading: true, error: null }));

      try {
        const response = await fetch(config.url, {
          method: config.method || 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...config.headers,
          },
          ...(config.body ? { body: JSON.stringify(config.body) } : {}),
        }).catch((error) => {
          setState(prev => ({
            ...prev,
            loading: false,
            error: error instanceof Error ? error.message : 'Something went wrong',
          }));
        });

        if (!response.ok) {
          throw new Error('Request failed');
        }

        const data = await response.json();
        setState({ data, loading: false, error: null });
      } catch (error) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : 'Something went wrong',
        }));
      }
    };

    fetchData();
  }, [config.url, config.method, config.body, config.skip]); // Dependencies cho useEffect

  return state;
}