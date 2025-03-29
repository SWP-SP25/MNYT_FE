'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Alert, Card, Divider, Typography } from 'antd';
import { CheckCircleFilled, HomeOutlined, FileTextOutlined } from '@ant-design/icons';
import styles from './page.module.css';

const { Title, Text } = Typography;

export default function PaymentSuccess() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(15);

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
          <CheckCircleFilled style={{ fontSize: 40, color: '#48c774' }} />
        </div>

        <Title level={2} className={styles.title}>
          Giao dịch thành công
        </Title>

        <Text className={styles.message}>
          Cảm ơn bạn! Giao dịch của bạn đã được hoàn tất thành công.
          Thông tin gói membership đã được cập nhật vào tài khoản của bạn.
        </Text>

        <Alert
          message="Thanh toán đã được xác nhận"
          description="Gói membership của bạn đã được kích hoạt và sẵn sàng sử dụng."
          type="success"
          showIcon
          style={{ marginBottom: 24, textAlign: 'left' }}
        />

        <div className={styles.details}>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Mã giao dịch:</span>
            <span className={styles.detailValue}>#TRX-{Math.floor(Math.random() * 10000000)}</span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Gói membership:</span>
            <span className={styles.detailValue}>Gói cao cấp</span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Thời hạn:</span>
            <span className={styles.detailValue}>12 tháng</span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Ngày kích hoạt:</span>
            <span className={styles.detailValue}>{new Date().toLocaleDateString('vi-VN')}</span>
          </div>
        </div>

        <Divider />

        <div className={styles.timerText}>
          Tự động chuyển về dashboard sau:
        </div>

        <div className={styles.timer}>
          {countdown} giây
        </div>

        <div className={styles.buttonContainer}>
          <Link href="/dashboard" className={styles.primaryButton}>
            <HomeOutlined style={{ marginRight: 8 }} />
            Đến Dashboard
          </Link>

          <Link href="/account" className={styles.secondaryButton}>
            <FileTextOutlined style={{ marginRight: 8 }} />
            Thông tin tài khoản
          </Link>
        </div>
      </Card>
    </div>
  );
} 