'use client';

import React, { useRef, useState } from 'react';
import { Sidebar } from './sidebar';
import Image from 'next/image';
import Logo from '@/app/img/Logo.ico';
import { BsBell } from 'react-icons/bs';
import styles from './admin-layout.module.css';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { Nav } from 'react-bootstrap';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
    const { user, loading, logout } = useAuth();
    const [showAccountPopup, setShowAccountPopup] = useState(false);
    const accountTarget = useRef(null);
    return (
        <div className={styles.adminLayout}>
            <Sidebar />
            <main className={styles.mainContent}>
                {/* Admin Header */}
                <header className={styles.adminHeader}>
                    <div className={styles.headerLeft}>
                        <div className={styles.logo}>
                            <Image src={Logo} alt="Logo" width={40} height={40} />
                            <span>Mầm Non Yêu Thương</span>
                        </div>
                    </div>
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
                                            {user.fullName || user.userName || 'Admin System'}
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
                    {/* <div className={styles.headerRight}>
                        <div className={styles.userInfo}>
                            <span>System Admin</span>
                            <Image
                                src="/admin-avatar.png" // Thêm ảnh avatar admin vào public folder
                                alt="Admin"
                                width={40}
                                height={40}
                                className={styles.avatar}
                            />
                        </div>
                        <button className={styles.notificationBtn}>
                            <BsBell />
                        </button>
                    </div> */}
                </header>

                {/* Main Content */}
                <div className={styles.contentWrapper}>
                    {children}
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;