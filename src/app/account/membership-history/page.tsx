'use client';

import styles from '../components.module.css';

// Mock data
const mockMemberships = [
    {
        id: 1,
        plan: 'Premium Monthly',
        startDate: '2023-05-20',
        endDate: '2023-06-20',
        price: '199.000 VND',
        status: 'expired',
        paymentMethod: 'Credit Card',
    },
    {
        id: 2,
        plan: 'Premium Yearly',
        startDate: '2023-07-01',
        endDate: '2024-07-01',
        price: '1.899.000 VND',
        status: 'active',
        paymentMethod: 'Bank Transfer',
    },
    {
        id: 3,
        plan: 'Premium Monthly',
        startDate: '2023-04-15',
        endDate: '2023-05-15',
        price: '199.000 VND',
        status: 'expired',
        paymentMethod: 'Momo Wallet',
    },
];

export default function MembershipsPage() {
    return (
        <div className={styles.card}>
            <h3>Lịch sử gói thành viên</h3>

            {mockMemberships.length === 0 ? (
                <p>Bạn chưa đăng ký gói thành viên nào.</p>
            ) : (
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Gói</th>
                            <th>Ngày bắt đầu</th>
                            <th>Ngày kết thúc</th>
                            <th>Giá tiền</th>
                            <th>Phương thức thanh toán</th>
                            <th>Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mockMemberships.map((membership) => (
                            <tr key={membership.id}>
                                <td>{membership.plan}</td>
                                <td>{membership.startDate}</td>
                                <td>{membership.endDate}</td>
                                <td>{membership.price}</td>
                                <td>{membership.paymentMethod}</td>
                                <td>
                                    <span
                                        className={`
                      ${styles.status} 
                      ${membership.status === 'active' ? styles.activeStatus : styles.expiredStatus}
                    `}
                                    >
                                        {membership.status === 'active' ? 'Đang hoạt động' : 'Đã hết hạn'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}