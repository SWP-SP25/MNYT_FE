'use client'
import { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import Link from 'next/link';

const AppNavBar = () => {
    const [search, setSearch] = useState("");

    const handleSearch = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        console.log("Tìm kiếm:", search);
        // Chức năng tìm kiếm ở đây
    };
    return (
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container>
                <Link href="/" passHref legacyBehavior>
                    <Navbar.Brand>Mầm Non Yêu Thương</Navbar.Brand>
                </Link>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    {/*Begin of Search bar */}
                    <Form className="d-flex me-auto" onSubmit={handleSearch}>
                        <FormControl
                            type="search"
                            placeholder="Chúng tôi có thể giúp gì cho bạn"
                            className="me-2"
                            aria-label="Search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <Button variant="outline-success" type="submit">🔍</Button>
                    </Form>
                    {/*End of search bar*/}
                    {/*Begin of menu nav*/}
                    <Nav className="me-auto">
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
                    {/*End of menu nav*/}
                    {/*Begin of Login/Register*/}
                    <Nav className="ms-auto d-flex align-items-center">
                        <Link href="/login" passHref legacyBehavior>
                            <Nav.Link>Đăng Nhập</Nav.Link>
                        </Link>
                        <Link href="/register" passHref legacyBehavior>
                            <Nav.Link>Đăng Ký</Nav.Link>
                        </Link>
                    </Nav>
                    {/*End of Login/Register*/}
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default AppNavBar;