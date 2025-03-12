'use client';
import { useState, useRef, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import Link from 'next/link';
import Image from 'next/image';
import Logo from '@/app/img/Logo.ico';
import './app-navbar.css'; // Import CSS thông thường
import { BsBell, BsSearch } from 'react-icons/bs';
import { Overlay, Popover } from 'react-bootstrap';
import { useAuth } from '@/hooks/useAuth';
import { AuthRequired } from '@/app/components/AuthRequired';

const AppNavBar = () => {
    const [search, setSearch] = useState("");
    const [showNotifications, setShowNotifications] = useState(false);
    const notificationTarget = useRef(null);
    const { user, loading, logout } = useAuth();
    const [showAccountPopup, setShowAccountPopup] = useState(false);
    const accountTarget = useRef(null);

    const handleSearch = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        console.log("Tìm kiếm:", search);
        // Chức năng tìm kiếm ở đây
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
                    {/* Begin of Search bar */}
                    <Form className="search-form" onSubmit={handleSearch}>
                        <FormControl
                            type="search"
                            placeholder="Chúng tôi có thể giúp gì cho bạn"
                            className="search-input"
                            aria-label="Search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <Button className="search-btn" type="submit">
                            <BsSearch />
                        </Button>
                    </Form>
                    {/* End of search bar */}
                    {/* Begin of menu nav */}
                    <Nav className="nav-links">
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
                            <Link href="/membership" passHref legacyBehavior>
                                <Nav.Link>Membership</Nav.Link>
                            </Link>
                        </AuthRequired>
                    </Nav>
                    {/* End of menu nav */}
                    {/* Begin of Login/Register */}
                    <Nav className="auth-section">
                        <div ref={notificationTarget}>
                            <Nav.Link
                                className="notification-bell"
                                onClick={() => setShowNotifications(!showNotifications)}
                            >
                                <BsBell />
                            </Nav.Link>
                        </div>

                        <Overlay
                            target={notificationTarget.current}
                            show={showNotifications}
                            placement="bottom"
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

                        <div className="d-flex align-items-center gap-3">
                            {loading ? (
                                <span className="text-secondary small">Đang tải...</span>
                            ) : user ? (
                                <div className="d-flex align-items-center gap-3">
                                    <span
                                        ref={accountTarget}
                                        className="text-secondary small"
                                        onClick={() => setShowAccountPopup(!showAccountPopup)}
                                    >
                                        Xin chào, <span className="fw-medium text-dark">
                                            {user.fullName || user.userName || 'Người dùng'}
                                        </span>
                                    </span>
                                    <button
                                        onClick={() => logout()}
                                        className="btn btn-outline-secondary btn-sm rounded-pill"
                                    >
                                        Đăng xuất
                                    </button>
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
                placement="bottom"
                rootClose
                onHide={() => setShowAccountPopup(false)}
            >
                <Popover id="account-popover">
                    <Popover.Header as="h3">Quản lý tài khoản</Popover.Header>
                    <Popover.Body>
                        <div className="account-management">
                            <Link href="/account" passHref legacyBehavior>
                                <a onClick={() => setShowAccountPopup(false)}>Quản lý tài khoản</a>
                            </Link>
                            {/* Thêm các tùy chọn khác nếu cần */}
                        </div>
                    </Popover.Body>
                </Popover>
            </Overlay>
            {/* End of pop-up quản lý tài khoản */}
        </Navbar>
    );
}

export default AppNavBar;