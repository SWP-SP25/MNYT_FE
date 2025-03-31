"use client";

import React, { useRef, useState } from "react";
import { Sidebar } from "./sidebar";
import Image from "next/image";
import Logo from "@/app/img/Logo.ico";
import { BsBell, BsChevronDown, BsBoxArrowRight } from "react-icons/bs";
import styles from "./admin-layout.module.css";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { Nav, Navbar, Overlay, Popover } from "react-bootstrap";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, logout } = useAuth();
  const [showAccountPopup, setShowAccountPopup] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const accountTarget = useRef(null);
  const notificationTarget = useRef(null);

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

  return (
    <div className={styles.adminLayout}>
      <Sidebar />
      <main className={styles.mainContent}>
        {/* Admin Header */}
        <header className={styles.adminHeader}>
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
          <div className={styles.headerRight}>
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
                    <button
                      className={styles.notificationBtn}
                      onClick={() => setShowNotifications(!showNotifications)}
                    >
                      <BsBell />
                    </button>
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
                  <Link href="/authenticate" passHref legacyBehavior>
                    <Nav.Link className="auth-link">Đăng Nhập</Nav.Link>
                  </Link>
                  <span className="divider">|</span>
                  <Link href="/authenticate?mode=register" passHref legacyBehavior>
                    <Nav.Link className="auth-link">Đăng Ký</Nav.Link>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className={styles.contentWrapper}>{children}</div>
      </main>

      {/* Account Management Popover */}
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

      {/* Notifications Popover */}
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
    </div>
  );
};

export default AdminLayout;
