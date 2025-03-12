'use client';
import { useAuth } from "@/hooks/useAuth";
import styles from "./auth-homepage.module.css";
import AppSlider from "../../components/slider/app-slider";
import Link from "next/link";
import Image from "next/image";
import { FaCalendarAlt, FaBabyCarriage, FaBookMedical, FaUserMd } from 'react-icons/fa';


const AuthenticatedHomePage = () => {
    const { user } = useAuth();

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <AppSlider />

                {/* Hero Section */}
                <section className={styles.hero}>
                    <div className={styles.heroContent}>
                        <h1>Chào Mừng Bạn Đã Quay Trở Lại!Auth Home</h1>
                        <p>Đồng hành cùng mẹ trong hành trình thai kỳ và chăm sóc em bé</p>
                        <div className={styles.heroButtons}>
                            <Link href="/reminder" className={styles.primaryButton}>
                                Xem Lịch Nhắc
                            </Link>
                            <Link href="/blog" className={styles.secondaryButton}>
                                Đọc Blog
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
                    </div>
                </section>

                {/* CTA Section */}
                <section className={styles.cta}>
                    <div className={styles.ctaContent}>
                        <h2>Khám Phá Các Tính Năng</h2>
                        <p>Sử dụng đầy đủ các tính năng để theo dõi thai kỳ hiệu quả</p>
                        <Link href="/dashboard" className={styles.ctaButton}>
                            Đi Đến Dashboard
                        </Link>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default AuthenticatedHomePage;