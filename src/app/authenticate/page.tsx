"use client";

import React, { useEffect, useState } from "react";
import { BsPersonFill, BsEnvelopeFill, BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import { IoMdCheckmarkCircle, IoMdCloseCircle } from "react-icons/io";
// import { FaGoogle } from "react-icons/fa";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useFetch } from "@/hooks/useFetch";
import Cookies from "js-cookie";

import styles from './page.module.css';

// Khai báo kiểu dữ liệu cho thông báo
type NotificationType = 'success' | 'error' | '';
type NotificationMessage = string;

const LoginPage = () => {
    const [isActive, setIsActive] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { login, loading: authLoading, error: authError } = useAuth();
    const { fetchData, loading: fetchLoading, error: fetchError } = useFetch();

    // Thêm state cho thông báo
    const [notification, setNotification] = useState<{
        type: NotificationType,
        message: NotificationMessage
    }>({ type: '', message: '' });

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

    // Hàm "dịch" thông báo lỗi sang ngôn ngữ thân thiện với người dùng
    const getErrorMessage = (errorMsg: string): string => {
        // Chuẩn hóa thông báo lỗi (viết thường, loại bỏ dấu câu thừa)
        const normalizedError = errorMsg.toLowerCase().trim();

        // Lỗi đăng nhập
        if (normalizedError.includes("invalid credentials") ||
            normalizedError.includes("account is banned")) {
            return "Sai tài khoản hoặc mật khẩu, vui lòng thử lại.";
        }

        // Lỗi đăng ký - tên đăng nhập
        if (normalizedError.includes("user already exists")) {
            return "Tên đăng nhập đã tồn tại, vui lòng chọn tên khác.";
        }

        // Lỗi đăng ký - email
        if (normalizedError.includes("email already exists")) {
            return "Email này đã được sử dụng, vui lòng dùng email khác.";
        }

        // Lỗi mật khẩu
        if (normalizedError.includes("password too weak")) {
            return "Mật khẩu chưa đủ mạnh. Vui lòng sử dụng ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số.";
        }

        // Lỗi kết nối
        if (normalizedError.includes("network error") ||
            normalizedError.includes("failed to fetch")) {
            return "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng và thử lại.";
        }

        // Trường hợp mặc định
        return errorMsg; // Trả về thông báo gốc nếu không có quy tắc tùy chỉnh
    };

    // Hiển thị thông báo và tự động ẩn sau 5 giây
    const showNotification = (type: NotificationType, message: NotificationMessage) => {
        // Nếu là thông báo lỗi, áp dụng hàm dịch
        const displayMessage = type === 'error' ? getErrorMessage(message) : message;

        setNotification({ type, message: displayMessage });

        // Tự động ẩn thông báo sau 5 giây
        setTimeout(() => {
            setNotification({ type: '', message: '' });
        }, 5000);
    };

    useEffect(() => {
        // Kiểm tra nếu có query parameter 'mode=register' thì hiển thị form đăng ký
        const mode = searchParams.get('mode');
        if (mode === 'register') {
            setIsActive(true);
        }
    }, [searchParams]);

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
            // Không cần làm gì ở đây vì đã có useEffect theo dõi authError
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
            // Không cần làm gì ở đây vì đã có useEffect theo dõi fetchError
        }
    };

    // Thêm một hàm để xử lý sự kiện toggle password
    const togglePasswordVisibility = (field: 'password' | 'confirmPassword') => {
        if (field === 'password') {
            setShowPassword(!showPassword);
        } else {
            setShowConfirmPassword(!showConfirmPassword);
        }
    };

    return (
        <div className={`${styles.container} ${isActive ? styles.active : ''}`}>
            {/* Hiển thị thông báo - thêm class nhỏ gọn */}
            {notification.type && (
                <div className={`${styles.notification} ${styles[notification.type]} ${styles.compact}`}>
                    {notification.type === 'success' ? (
                        <IoMdCheckmarkCircle className={styles.notificationIcon} />
                    ) : (
                        <IoMdCloseCircle className={styles.notificationIcon} />
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
                        <i className={styles['password-icon']} onClick={() => togglePasswordVisibility('password')}>
                            {showPassword ? <BsEyeSlashFill /> : <BsEyeFill />}
                        </i>
                    </div>

                    <div className={styles['remember-forgot']}>
                        <label>
                            <input
                                type="checkbox"
                                name="rememberMe"
                                checked={loginData.rememberMe}
                                onChange={handleLoginChange}
                            /> Ghi nhớ đăng nhập
                        </label>
                        <Link href="/forgotpassword" className={styles['forgot-link']}>Quên mật khẩu?</Link>
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
    );
};
export default LoginPage;
