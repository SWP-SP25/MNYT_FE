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
                                Đồng hành cùng mẹ trong hành trình thai kỳ và chăm sóc em bé
                            </p>
                        </div>
                    </Col>

                    <Col md={2}>
                        <div className="footer-section">
                            <h3>Dịch vụ</h3>
                            <ul>
                                <li>
                                    <AuthRequired>
                                        <span className="shortcut-link">Nhắc nhở</span>
                                    </AuthRequired>
                                </li>
                                <li>
                                    <AuthRequired>
                                        <span className="shortcut-link">Theo dõi</span>
                                    </AuthRequired>
                                </li>
                                <li>
                                    <span className="shortcut-link">Blog</span>
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
                                <FaEnvelope /> contact@mamnonyeuthuong.com
                            </a>
                            <p>
                                <FaMapMarkerAlt /> 123 Đường ABC, Quận XYZ, TP.HCM
                            </p>
                        </div>
                    </Col>

                    <Col md={2}>
                        <div className="footer-section">
                            <h3>Tiện ích</h3>
                            <AuthRequired>
                                <div className="shortcut-link">Nhắc nhở lịch khám</div>
                            </AuthRequired>
                            <AuthRequired>
                                <div className="shortcut-link">Theo dõi thai kỳ</div>
                            </AuthRequired>
                            <AuthRequired>
                                <div className="shortcut-link">Dinh dưỡng cho mẹ</div>
                            </AuthRequired>
                            <AuthRequired>
                                <div className="shortcut-link">Cộng đồng mẹ bầu</div>
                            </AuthRequired>
                        </div>
                    </Col>

                    <Col md={2}>
                        <div className="footer-section">
                            <h3>Kết Nối</h3>
                            <div className="social-links">
                                <a href="https://www.facebook.com/tran.quang.thuan.24692/?locale=vi_VN"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Facebook">
                                    <FaFacebook size={20} />
                                </a>
                                <a href="https://www.instagram.com/phoenixzmusic/"
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
