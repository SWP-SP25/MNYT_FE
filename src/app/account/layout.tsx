import styles from './layout.module.css';
import { AccountSidebar } from './components/sidebar';

export default function AccountLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className={styles.container}>
            <AccountSidebar />
            <div className={styles.content}>
                <div className={styles.header}>
                    <h1>Quản lý tài khoản</h1>
                    <p>Xem và cập nhật thông tin tài khoản của bạn</p>
                </div>
                {children}
            </div>
        </div>
    );
}