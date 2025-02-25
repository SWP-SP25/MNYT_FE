'use client';
import styles from './membership.module.css';

const Membership = () => {
    return (
        <div className={styles.membershipContainer}>
            <h1 className={styles.title}>Chọn gói hội viên</h1>
            <div className={styles.membershipPlans}>
                
                {/* Gói Standard */}
                <div className={`${styles.plan} ${styles.standard}`}>
                    <h2>Standard</h2>
                    <p>✔️ Truy cập nội dung miễn phí</p>
                    <p>✔️ Tham gia diễn đàn</p>
                    <p>❌ Không có quyền truy cập nội dung cao cấp</p>
                    <button className={styles.defaultButton} disabled>
                        Mặc định
                    </button>
                </div>

                {/* Gói Premium */}
                <div className={`${styles.plan} ${styles.premium}`}>
                    <h2>Premium</h2>
                    <p>✔️ Tất cả quyền lợi của Standard</p>
                    <p>✔️ Truy cập nội dung cao cấp</p>
                    <p>✔️ Hỗ trợ trực tuyến</p>
                    <button className={styles.button}>Nâng cấp</button>
                </div>

                {/* Gói VIP */}
                <div className={`${styles.plan} ${styles.vip}`}>
                    <h2>VIP</h2>
                    <p>✔️ Tất cả quyền lợi của Premium</p>
                    <p>✔️ Ưu tiên hỗ trợ 24/7</p>
                    <p>✔️ Quà tặng đặc biệt</p>
                    <button className={styles.button}>Nâng cấp</button>
                </div>
            </div>
        </div>
    );
};

export default Membership;
