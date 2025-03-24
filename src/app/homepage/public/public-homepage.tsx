'use client';
import Image from "next/image";
import Link from "next/link";
import styles from "./public-homepage.module.css";
import { FaCalendarAlt, FaBabyCarriage, FaBookMedical, FaUserMd } from 'react-icons/fa';

interface HomePageProps {
    // Có thể thêm props nếu cần
}

const HomePage: React.FC<HomePageProps> = () => {
    return (
        <div className={styles.page}>
            <main className={styles.main}>
                {/* Hero Section */}
                <section className={styles.hero}>
                    <div className={styles.heroContent}>
                        <h1>Chào Mừng Đến Với Mầm Non Yêu Thương</h1>
                        <p>Đồng hành cùng mẹ trong hành trình thai kỳ và chăm sóc em bé</p>
                        <div className={styles.heroButtons}>
                            <Link href="authenticate?mode=register" className={styles.primaryButton}>
                                Đăng Ký Ngay
                            </Link>
                            <Link href="/blog" className={styles.secondaryButton}>
                                Tìm Hiểu Thêm
                            </Link>
                        </div>
                    </div>
                    <div className={styles.heroImage}>
                        <Image
                            src="/images/hero-pregnancy.jpg"
                            alt="Mẹ bầu hạnh phúc"
                            width={600}
                            height={400}
                            priority
                        />
                    </div>
                </section>

                {/* Features Section */}
                <section className={styles.features}>
                    <h2>Dịch Vụ Của Chúng Tôi</h2>
                    <div className={styles.featureGrid}>
                        <div className={styles.featureCard}>
                            <FaCalendarAlt className={styles.featureIcon} />
                            <h3>Theo Dõi Thai Kỳ</h3>
                            <p>Lịch trình chi tiết và nhắc nhở quan trọng cho từng giai đoạn thai kỳ</p>
                        </div>
                        <div className={styles.featureCard}>
                            <FaBabyCarriage className={styles.featureIcon} />
                            <h3>Chăm Sóc Em Bé</h3>
                            <p>Hướng dẫn chăm sóc và theo dõi sự phát triển của bé</p>
                        </div>
                        <div className={styles.featureCard}>
                            <FaBookMedical className={styles.featureIcon} />
                            <h3>Kiến Thức Bổ Ích</h3>
                            <p>Chia sẻ kiến thức và kinh nghiệm từ các chuyên gia</p>
                        </div>
                        <div className={styles.featureCard}>
                            <FaUserMd className={styles.featureIcon} />
                            <h3>Tư Vấn Y Tế</h3>
                            <p>Kết nối với đội ngũ bác sĩ và chuyên gia dinh dưỡng</p>
                        </div>
                    </div>
                </section>

                {/* Blog Preview Section */}
                <section className={styles.blogPreview}>
                    <h2>Bài Viết Mới Nhất</h2>
                    <div className={styles.blogGrid}>
                        {/* Có thể thêm BlogCard components ở đây */}
                        <div className={styles.blogCard}>
                            <Image
                                src="/images/blog/nutrition.jpg"
                                alt="Dinh dưỡng thai kỳ"
                                width={300}
                                height={200}
                            />
                            <div className={styles.blogContent}>
                                <h3>Dinh Dưỡng Trong Thai Kỳ</h3>
                                <p>Những thực phẩm cần thiết cho mẹ bầu...</p>
                                <Link href="/blog/nutrition" className={styles.readMore}>
                                    Đọc thêm →
                                </Link>
                            </div>
                        </div>
                        {/* Thêm các blog card khác */}
                    </div>
                </section>

                {/* CTA Section */}
                <section className={styles.cta}>
                    <div className={styles.ctaContent}>
                        <h2>Bắt Đầu Hành Trình Của Bạn</h2>
                        <p>Đăng ký ngay để nhận được những thông tin hữu ích và theo dõi thai kỳ</p>
                        <Link href="authenticate?mode=register" className={styles.ctaButton}>
                            Tham Gia Ngay
                        </Link>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default HomePage;