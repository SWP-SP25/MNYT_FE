'use client';
import { FaFacebook, FaInstagram, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import "./app-footer.css";
import { AuthRequired } from '@/app/components/AuthRequired';
import Link from 'next/link';
import Image from 'next/image';
import { Container, Row, Col } from 'react-bootstrap';

const AppFooter = () => {
    return (
        <footer className="custom-footer">
            <Container>
                <Row>
                    <Col md={3}>
                        <div className="footer-section">
                            <Image
                                src="/favicon.ico"
                                alt="Logo"
                                width={120}
                                height={120}
                                className="footer-logo"
                            />
                            <h2 className="main-title">
                                Mầm Non Yêu Thương
                            </h2>
                            <p className="footer-slogan">
                                Đồng hành cùng mẹ trong hành trình mang thai diệu kỳ
                            </p>
                        </div>
                    </Col>

                    <Col md={2}>
                        <div className="footer-section">
                            <h3>Dịch vụ</h3>
                            <ul>
                                <li>
                                    <AuthRequired>
                                        <span className="shortcut-link">
                                            <Link href="/reminder" passHref legacyBehavior>
                                                Nhắc nhở
                                            </Link>
                                        </span>
                                    </AuthRequired>
                                </li>
                                <li>
                                    <AuthRequired>
                                        <span className="shortcut-link">
                                            <Link href="/dashboard" passHref legacyBehavior>
                                                Theo dõi
                                            </Link>
                                        </span>
                                    </AuthRequired>
                                </li>
                                <li>
                                    <span className="shortcut-link">
                                        <Link href="/blog" passHref legacyBehavior>
                                            Blog
                                        </Link>
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </Col>

                    <Col md={3}>
                        <div className="footer-section contact-info">
                            <h3>Liên Hệ</h3>
                            <a href="tel:+84123456789">
                                <FaPhone /> 0123 456 789
                            </a>
                            <a href="mailto:contact@mamnonyeuthuong.com">
                                <FaEnvelope /> mamnonyeuthuong@gmail.com
                            </a>
                            <p>
                                <FaMapMarkerAlt />102 Đặng Văn Bi, Bình Thọ, Thủ Đức
                            </p>
                        </div>
                    </Col>

                    <Col md={2}>
                        <div className="footer-section">
                            <h3>Tiện ích</h3>
                            <AuthRequired>
                                <div className="shortcut-link">
                                    <Link href="/reminder" passHref legacyBehavior>
                                        Nhắc nhở lịch khám
                                    </Link>
                                </div>
                            </AuthRequired>
                            <AuthRequired>
                                <div className="shortcut-link">
                                    <Link href="/dashboard" passHref legacyBehavior>
                                        Theo dõi thai kỳ
                                    </Link>
                                </div>
                            </AuthRequired>
                            <AuthRequired>
                                <div className="shortcut-link">
                                    <Link href="/blog" passHref legacyBehavior>
                                        Dinh dưỡng cho mẹ
                                    </Link>
                                </div>
                            </AuthRequired>
                            <AuthRequired>
                                <div className="shortcut-link">
                                    <Link href="/forum" passHref legacyBehavior>
                                        Cộng đồng mẹ bầu
                                    </Link>
                                </div>
                            </AuthRequired>
                        </div>
                    </Col>

                    <Col md={2}>
                        <div className="footer-section">
                            <h3>Kết Nối</h3>
                            <div className="social-links">
                                <a href="https://www.facebook.com/BProtectedVietnam"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Facebook">
                                    <FaFacebook size={20} />
                                </a>
                                <a href="https://www.instagram.com/mevabekute/?locale=slot%2Bsitus%E3%80%90777ONE.IN%E3%80%91.ibqh&hl=en"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Instagram">
                                    <FaInstagram size={20} />
                                </a>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>

            <div className="footer-copyright">
                © {new Date().getFullYear()} Mầm Non Yêu Thương. All Rights Reserved.
            </div>
        </footer>
    );
}

export default AppFooter;
