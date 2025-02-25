'use client';
import { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import Image from 'next/image';
import "./styles/navbar.css"; // Import CSS mới chỉ dành cho Navbar
import Logo from '../auth/login/public/logo.ico';  // Điều chỉnh đường dẫn tùy theo vị trí file logo

const AppNavBar = () => {
    const [search, setSearch] = useState("");

    const handleSearch = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        console.log("Tìm kiếm:", search);
    };

    return (
        <Navbar expand="lg" className="custom-navbar">
            <Container>
                <Navbar.Brand href="/" className="brand">
                    <Image
                        src={Logo}
                        alt="Logo"
                        width={40}
                        height={40}
                        className="brand-logo"
                    />
                    <span>Mầm Non Yêu Thương</span>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">

                    {/* Thanh tìm kiếm */}
                    <Form className="search-form" onSubmit={handleSearch}>
                        <FormControl
                            type="search"
                            placeholder="Bạn cần tìm gì?"
                            className="search-input"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <Button type="submit" className="search-btn">🔍</Button>
                    </Form>

                    {/* Menu điều hướng */}
                    <Nav className="nav-links">
                        <Nav.Link href="/reminder/">Reminder</Nav.Link>
                        <Nav.Link href="/dashboard/">Dashboard</Nav.Link>
                        <Nav.Link href="/blog">Blog</Nav.Link>
                        <Nav.Link href="/membership">Membership</Nav.Link>
                    </Nav>

                    {/* Nút Đăng nhập / Đăng ký */}
                    <Nav className="auth-section">
                        <Nav.Link href="/notifications" className="notification-bell">
                            🔔
                        </Nav.Link>
                        <Nav.Link href="/auth/login">Đăng Nhập</Nav.Link>
                        <div className="vertical-divider"></div>
                        <Nav.Link href="/auth/signup">Đăng Ký</Nav.Link>
                    </Nav>

                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default AppNavBar;
