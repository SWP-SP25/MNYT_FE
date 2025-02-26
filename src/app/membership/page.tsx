'use client';
import styles from './membership.module.css';
import { FaBabyCarriage, FaHeart, FaCrown, FaCheck, FaTimes } from 'react-icons/fa';

const Membership = () => {
    return (
        <div className={styles.membershipContainer}>
            <h1 className={styles.title}>Chọn Gói Đồng Hành</h1>
            <p className={styles.subtitle}>Hãy để chúng tôi đồng hành cùng bạn trong hành trình làm mẹ tuyệt vời</p>
            
            <div className={styles.membershipPlans}>
                {/* Gói Cơ Bản */}
                <div className={styles.plan}>
                    <div className={styles.planTitle}>
                        <FaBabyCarriage size={24} />
                        <h2>Cơ Bản</h2>
                    </div>
                    <div className={styles.features}>
                        <div className={styles.featureItem}>
                            <FaCheck color="#279357" />
                            <p>Theo dõi lịch thai kỳ cơ bản</p>
                        </div>
                        <div className={styles.featureItem}>
                            <FaCheck color="#279357" />
                            <p>Nhắc nhở lịch khám định kỳ</p>
                        </div>
                        <div className={styles.featureItem}>
                            <FaCheck color="#279357" />
                            <p>Tham gia cộng đồng mẹ bầu</p>
                        </div>
                        <div className={styles.featureItem}>
                            <FaCheck color="#279357" />
                            <p>Tra cứu thông tin cơ bản</p>
                        </div>
                        <div className={styles.featureItem}>
                            <FaTimes color="#E53E3E" />
                            <p>Tư vấn dinh dưỡng chi tiết</p>
                        </div>
                        <div className={styles.featureItem}>
                            <FaTimes color="#E53E3E" />
                            <p>Gói tập luyện cho mẹ bầu</p>
                        </div>
                    </div>
                    <button className={styles.defaultButton}>
                        Gói Hiện Tại
                    </button>
                </div>

                {/* Gói Tiện Ích */}
                <div className={styles.plan}>
                    <div className={styles.planTitle}>
                        <FaHeart size={24} />
                        <h2>Tiện Ích</h2>
                    </div>
                    <div className={styles.features}>
                        <div className={styles.featureItem}>
                            <FaCheck color="#279357" />
                            <p>Tất cả quyền lợi gói Cơ Bản</p>
                        </div>
                        <div className={styles.featureItem}>
                            <FaCheck color="#279357" />
                            <p>Lịch dinh dưỡng theo tuần</p>
                        </div>
                        <div className={styles.featureItem}>
                            <FaCheck color="#279357" />
                            <p>Gói bài tập cho mẹ bầu</p>
                        </div>
                        <div className={styles.featureItem}>
                            <FaCheck color="#279357" />
                            <p>Tư vấn trực tuyến</p>
                        </div>
                        <div className={styles.featureItem}>
                            <FaCheck color="#279357" />
                            <p>Theo dõi cân nặng & dinh dưỡng</p>
                        </div>
                        <div className={styles.featureItem}>
                            <FaCheck color="#279357" />
                            <p>Nhận thông báo quan trọng</p>
                        </div>
                    </div>
                    <button className={styles.button}>
                        Nâng cấp ngay
                    </button>
                </div>

                {/* Gói Cao Cấp */}
                <div className={styles.plan}>
                    <div className={styles.bestValue}>Phổ biến nhất</div>
                    <div className={styles.planTitle}>
                        <FaCrown size={24} />
                        <h2>Cao Cấp</h2>
                    </div>
                    <div className={styles.features}>
                        <div className={styles.featureItem}>
                            <FaCheck color="#279357" />
                            <p>Tất cả quyền lợi gói Tiện Ích</p>
                        </div>
                        <div className={styles.featureItem}>
                            <FaCheck color="#279357" />
                            <p>Tư vấn bác sĩ 24/7</p>
                        </div>
                        <div className={styles.featureItem}>
                            <FaCheck color="#279357" />
                            <p>Gói khám thai định kỳ</p>
                        </div>
                        <div className={styles.featureItem}>
                            <FaCheck color="#279357" />
                            <p>Hỗ trợ đặt lịch ưu tiên</p>
                        </div>
                        <div className={styles.featureItem}>
                            <FaCheck color="#279357" />
                            <p>Quà tặng cho mẹ và bé</p>
                        </div>
                        <div className={styles.featureItem}>
                            <FaCheck color="#279357" />
                            <p>Chế độ chăm sóc đặc biệt</p>
                        </div>
                    </div>
                    <button className={styles.button}>
                        Trải nghiệm ngay
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Membership;
