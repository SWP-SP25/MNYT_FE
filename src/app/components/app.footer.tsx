'use client';
import { FaFacebook, FaInstagram, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import "./styles/footer.css";

const AppFooter = () => {
    return (
        <footer className="custom-footer">
            <div className="footer-content">
                <div className="footer-section">
                    <h3>Về Chúng Tôi</h3>
                    <p>Mầm Non Yêu Thương - Đồng hành cùng mẹ trong hành trình thai kỳ và chăm sóc em bé.</p>
                </div>
                
                <div className="footer-section">
                    <h3>Liên Hệ</h3>
                    <a href="tel:+84123456789"><FaPhone /> 0123 456 789</a>
                    <a href="mailto:contact@mamnonyeuthuong.com"><FaEnvelope /> contact@mamnonyeuthuong.com</a>
                    <p><FaMapMarkerAlt /> 123 Đường ABC, Quận XYZ, TP.HCM</p>
                </div>
                
                <div className="footer-section">
                    <h3>Dịch Vụ</h3>
                    <a href="/reminder">Nhắc nhở lịch khám</a>
                    <a href="/tracking">Theo dõi thai kỳ</a>
                    <a href="/nutrition">Dinh dưỡng cho mẹ</a>
                    <a href="/community">Cộng đồng mẹ bầu</a>
                </div>
                
                <div className="footer-section">
                    <h3>Kết Nối</h3>
                    <div className="social-links">
                        <a href="https://www.facebook.com/tran.quang.thuan.24692/?locale=vi_VN" target="_blank" rel="noopener noreferrer">
                            <FaFacebook size={20} />
                        </a>
                        <a href="https://www.instagram.com/phoenixzmusic/" target="_blank" rel="noopener noreferrer">
                            <FaInstagram size={20} />
                        </a>
                    </div>
                </div>
            </div>
            
            <div className="footer-bottom">
                © 2025 Mầm Non Yêu Thương. All Rights Reserved.
            </div>
        </footer>
    );
}

export default AppFooter;
