'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Cookies from 'js-cookie';
import styles from './page.module.css';

const UnauthorizedPage = () => {
    const router = useRouter();
    const { user } = useAuth();

    React.useEffect(() => {
        if (user?.role === 'Admin') {
            const redirectUrl = Cookies.get('redirectUrl');
            if (redirectUrl) {
                Cookies.remove('redirectUrl');
                router.push(redirectUrl);
            } else {
                router.push('/admin');
            }
        }
    }, [user, router]);

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <svg
                    className={styles.warningIcon}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                </svg>
                <h1 className={styles.title}>
                    Không có quyền truy cập
                </h1>
                <p className={styles.message}>
                    Bạn không có quyền truy cập trang này. Vui lòng quay lại trang chủ.
                </p>
                <button
                    onClick={() => router.push('/')}
                    className={styles.button}
                >
                    Quay lại trang chủ
                </button>
            </div>
        </div>
    );
};

export default UnauthorizedPage;

