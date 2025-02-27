'use client'
import { useState, useRef } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import Link from 'next/link';
import Image from 'next/image';
import Logo from '@/app/img/Logo.ico';
import './app.navbar.css';
import { BsBell } from 'react-icons/bs';
import { Overlay, Popover } from 'react-bootstrap';

const AppNavBar = () => {
    const [search, setSearch] = useState("");
    const [showNotifications, setShowNotifications] = useState(false);
    const notificationTarget = useRef(null);

    const handleSearch = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        console.log("Tìm kiếm:", search);
        // Chức năng tìm kiếm ở đây
    };
    return (
        <Navbar expand="lg" className="custom-navbar">
            <Container>
                <div className="brand">
                    <Image
                        src={Logo}
                        alt="Logo"
                        width={40}
                        height={40}
                    />
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
                        <Button className="search-btn" type="submit">🔍</Button>
                    </Form>
                    {/* End of search bar */}
                    {/* Begin of menu nav */}
                    <Nav className="nav-links">
                        <Link href="/reminder" passHref legacyBehavior>
                            <Nav.Link>Reminder</Nav.Link>
                        </Link>
                        <Link href="/dashboard" passHref legacyBehavior>
                            <Nav.Link>Dashboard</Nav.Link>
                        </Link>
                        <Link href="/blog" passHref legacyBehavior>
                            <Nav.Link>Blog</Nav.Link>
                        </Link>
                        <Link href="/membership" passHref legacyBehavior>
                            <Nav.Link>Membership</Nav.Link>
                        </Link>
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
                                        {/* Đây là nơi để thêm danh sách thông báo */}
                                        <p>Không có thông báo mới</p>
                                    </div>
                                </Popover.Body>
                            </Popover>
                        </Overlay>

                        <Link href="/login" passHref legacyBehavior>
                            <Nav.Link>Đăng Nhập</Nav.Link>
                        </Link>
                        <div className="vertical-divider"></div>
                        <Link href="/register" passHref legacyBehavior>
                            <Nav.Link className="register-btn">Đăng Ký</Nav.Link>
                        </Link>
                    </Nav>
                    {/* End of Login/Register */}
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default AppNavBar;