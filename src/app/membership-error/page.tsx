'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@nextui-org/react';
import { IoWarningOutline, IoRocketOutline } from 'react-icons/io5';
import { motion } from 'framer-motion';
import styles from './page.module.css';

export default function MembershipError() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const errorType = searchParams.get('type');

    const getMessage = () => {
        switch (errorType) {
            case 'basic-plan':
                return 'Gói thành viên hiện tại của bạn không hỗ trợ tính năng này';
            case 'no-membership':
            default:
                return 'Bạn cần chọn một gói thành viên để trải nghiệm đầy đủ dịch vụ của chúng tôi';
        }
    };

    const getSubtitle = () => {
        switch (errorType) {
            case 'basic-plan':
                return 'Hãy nâng cấp để mở khóa tất cả tính năng cao cấp!';
            case 'no-membership':
            default:
                return 'Chọn gói phù hợp với nhu cầu của bạn ngay hôm nay!';
        }
    };

    return (
        <motion.div
            className={styles.container}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className={styles.card}>
                <div className={styles.iconContainer}>
                    {errorType === 'basic-plan' ?
                        <IoRocketOutline className={styles.icon} /> :
                        <IoWarningOutline className={styles.icon} />
                    }
                </div>

                <h1 className={styles.title}>
                    {errorType === 'basic-plan' ? 'Cần nâng cấp' : 'Chưa có gói thành viên'}
                </h1>

                <p className={styles.message}>{getMessage()}</p>
                <p className={styles.subtitle}>{getSubtitle()}</p>

                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Button
                        color="primary"
                        onClick={() => router.push('/membership')}
                        className={styles.button}
                        size="lg"
                        startContent={<IoRocketOutline />}
                    >
                        {errorType === 'basic-plan' ? 'Nâng cấp ngay' : 'Chọn gói thành viên'}
                    </Button>
                </motion.div>

                <button
                    className={styles.backButton}
                    onClick={() => router.back()}
                >
                    Quay lại
                </button>
            </div>
        </motion.div>
    );
} 