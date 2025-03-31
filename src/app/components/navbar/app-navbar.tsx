'use client';
import { useState, useRef, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Link from 'next/link';
import Image from 'next/image';
import Logo from '@/app/img/Logo.ico';
import './app-navbar.css';
import { BsBell, BsGear, BsChevronDown, BsBoxArrowRight } from 'react-icons/bs';
import { FaHeart, FaCrown, FaBaby } from 'react-icons/fa';
import { Overlay, Popover } from 'react-bootstrap';
import { useAuth } from '@/hooks/useAuth';
import { AuthRequired } from '@/app/components/AuthRequired';
import { getUserInfo } from '@/utils/getUserInfo';
const AppNavBar = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationTarget = useRef(null);
  const { user, loading, logout } = useAuth();
  const [showAccountPopup, setShowAccountPopup] = useState(false);
  const accountTarget = useRef(null);
  const [showUserInfoPopup, setShowUserInfoPopup] = useState(false);
  const userInfoTarget = useRef(null);
  const [membershipPlan, setMembershipPlan] = useState('Đang tải...');
  const [membershipLoading, setMembershipLoading] = useState(false);
  const [membershipId, setMembershipId] = useState(1); // Mặc định là gói cơ bản
  const [membershipEndDate, setMembershipEndDate] = useState('');
  const userInfo = getUserInfo(user);
  // Helper function to get the user name
  // Function to get membership icon based on plan
  const getMembershipIcon = () => {
    switch (membershipId) {
      case 1:
        return <FaBaby className="membership-icon basic" />;
      case 2:
        return <FaHeart className="membership-icon premium" />;
      case 5:
        return <FaCrown className="membership-icon vip" />;
      default:
        return <FaBaby className="membership-icon basic" />;
    }
  };

  // Function to format date for display
  const formatDate = (dateString: any) => {
    if (!dateString) return '';

    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Function to fetch and format membership data
  const fetchMembershipData = async (userId: number) => {
    if (!userId) return;

    setMembershipLoading(true);
    try {
      const response = await fetch(`https://api-mnyt.purintech.id.vn/api/AccountMembership/GetActive/${userId}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      // Truy cập đúng vào trường data.data
      const membershipData = data.data;
      console.log('Membership data:', membershipData);

      if (membershipData) {
        const membershipIdFromApi = membershipData.membershipPlanId;
        setMembershipId(membershipIdFromApi || 1);

        // Lưu ngày kết thúc
        if (membershipData.endDate) {
          setMembershipEndDate(membershipData.endDate);
        } else {
          setMembershipEndDate('');
        }

        switch (membershipIdFromApi) {
          case 1:
            setMembershipPlan('Gói cơ bản');
            break;
          case 2:
            setMembershipPlan('Gói tiện ích');
            break;
          case 5:
            setMembershipPlan('Gói cao cấp');
            break;
          default:
            setMembershipPlan('Gói cơ bản');
        }
      } else {
        setMembershipId(1);
        setMembershipPlan('Gói cơ bản');
        setMembershipEndDate('');
      }
    } catch (error) {
      console.error('Error fetching membership data:', error);
      setMembershipId(1);
      setMembershipPlan('Gói cơ bản');
      setMembershipEndDate('');
    } finally {
      setMembershipLoading(false);
    }
  };

  // Effect to fetch membership data when user changes
  useEffect(() => {
    if (user) {
      console.log('User object:', user); // Log user object để kiểm tra cấu trúc
      const userId = userInfo?.id;
      console.log('Extracted user ID:', userId); // Log ID đã trích xuất
      if (userId) {
        fetchMembershipData(userId);
      } else {
        console.log('No user ID found in user object');
      }
    }
  }, [user]);

  useEffect(() => {
    const handleScroll = () => {
      const navbar = document.querySelector(".navbar");
      if (window.scrollY > 50) {
        navbar?.classList.add("scrolled");
      } else {
        navbar?.classList.remove("scrolled");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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
                      {userInfo?.fullName || "Người dùng mới"}
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
                  <Link href="/authenticate" passHref legacyBehavior>
                    <Nav.Link className="auth-link">
                      Đăng Nhập
                    </Nav.Link>
                  </Link>
                  <span className="divider">|</span>
                  <Link href="/authenticate?mode=register" passHref legacyBehavior>
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
              <Link href="/membership" passHref legacyBehavior>
                <a className="membership-info-link" onClick={() => setShowAccountPopup(false)}>
                  <div className="membership-info">
                    {membershipLoading ? (
                      <>
                        <span className="loading-spinner"></span>
                        <span className="loading-text">Đang tải...</span>
                      </>
                    ) : (
                      <>
                        {getMembershipIcon()}
                        <div className="membership-details">
                          <strong>Gói hiện tại:</strong>
                          <span className="membership-name">{membershipPlan}</span>
                          {membershipEndDate && (
                            <span className="membership-expiry">
                              Hết hạn: {formatDate(membershipEndDate)}
                            </span>
                          )}
                        </div>
                        <div className="view-more-icon">
                          <span>&rarr;</span>
                        </div>
                      </>
                    )}
                  </div>
                </a>
              </Link>
              <Link href="/account" passHref legacyBehavior>
                <a className="account-option" onClick={() => setShowAccountPopup(false)}>
                  <BsGear className="settings-icon" />
                  <span>Cài đặt tài khoản</span>
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

      {/* Pop-up thông tin người dùng */}
      <Overlay
        target={userInfoTarget.current}
        show={showUserInfoPopup}
        placement="bottom-end"
        rootClose
        onHide={() => setShowUserInfoPopup(false)}
      >
        <Popover id="user-info-popover">
          <Popover.Header as="h3">
            Thông tin người dùng
            <button
              className="close-icon-button"
              onClick={() => setShowUserInfoPopup(false)}
              title="Đóng"
            >
              &times;
            </button>
          </Popover.Header>
          <Popover.Body>
            <div className="user-info-details">
              <div className="info-row">
                <strong>Tên:</strong> {userInfo?.userName}
              </div>
              <div className="info-row">
                <strong>Gói hội viên:</strong> {membershipPlan}
              </div>
              <div className="view-profile-button">
                <Link href="/account" passHref legacyBehavior>
                  <a className="btn btn-sm btn-primary w-100">Xem trang cá nhân đầy đủ</a>
                </Link>
              </div>
            </div>
          </Popover.Body>
        </Popover>
      </Overlay>
      {/* End of pop-up thông tin người dùng */}
    </Navbar>
  );
}

export default AppNavBar;
