'use client';
import { useState, useRef, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Link from 'next/link';
import Image from 'next/image';
import Logo from '@/app/img/Logo.ico';
import './app-navbar.css';
import { BsBell, BsGear, BsChevronDown, BsBoxArrowRight } from 'react-icons/bs';
import { Overlay, Popover } from 'react-bootstrap';
import { useAuth } from '@/hooks/useAuth';
import { AuthRequired } from '@/app/components/AuthRequired';

const AppNavBar = () => {
    const [showNotifications, setShowNotifications] = useState(false);
    const notificationTarget = useRef(null);
    const { user, loading, logout } = useAuth();
    const [showAccountPopup, setShowAccountPopup] = useState(false);
    const accountTarget = useRef(null);

    // Helper function to get the user name
    const getUserName = () => {
        if (!user) return 'Người dùng';

        // Try user.user structure first (as defined in interface)
        if (user.user && (user.user.fullName || user.user.userName)) {
            return user.user.fullName || user.user.userName;
        }

        // Fall back to direct properties if they exist
        if ((user as any).fullName || (user as any).userName) {
            return (user as any).fullName || (user as any).userName;
        }

        return 'Người dùng';
    };

    useEffect(() => {
        const handleScroll = () => {
            const navbar = document.querySelector('.navbar');
            if (window.scrollY > 50) {
                navbar?.classList.add('scrolled');
            } else {
                navbar?.classList.remove('scrolled');
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <Navbar expand="lg" className="custom-navbar">
            <Container>
                <div className="brand">
                    <Link href="/" passHref legacyBehavior>
                        <a>
                            <Image
                                src={Logo}
                                alt="Logo"
                                width={40}
                                height={40}
                            />
                        </a>
                    </Link>
                    <Link href="/" passHref legacyBehavior>
                        <Navbar.Brand>Mầm Non Yêu Thương</Navbar.Brand>
                    </Link>
                </div>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    {/* Begin of menu nav */}
                    <Nav className="nav-links me-auto">
                        <AuthRequired>
                            <Link href="/reminder" passHref legacyBehavior>
                                <Nav.Link>Reminder</Nav.Link>
                            </Link>
                        </AuthRequired>
                        <AuthRequired>
                            <Link href="/dashboard" passHref legacyBehavior>
                                <Nav.Link>Dashboard</Nav.Link>
                            </Link>
                        </AuthRequired>
                        <AuthRequired>
                            <Link href="/blog" passHref legacyBehavior>
                                <Nav.Link>Blog</Nav.Link>
                            </Link>
                        </AuthRequired>
                        <AuthRequired>
                            <Link href="/forum" passHref legacyBehavior>
                                <Nav.Link>Forum</Nav.Link>
                            </Link>
                        </AuthRequired>
                        <AuthRequired>
                            <Link href="/membership" passHref legacyBehavior>
                                <Nav.Link>Membership</Nav.Link>
                            </Link>
                        </AuthRequired>
                    </Nav>
                    {/* End of menu nav */}
                    {/* Begin of Login/Register */}
                    <Nav className="auth-section">
                        <div className="d-flex align-items-center gap-3">
                            {loading ? (
                                <span className="text-secondary small">Đang tải...</span>
                            ) : user ? (
                                <div className="user-account-section">
                                    <div className="user-greeting">
                                        Xin chào<span className="user-name">
                                            {getUserName()}
                                        </span>
                                    </div>
                                    <div ref={notificationTarget} className="notification-icon">
                                        <Nav.Link
                                            className="notification-bell"
                                            onClick={() => setShowNotifications(!showNotifications)}
                                        >
                                            <BsBell />
                                        </Nav.Link>
                                    </div>
                                    <div
                                        ref={accountTarget}
                                        className="account-dropdown-icon"
                                        onClick={() => setShowAccountPopup(!showAccountPopup)}
                                    >
                                        <BsChevronDown className="dropdown-icon" />
                                    </div>
                                </div>
                            ) : (
                                <div className="auth-buttons">
                                    <Link href="/login" passHref legacyBehavior>
                                        <Nav.Link className="auth-link">
                                            Đăng Nhập
                                        </Nav.Link>
                                    </Link>
                                    <span className="divider">|</span>
                                    <Link href="/login?mode=register" passHref legacyBehavior>
                                        <Nav.Link className="auth-link">
                                            Đăng Ký
                                        </Nav.Link>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </Nav>
                    {/* End of Login/Register */}
                </Navbar.Collapse>
            </Container>

            {/* Pop-up quản lý tài khoản */}
            <Overlay
                target={accountTarget.current}
                show={showAccountPopup}
                placement="bottom-end"
                rootClose
                onHide={() => setShowAccountPopup(false)}
            >
                <Popover id="account-popover">
                    <Popover.Header as="h3">
                        Quản lý tài khoản
                        <button
                            className="logout-icon-button"
                            onClick={() => {
                                logout();
                                setShowAccountPopup(false);
                            }}
                            title="Đăng xuất"
                        >
                            <BsBoxArrowRight />
                        </button>
                    </Popover.Header>
                    <Popover.Body>
                        <div className="account-management">
                            <Link href="/account" passHref legacyBehavior>
                                <a className="account-option" onClick={() => setShowAccountPopup(false)}>
                                    Thông tin cá nhân
                                </a>
                            </Link>
                            <Link href="/account/settings" passHref legacyBehavior>
                                <a className="account-option" onClick={() => setShowAccountPopup(false)}>
                                    Cài đặt tài khoản
                                </a>
                            </Link>
                        </div>
                    </Popover.Body>
                </Popover>
            </Overlay>

            {/* Pop-up thông báo */}
            <Overlay
                target={notificationTarget.current}
                show={showNotifications}
                placement="bottom-end"
                rootClose
                onHide={() => setShowNotifications(false)}
            >
                <Popover id="notifications-popover">
                    <Popover.Header as="h3">Thông báo</Popover.Header>
                    <Popover.Body>
                        <div className="notifications-list">
                            <p>Không có thông báo mới</p>
                        </div>
                    </Popover.Body>
                </Popover>
            </Overlay>
            {/* End of pop-up thông báo */}
        </Navbar>
    );
}

export default AppNavBar;