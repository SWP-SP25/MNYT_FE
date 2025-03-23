'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export const useAuthGuard = (requiredRole?: string) => {
    const router = useRouter();

    useEffect(() => {
        const token = Cookies.get('token');
        const userRole = Cookies.get('userRole');

        if (!token) {
            router.push('/authenticate');
            return;
        }

        if (requiredRole && userRole !== requiredRole) {
            router.push('/unauthorized');
            return;
        }
    }, [router, requiredRole]);
};