'use client';

import React from 'react';
import { Container, Row, Col, Nav } from 'react-bootstrap';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Button, Card, CardBody } from "@nextui-org/react";
import { usePathname } from 'next/navigation';
import Link from 'next/link';

interface AdminLayoutProps {
    children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    const pathname = usePathname();

    const menuItems = [
        { name: 'Dashboard', path: '/admin' },
        { name: 'Users', path: '/admin/users' },
        { name: 'Products', path: '/admin/products' },
        { name: 'Orders', path: '/admin/orders' },
        { name: 'Settings', path: '/admin/settings' },
    ];

    return (
        <div className="admin-layout">
            <Navbar>
                <NavbarBrand>
                    <p className="font-bold text-inherit">Admin Panel</p>
                </NavbarBrand>
                <NavbarContent className="hidden sm:flex gap-4" justify="center">
                    {menuItems.map((item) => (
                        <NavbarItem key={item.path}>
                            <Link
                                href={item.path}
                                className={`text-white ${pathname === item.path ? 'font-bold' : ''}`}
                            >
                                {item.name}
                            </Link>
                        </NavbarItem>
                    ))}
                </NavbarContent>
                <NavbarContent justify="end">
                    <NavbarItem>
                        <Button color="danger" variant="flat">
                            Logout
                        </Button>
                    </NavbarItem>
                </NavbarContent>
            </Navbar>

            <Container fluid className="mt-4">
                <Row>
                    <Col md={3}>
                        <Card>
                            <CardBody>
                                <Nav className="flex-column">
                                    {menuItems.map((item) => (
                                        <Nav.Link
                                            key={item.path}
                                            href={item.path}
                                            active={pathname === item.path}
                                        >
                                            {item.name}
                                        </Nav.Link>
                                    ))}
                                </Nav>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col md={9}>
                        <Card>
                            <CardBody>
                                {children}
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default AdminLayout;