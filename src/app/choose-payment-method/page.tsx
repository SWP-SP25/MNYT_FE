'use client'
import { useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import PaymentMethod from './components/payment-method';
import styles from './page.module.css';

const Checkout: NextPage = () => {
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('cash');

    const handlePaymentMethodChange = (method: string) => {
        setSelectedPaymentMethod(method);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Phương thức thanh toán đã chọn:', selectedPaymentMethod);
        // Xử lý đặt hàng ở đây
    };

    return (
        <div className={styles.container}>
            <Head>
                <title>Thanh toán</title>
                <meta name="description" content="Trang thanh toán" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={styles.main}>
                <h1 className={styles.title}>Thanh toán đơn hàng</h1>

                <div className={styles.checkoutContainer}>
                    <div className={styles.checkoutForm}>
                        <form onSubmit={handleSubmit}>
                            {/* Phần thông tin giao hàng */}
                            <div className={styles.shippingInfo}>
                                <h2>Thông tin nhận hàng</h2>
                                {/* Thêm các trường thông tin giao hàng ở đây */}
                                <div className={styles.formGroup}>
                                    <input type="email" placeholder="Email" required />
                                </div>
                                <div className={styles.formGroup}>
                                    <input type="text" placeholder="Họ và tên" required />
                                </div>
                                <div className={styles.formGroup}>
                                    <input type="tel" placeholder="Số điện thoại" required />
                                </div>
                                <div className={styles.formGroup}>
                                    <input type="text" placeholder="Địa chỉ" required />
                                </div>
                            </div>

                            {/* Phần phương thức thanh toán */}
                            <PaymentMethod
                                onSelectPayment={handlePaymentMethodChange}
                                selectedMethod={selectedPaymentMethod}
                            />

                            <div className={styles.actionButtons}>
                                <button type="button" className={styles.backButton}>
                                    Quay về giỏ hàng
                                </button>
                                <button type="submit" className={styles.submitButton}>
                                    Đặt hàng
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className={styles.orderSummary}>
                        <h2>Đơn hàng (1 sản phẩm)</h2>
                        {/* Thêm thông tin đơn hàng ở đây */}
                        <div className={styles.productItem}>
                            <div className={styles.productImage}>
                                {/* Hình ảnh sản phẩm */}
                            </div>
                            <div className={styles.productInfo}>
                                <p className={styles.productName}>Tên sản phẩm</p>
                                <p className={styles.productPrice}>490.000 ₫</p>
                            </div>
                        </div>

                        <div className={styles.orderTotal}>
                            <div className={styles.subtotal}>
                                <span>Tạm tính</span>
                                <span>490.000 ₫</span>
                            </div>
                            <div className={styles.shipping}>
                                <span>Phí vận chuyển</span>
                                <span>-</span>
                            </div>
                            <div className={styles.total}>
                                <span>Tổng cộng</span>
                                <span>490.000 ₫</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Checkout;