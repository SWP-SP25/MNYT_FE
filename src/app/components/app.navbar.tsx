'use client'
import { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
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
                <Navbar.Brand href="/">Mầm Non Yêu Thương</Navbar.Brand>
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
                        <Nav.Link href="/reminder/">Reminder</Nav.Link>
                        <Nav.Link href="/dashboard/">Dashboard</Nav.Link>
                        <Nav.Link href="/blog">Blog</Nav.Link>
                        <Nav.Link href="/membership">Membership</Nav.Link>
                    </Nav>
                    {/*End of menu nav*/}
                    {/*Begin of Login/Register*/}
                    <Nav className="ms-auto d-flex align-items-center">
                        <Nav.Link href="/login">Đăng Nhập</Nav.Link>
                        <Nav.Link href="/register">Đăng Ký</Nav.Link>
                    </Nav>
                    {/*End of Login/Register*/}
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default AppNavBar;