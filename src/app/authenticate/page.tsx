"use client";

import React, { useEffect, useState, useRef, Suspense } from "react";
import { BsPersonFill, BsEnvelopeFill, BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import { IoMdCheckmarkCircle, IoMdCloseCircle } from "react-icons/io";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useFetch } from "@/hooks/useFetch";
import Cookies from "js-cookie";

import styles from './page.module.css';
import fpStyles from './forgot-password.module.css';

// Khai báo kiểu dữ liệu cho thông báo
type NotificationType = 'success' | 'error' | 'info' | '';
type NotificationMessage = string;

// Tách phần xử lý searchParams ra component riêng
function SearchParamsWrapper({ onInit }: { onInit: (isRegister: boolean) => void }) {
    const { useSearchParams } = require('next/navigation');
    const searchParams = useSearchParams();

    useEffect(() => {
        const mode = searchParams.get('mode');
        onInit(mode === 'register');
    }, [searchParams, onInit]);

    return null;
}

const LoginPage = () => {
    const [isActive, setIsActive] = useState(false);
    const [isForgotActive, setIsForgotActive] = useState(false);
    const [forgotStep, setForgotStep] = useState(1);
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
    const { login, loading: authLoading, error: authError } = useAuth();
    const { fetchData, loading: fetchLoading, error: fetchError } = useFetch();
    const [username, setUsername] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");

    // Thêm state cho thông báo
    const [notification, setNotification] = useState<{
        type: NotificationType,
        message: NotificationMessage
    }>({ type: '', message: '' });

    // Add state to track if user is logged in
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Hàm hiển thị thông báo cải tiến
    const showNotification = (type: NotificationType, message: NotificationMessage) => {
        // Xóa thông báo hiện tại nếu có
        setNotification({ type: '', message: '' });

        // Cho phép DOM cập nhật trước khi hiển thị thông báo mới
        setTimeout(() => {
            setNotification({ type, message });

            // Tự động ẩn thông báo sau 4 giây
            setTimeout(() => {
                setNotification({ type: '', message: '' });
            }, 4000);
        }, 10);
    };

    // Theo dõi lỗi từ useAuth và hiển thị trong popup
    useEffect(() => {
        if (authError) {
            showNotification('error', authError);
        }
    }, [authError]);

    // Theo dõi lỗi từ useFetch và hiển thị trong popup
    useEffect(() => {
        if (fetchError) {
            showNotification('error', fetchError);
        }
    }, [fetchError]);

    const [loginData, setLoginData] = useState({
        username: '',
        password: '',
        rememberMe: false,
    });

    const [registerData, setRegisterData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'Member',
    });

    const [registerError, setRegisterError] = useState("");

    // Callback để nhận giá trị từ SearchParamsWrapper
    const handleInitFromParams = React.useCallback((isRegister: boolean) => {
        if (isRegister) {
            setIsActive(true);
        }
    }, []);

    // Modified function to check if user is already logged in
    useEffect(() => {
        const checkLoggedInStatus = () => {
            const userData = Cookies.get('user');
            if (userData) {
                try {
                    const user = JSON.parse(userData);
                    setIsLoggedIn(true);

                    // Show notification
                    showNotification('info', 'Bạn đã đăng nhập rồi! Đang chuyển hướng...');

                    // Redirect after showing notification
                    setTimeout(() => {
                        // Redirect to admin page if admin, otherwise to home page
                        if (user.role === 'Admin') {
                            router.push('/admin');
                        } else {
                            router.push('/');
                        }
                    }, 2000);
                } catch (error) {
                    // Clear invalid cookie
                    Cookies.remove('user');
                    setIsLoggedIn(false);
                }
            }
        };

        checkLoggedInStatus();
    }, [router]);

    const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setLoginData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setRegisterData(prev => ({
            ...prev,
            [name]: value
        }));
        setRegisterError("");
    };

    const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await login({
                emailOrUsername: loginData.username,
                password: loginData.password
            });

            // Hiển thị thông báo đăng nhập thành công
            showNotification('success', 'Đăng nhập thành công!');

            // Lấy thông tin user từ cookie sau khi đăng nhập
            const userData = Cookies.get('user');
            if (userData) {
                const user = JSON.parse(userData);

                // Kiểm tra membership của user
                try {
                    const membershipResponse = await fetch(`https://api-mnyt.purintech.id.vn/api/AccountMembership/GetActive/${user.id}`);

                    // Chỉ tiếp tục xử lý nếu request thành công
                    if (membershipResponse.ok) {
                        const membershipData = await membershipResponse.json();

                        // Chỉ tạo membership mới nếu không có active membership
                        if (membershipData && membershipData.data === null) {
                            console.log('No active membership found, creating one...');
                            try {
                                const createMembershipResponse = await fetch('https://api-mnyt.purintech.id.vn/api/CashPayment', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({
                                        accountId: user.id,
                                        membershipPlanId: 1
                                    })
                                });

                                if (createMembershipResponse.ok) {
                                    console.log('Membership created successfully');
                                } else {
                                    console.error('Failed to create membership');
                                }
                            } catch (createError) {
                                // Bắt lỗi tạo membership nhưng vẫn cho phép đăng nhập
                                console.error('Error creating membership:', createError);
                            }
                        } else {
                            console.log('Active membership exists, proceeding with login');
                        }
                    } else {
                        // Nếu API check membership lỗi, vẫn cho phép đăng nhập
                        console.log('Membership check returned status:', membershipResponse.status);
                    }
                } catch (err) {
                    // Bắt lỗi nhưng vẫn cho phép đăng nhập tiếp tục
                    console.error('Error during membership check, proceeding with login:', err);
                }

                // Chuyển hướng sau 1 giây để hiển thị thông báo
                setTimeout(() => {
                    // Nếu là Admin thì chuyển đến trang admin
                    if (user.role === 'Admin') {
                        router.push('/admin');
                    } else {
                        router.push('/');
                    }
                }, 1000);
            }

            if (loginData.rememberMe) {
                Cookies.set('rememberMe', 'true');
            }
        } catch (err) {
            console.error('Lỗi đăng nhập:', err);
            // Lấy thông báo lỗi từ error object nếu có
            const errorMessage = err instanceof Error ? err.message : 'Lỗi đăng nhập không xác định';
            showNotification('error', errorMessage);
        }
    };

    const handleRegisterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (registerData.password !== registerData.confirmPassword) {
            showNotification('error', 'Mật khẩu xác nhận không khớp');
            return;
        }

        try {
            await fetchData("https://api-mnyt.purintech.id.vn/api/Authentication/register", {
                method: "POST",
                body: JSON.stringify(registerData),
            });

            // Hiển thị thông báo đăng ký thành công
            showNotification('success', 'Đăng ký thành công! Bây giờ bạn có thể đăng nhập.');

            // Chuyển về chế độ đăng nhập sau 1 giây
            setTimeout(() => {
                setIsActive(false);
            }, 1000);

        } catch (err) {
            console.error('Lỗi đăng ký:', err);
            // Lấy thông báo lỗi từ error object nếu có
            const errorMessage = err instanceof Error ? err.message : 'Lỗi đăng ký không xác định';
            showNotification('error', errorMessage);
        }
    };

    const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (forgotStep === 1) {
            // Bước 1: Kiểm tra username
            if (!username) {
                showNotification('error', 'Vui lòng nhập tên đăng nhập');
                return;
            }

            try {
                // Không cần log phức tạp ở đây vì đây là GET request
                const response = await fetchData(
                    `https://api-mnyt.purintech.id.vn/api/Accounts/check-exists?username=${username}&email=null`,
                    { method: "GET" }
                ) as { data: boolean };

                if (response.data === true) {
                    setForgotStep(2);
                    showNotification('success', 'Vui lòng đặt mật khẩu mới');
                } else {
                    showNotification('error', 'Tài khoản không tồn tại');
                }
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Lỗi kiểm tra tài khoản';
                showNotification('error', errorMessage);
            }
        } else if (forgotStep === 2) {
            // Bước 2: Đặt lại mật khẩu
            if (!newPassword || !confirmNewPassword) {
                showNotification('error', 'Vui lòng nhập đầy đủ thông tin');
                return;
            }

            if (newPassword !== confirmNewPassword) {
                showNotification('error', 'Mật khẩu xác nhận không khớp');
                return;
            }

            // Tạo body request
            const requestBody = {
                userNameOrEmail: username,
                newPassword: newPassword,
                confirmNewPassword: confirmNewPassword
            };

            // Log dữ liệu body trước khi gửi
            console.log("Body request reset-password:", requestBody);

            try {
                const response = await fetchData(
                    "https://api-mnyt.purintech.id.vn/api/Accounts/reset-password",
                    {
                        method: "POST",
                        body: JSON.stringify(requestBody),
                    }
                ) as { data: boolean, success: boolean, message: string };

                if (response.data === true || response.success === true) {
                    showNotification('success', 'Đổi mật khẩu thành công');
                    setTimeout(() => {
                        resetForgotPasswordForm();
                    }, 2000);
                } else {
                    showNotification('error', response.message || 'Đặt lại mật khẩu thất bại');
                }
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Lỗi đặt lại mật khẩu';
                showNotification('error', errorMessage);
            }
        }
    };

    // 3. Cập nhật hàm khi quay lại đăng nhập
    const handleBackToLogin = () => {
        setIsForgotActive(false);
        setForgotStep(1);
        setUsername("");
        setNewPassword("");
        setConfirmNewPassword("");
    };

    // 4. Cập nhật sau khi đặt lại mật khẩu thành công
    const resetForgotPasswordForm = () => {
        setIsForgotActive(false);
        setForgotStep(1);
        setUsername("");
        setNewPassword("");
        setConfirmNewPassword("");
    };

    // Modify the return statement to show a minimal UI if already logged in
    if (isLoggedIn) {
        return (
            <div className={styles.redirectContainer}>
                {notification.type && (
                    <div className={`${styles.notification} ${styles[notification.type]}`}>
                        {notification.type === 'success' ? (
                            <IoMdCheckmarkCircle className={styles.notificationIcon} />
                        ) : notification.type === 'error' ? (
                            <IoMdCloseCircle className={styles.notificationIcon} />
                        ) : (
                            <IoMdCheckmarkCircle className={styles.notificationIcon} />
                        )}
                        <span>{notification.message}</span>
                        <button
                            className={styles.closeNotification}
                            onClick={() => setNotification({ type: '', message: '' })}
                        >
                            &times;
                        </button>
                    </div>
                )}
                <div className={styles.redirectMessage}>
                    <h2>Bạn đã đăng nhập rồi</h2>
                    <p>Đang chuyển hướng</p>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Bọc component sử dụng useSearchParams trong Suspense */}
            <Suspense fallback={null}>
                <SearchParamsWrapper onInit={handleInitFromParams} />
            </Suspense>

            <div className={`${styles.container} ${isActive ? styles.active : ''} ${isForgotActive ? styles.forgotActive : ''}`}>
                {/* Hiển thị thông báo */}
                {notification.type && (
                    <div className={`${styles.notification} ${styles[notification.type]}`}>
                        {notification.type === 'success' ? (
                            <IoMdCheckmarkCircle className={styles.notificationIcon} />
                        ) : notification.type === 'error' ? (
                            <IoMdCloseCircle className={styles.notificationIcon} />
                        ) : (
                            <IoMdCheckmarkCircle className={styles.notificationIcon} />
                        )}
                        <span>{notification.message}</span>
                        <button
                            className={styles.closeNotification}
                            onClick={() => setNotification({ type: '', message: '' })}
                        >
                            &times;
                        </button>
                    </div>
                )}

                {/* Login Form */}
                <div className={`${styles['form-box']} ${styles.login}`}>
                    <form onSubmit={handleLoginSubmit}>
                        <h1>Đăng nhập</h1>

                        <div className={styles['input-box']}>
                            <input
                                type="text"
                                name="username"
                                placeholder="Tên đăng nhập"
                                value={loginData.username}
                                onChange={handleLoginChange}
                                required
                            />
                            <i><BsPersonFill /></i>
                        </div>

                        <div className={styles['input-box']}>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Mật khẩu"
                                value={loginData.password}
                                onChange={handleLoginChange}
                                required
                            />
                            <i className={styles['password-icon']} onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <BsEyeSlashFill /> : <BsEyeFill />}
                            </i>
                        </div>

                        <div className={styles['remember-forgot']}>
                            <div className={styles['checkbox-wrapper']}>
                                <input
                                    type="checkbox"
                                    id="rememberMe"
                                    name="rememberMe"
                                    checked={loginData.rememberMe}
                                    onChange={handleLoginChange}
                                />
                                <label htmlFor="rememberMe">Ghi nhớ đăng nhập</label>
                            </div>

                            <button
                                type="button"
                                className={styles['forgot-link']}
                                onClick={() => setIsForgotActive(true)}
                            >
                                Quên mật khẩu?
                            </button>
                        </div>

                        <button type="submit" className={styles.btn} disabled={authLoading}>
                            {authLoading ? "Đang xử lý..." : "Đăng nhập"}
                        </button>
                    </form>
                </div>

                {/* Register Form */}
                <div className={`${styles['form-box']} ${styles.register}`}>
                    <form onSubmit={handleRegisterSubmit}>
                        <h1>Đăng ký</h1>

                        <div className={styles['input-container']}>
                            <div className={styles['input-box']}>
                                <input
                                    type="text"
                                    name="username"
                                    placeholder="Tên đăng nhập"
                                    value={registerData.username}
                                    onChange={handleRegisterChange}
                                    required
                                />
                                <i><BsPersonFill /></i>
                            </div>

                            <div className={styles['input-box']}>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    value={registerData.email}
                                    onChange={handleRegisterChange}
                                    required
                                />
                                <i><BsEnvelopeFill /></i>
                            </div>

                            <div className={styles['input-box']}>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Mật khẩu"
                                    value={registerData.password}
                                    onChange={handleRegisterChange}
                                    required
                                />
                                <i
                                    className={styles['password-icon']}
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <BsEyeSlashFill /> : <BsEyeFill />}
                                </i>
                            </div>

                            <div className={styles['input-box']}>
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    placeholder="Xác nhận mật khẩu"
                                    value={registerData.confirmPassword}
                                    onChange={handleRegisterChange}
                                    required
                                />
                                <i
                                    className={styles['password-icon']}
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? <BsEyeSlashFill /> : <BsEyeFill />}
                                </i>
                            </div>
                        </div>

                        <button type="submit" className={styles.btn} disabled={fetchLoading}>
                            {fetchLoading ? "Đang xử lý..." : "Đăng ký"}
                        </button>
                    </form>
                </div>
                <div className={styles.forgotPasswordContainer}>
                    <div className={fpStyles.fpContainer}>
                        <h1 className={fpStyles.fpTitle}>Khôi phục mật khẩu</h1>
                        <p className={fpStyles.fpSubtitle}>
                            {forgotStep === 1
                                ? "Nhập tên đăng nhập để bắt đầu quá trình đặt lại mật khẩu"
                                : "Vui lòng tạo mật khẩu mới cho tài khoản của bạn"}
                        </p>

                        <form className={fpStyles.fpForm} onSubmit={handleForgotPasswordSubmit}>
                            {forgotStep === 1 ? (
                                <div className={fpStyles.fpInputGroup}>
                                    <input
                                        type="text"
                                        placeholder="Tên đăng nhập"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                        className={fpStyles.fpInput}
                                    />
                                    <i className={fpStyles.fpInputIcon}><BsPersonFill /></i>
                                </div>
                            ) : (
                                <>
                                    <div className={fpStyles.fpInputGroup}>
                                        <input
                                            type={showNewPassword ? "text" : "password"}
                                            placeholder="Mật khẩu mới"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            required
                                            className={fpStyles.fpInput}
                                        />
                                        <i
                                            className={fpStyles.fpInputIcon}
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                        >
                                            {showNewPassword ? <BsEyeSlashFill /> : <BsEyeFill />}
                                        </i>
                                    </div>
                                    <div className={fpStyles.fpInputGroup}>
                                        <input
                                            type={showConfirmNewPassword ? "text" : "password"}
                                            placeholder="Xác nhận mật khẩu mới"
                                            value={confirmNewPassword}
                                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                                            required
                                            className={fpStyles.fpInput}
                                        />
                                        <i
                                            className={fpStyles.fpInputIcon}
                                            onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                                        >
                                            {showConfirmNewPassword ? <BsEyeSlashFill /> : <BsEyeFill />}
                                        </i>
                                    </div>
                                </>
                            )}

                            <button type="submit" className={fpStyles.fpButton}>
                                {forgotStep === 1 ? "Tiếp tục" : "Đặt lại mật khẩu"}
                            </button>

                            <div className={fpStyles.fpBackLink}>
                                <button
                                    type="button"
                                    className={fpStyles.fpBackButton}
                                    onClick={() => {
                                        setIsForgotActive(false);
                                        setForgotStep(1);
                                        setUsername("");
                                        setNewPassword("");
                                        setConfirmNewPassword("");
                                    }}
                                >
                                    Quay lại đăng nhập
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Toggle Box */}
                <div className={styles['toggle-box']}>
                    <div className={`${styles['toggle-panel']} ${styles['toggle-left']}`}>
                        <h1>Xin chào!</h1>
                        <p>Chưa có tài khoản?</p>
                        <button
                            className={`${styles.btn} ${styles['register-btn']}`}
                            onClick={() => setIsActive(true)}
                        >
                            Đăng ký
                        </button>
                    </div>

                    <div className={`${styles['toggle-panel']} ${styles['toggle-right']}`}>
                        <h1>Chào mừng trở lại!</h1>
                        <p>Đã có tài khoản?</p>
                        <button
                            className={`${styles.btn} ${styles['login-btn']}`}
                            onClick={() => setIsActive(false)}
                        >
                            Đăng nhập
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};
export default LoginPage;
