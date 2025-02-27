import { useEffect, useState } from 'react';
import { useFetch } from './useFetch';
import { useRouter } from 'next/navigation';

interface LoginCredentials {
  emailOrUsername: string;
  password: string;
}

interface LoginResponse {
  token: string;
}

export function useAuth() {
  const router = useRouter();
  const [loginConfig, setLoginConfig] = useState<{
    url: string;
    method: string;
    body: LoginCredentials | null;
    skip: boolean;
  }>({
    url: '',
    method: 'POST',
    body: null,
    skip: true // Mặc định không gọi API cho đến khi có action login
  });

  const { data, loading, error } = useFetch<LoginResponse>(loginConfig);

  const login = async (credentials: LoginCredentials) => {
    setLoginConfig({
      url: 'http://api-mnyt.purintech.id.vn/api/Authentication/login',
      method: 'POST',
      body: credentials,
      skip: false
    });
  };

  useEffect(() => {
    if (data?.token) {
      localStorage.setItem('auth_token', data.token);
      router.push('/dashboard');
    }
  }, [data, router]);

  const logout = () => {
    localStorage.removeItem('auth_token');
    router.push('/auth/login');
  };

  return {
    login,
    logout,
    loading,
    error,
    isAuthenticated: !!data?.token
  };
}