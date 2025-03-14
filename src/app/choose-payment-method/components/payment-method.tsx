import { useState } from 'react';
import styles from './payment-method.module.css';
import Image from 'next/image';

type PaymentMethodProps = {
    onSelectPayment: (method: string) => void;
    selectedMethod: string;
};

const PaymentMethod: React.FC<PaymentMethodProps> = ({ onSelectPayment, selectedMethod }) => {
    return (
        <div className={styles.paymentContainer}>
            <h2 className={styles.paymentTitle}>Thanh toán</h2>

            <div className={styles.paymentOptions}>
                {/* Phương thức thanh toán tiền mặt */}
                <div
                    className={`${styles.paymentOption} ${selectedMethod === 'cash' ? styles.selected : ''}`}
                    onClick={() => onSelectPayment('cash')}
                >
                    <div className={styles.radioContainer}>
                        <input
                            type="radio"
                            id="cash"
                            name="paymentMethod"
                            checked={selectedMethod === 'cash'}
                            onChange={() => onSelectPayment('cash')}
                        />
                        <label htmlFor="cash"></label>
                    </div>
                    <div className={styles.paymentInfo}>
                        <div className={styles.paymentText}>
                            <p>Thanh toán khi giao hàng (COD)</p>
                            <p className={styles.paymentSubtext}>(Miễn phí thanh toán)</p>
                        </div>
                        <div className={styles.paymentIcon}>
                            <Image
                                src="/images/cash-icon.png"
                                alt="Cash payment"
                                width={40}
                                height={40}
                                className={styles.icon}
                            />
                        </div>
                    </div>
                </div>

                {/* Phương thức thanh toán VNPay */}
                <div
                    className={`${styles.paymentOption} ${selectedMethod === 'vnpay' ? styles.selected : ''}`}
                    onClick={() => onSelectPayment('vnpay')}
                >
                    <div className={styles.radioContainer}>
                        <input
                            type="radio"
                            id="vnpay"
                            name="paymentMethod"
                            checked={selectedMethod === 'vnpay'}
                            onChange={() => onSelectPayment('vnpay')}
                        />
                        <label htmlFor="vnpay"></label>
                    </div>
                    <div className={styles.paymentInfo}>
                        <div className={styles.paymentText}>
                            <p>Thanh toán qua VNPay</p>
                            <p className={styles.paymentSubtext}>(Miễn phí thanh toán)</p>
                        </div>
                        <div className={styles.paymentIcon}>
                            <Image
                                src="/images/vnpay-icon.png"
                                alt="VNPay"
                                width={40}
                                height={40}
                                className={styles.icon}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentMethod;