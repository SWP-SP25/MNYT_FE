'use client'

import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Link from 'next/link';
import './app.footer.css';

const AppFooter: React.FC = () => {
    return (
        <footer className="app-footer">
            <Container>
                <Row className="footer-main">
                    <Col md={4}>
                        <h3 className="footer-title">
                            Về Mầm Non Yêu Thương
                            <div className="title-underline"></div>
                        </h3>
                        <div className="footer-contact">
                            <p>Contact: 0905456405</p>
                            <p>Email: lovelyplant@gmail.com</p>
                            <p>Hotline: 093xxx956</p>
                            <p>Địa chỉ: Linh Trung,Thủ Đức,</p>
                            <p>Thành phố Hồ Chí Minh</p>
                        </div>
                    </Col>
                    <Col md={4}>
                        <h3 className="footer-title">
                            Reminder
                            <div className="title-underline"></div>
                        </h3>
                        <div className="footer-links">
                            <p>List of Reminder</p>
                            <p>To do list</p>
                            <p>Create reminder</p>
                            <p>Export to pdf</p>
                        </div>
                    </Col>
                    <Col md={4}>
                        <h3 className="footer-title">
                            Dashboard
                            <div className="title-underline"></div>
                        </h3>
                        <div className="footer-links">
                            <p>View Dashboard</p>
                            <p>Fetal Measurements Updates</p>
                            <p>Fetal Weight Estimation</p>
                            <p>Fetal Development Milestone</p>
                        </div>
                    </Col>
                </Row>
            </Container>
            <div className="footer-copyright">
                <Container>
                    <p>© 2024 Mầm Non Yêu Thương. All Rights Reserved.</p>
                </Container>
            </div>
        </footer>
    );
};

export default AppFooter;