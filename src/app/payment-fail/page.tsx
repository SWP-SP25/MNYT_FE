'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Alert, Card, Typography } from 'antd';
import { CloseCircleFilled, HomeOutlined, ReloadOutlined } from '@ant-design/icons';
import styles from './page.module.css';

const { Title, Text } = Typography;

export default function PaymentFail() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    // Đếm ngược thời gian chuyển hướng
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else {
      // Chuyển về trang chủ khi đếm ngược kết thúc
      router.push('/');
    }
  }, [countdown, router]);

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <div className={styles.topDecoration}></div>

        <div className={styles.iconWrapper}>
          <CloseCircleFilled style={{ fontSize: 40, color: '#ff5757' }} />
        </div>

        <Title level={2} className={styles.title}>
          Giao dịch thất bại
        </Title>

        <Text className={styles.message}>
          Rất tiếc, giao dịch của bạn không thể hoàn tất. Vui lòng thử lại hoặc liên hệ hỗ trợ nếu vấn đề vẫn tiếp diễn.
        </Text>

        <Alert
          message="Thông tin lỗi"
          description="Không thể xác thực thông tin thanh toán hoặc giao dịch đã bị hủy bởi ngân hàng phát hành."
          type="error"
          showIcon
          style={{ marginBottom: 24, textAlign: 'left' }}
        />

        <div className={styles.timerText}>
          Tự động chuyển về trang chủ sau:
        </div>

        <div className={styles.timer}>
          {countdown} giây
        </div>

        <div className={styles.buttonContainer}>
          <Link href="/membership" className={styles.primaryButton}>
            <ReloadOutlined style={{ marginRight: 8 }} />
            Thử lại
          </Link>

          <Link href="/" className={styles.secondaryButton}>
            <HomeOutlined style={{ marginRight: 8 }} />
            Về trang chủ
          </Link>
        </div>
      </Card>
    </div>
  );
} 