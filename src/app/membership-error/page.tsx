'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@nextui-org/react';
import styles from './page.module.css';

export default function MembershipError() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const errorType = searchParams.get('type');

    const getMessage = () => {
        switch (errorType) {
            case 'basic-plan':
                return 'gói hiện tại của bạn không có tính năng đó';
            case 'no-membership':
            default:
                return 'bạn phải chọn gói thành viên để sử dụng web của chúng tôi';
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <h1 className={styles.title}>Thông báo</h1>
                <p className={styles.message}>
                    {getMessage()}
                </p>
                <Button 
                    color="primary"
                    onClick={() => router.push('/membership')}
                    className={styles.button}
                >
                    {errorType === 'basic-plan' ? 'Nâng cấp gói thành viên' : 'Chọn gói thành viên'}
                </Button>
            </div>
        </div>
    );
} 