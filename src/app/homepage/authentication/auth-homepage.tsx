'use client';
import { useAuth } from "@/hooks/useAuth";
import styles from "./auth-homepage.module.css";
import AppSlider from "../../components/slider/app-slider";
import Link from "next/link";
import Image from "next/image";
import { FaCalendarAlt, FaBabyCarriage, FaBookMedical, FaUserMd } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import PregnancySetupForm from '@/app/components/pregnancy-form/pregnancy-setup-form';
import { Pregnancy } from '@/types/pregnancy';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

const AuthenticatedHomePage = () => {
    const { user } = useAuth();
    const router = useRouter();
    const [hasPregnancy, setHasPregnancy] = useState<boolean>(false);
    const [showPregnancyForm, setShowPregnancyForm] = useState<boolean>(false);

    useEffect(() => {
        if (user) {
            // Kiểm tra xem người dùng đã có pregnancy chưa
            const pregnancyData = Cookies.get('pregnancy');
            if (pregnancyData) {
                setHasPregnancy(true);
            }
        }
    }, [user]);

    // Xử lý sau khi tạo pregnancy thành công
    const handlePregnancyComplete = (pregnancy: Pregnancy) => {
        setHasPregnancy(true);
        setShowPregnancyForm(false);
        // Có thể thêm thông báo thành công ở đây
    };

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
                        <h1>Chào Mừng Bạn Đã Quay Trở Lại!</h1>
                        <p>Đồng hành cùng mẹ trong hành trình thai kỳ và chăm sóc em bé</p>
                        <div className={styles.heroButtons}>
                            {hasPregnancy ? (
                                <>
                                    <Link href="/dashboard" className={styles.primaryButton}>
                                        Xem Thai Kỳ
                                    </Link>
                                    <Link href="/reminder" className={styles.secondaryButton}>
                                        Xem Lịch Nhắc
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={() => setShowPregnancyForm(true)}
                                        className={styles.primaryButton}
                                    >
                                        Tạo Thai Kỳ
                                    </button>
                                    <Link href="/blog" className={styles.secondaryButton}>
                                        Đọc Blog
                                    </Link>
                                </>
                            )}
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

                {/* Pregnancy Setup Form Modal */}
                {showPregnancyForm && (
                    <div className={styles.modalOverlay}>
                        <div className={styles.modalContent}>
                            <button
                                className={styles.closeButton}
                                onClick={() => setShowPregnancyForm(false)}
                            >
                                &times;
                            </button>
                            <PregnancySetupForm
                                user={user}
                                onComplete={handlePregnancyComplete}
                            />
                        </div>
                    </div>
                )}

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
                        {hasPregnancy ? (
                            <Link href="/dashboard" className={styles.ctaButton}>
                                Đi Đến Dashboard
                            </Link>
                        ) : (
                            <button
                                onClick={() => setShowPregnancyForm(true)}
                                className={styles.ctaButton}
                            >
                                Tạo Thai Kỳ Ngay
                            </button>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default AuthenticatedHomePage;