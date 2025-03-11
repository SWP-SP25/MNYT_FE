"use client";

import React, { useState } from "react";
import { FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa";
import "./page.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import AuthenticatedHomePage from "../homepage/authentication/auth-homepage";
import Cookies from "js-cookie";
import { signIn, useSession } from "next-auth/react";
import { cleanDigitSectionValue } from "@mui/x-date-pickers/internals/hooks/useField/useField.utils";
import { clearScreenDown } from "readline";

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const { login, loading } = useAuth();
    const { data: session } = useSession();

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const [formData, setFormData] = useState({
        emailOrUsername: '',
        password: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            await login({
                emailOrUsername: formData.emailOrUsername,
                password: formData.password
            });

            // Lấy thông tin user từ cookie sau khi đăng nhập
            const userData = Cookies.get('user');
            if (userData) {
                const user = JSON.parse(userData);
                // Nếu là Admin thì chuyển đến trang admin
                if (user.role === 'Admin') {
                    router.push('/admin');
                } else {
                    router.push('/');
                }
            }

            if (formData.rememberMe) {
                localStorage.setItem('rememberMe', 'true');
            }
        } catch (err) {
            console.error('Lỗi đăng nhập:', err);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const result = await signIn('google', {
                callbackUrl: '/', // URL chuyển hướng sau khi đăng nhập thành công
                redirect: true,
            });
            console.log("Test tsjadkl;jajsld ");
        } catch (error) {
            console.error('Google login error:', error);
        }
    };

    React.useEffect(() => {
        if (session) {
            router.push('/');
        }
    }, [session, router]);

    return (
        <div className="login-container">
            <div className="login-image"></div>
            <div className="login-form">
                <div className="login-content">
                    <h1 className="login-title">Đăng nhập</h1>
                    <p className="login-subtitle">Chào mừng bạn đã quay trở lại!</p>

                    <form className="form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="username" className="form-label">
                                Tên tài khoản
                            </label>
                            <input
                                id="username"
                                name="emailOrUsername"
                                type="text"
                                placeholder="Email hoặc số điện thoại"
                                className="form-input"
                                value={formData.emailOrUsername}
                                onChange={handleInputChange}
                            />
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="emailOrUsername">
                                    Email hoặc số điện thoại
                                </label>
                                <input
                                    id="emailOrUsername"
                                    name="emailOrUsername"
                                    type="text"
                                    placeholder="Nhập email hoặc số điện thoại"
                                    value={formData.emailOrUsername}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-group password-group">
                                <label htmlFor="password">
                                    Mật khẩu
                                </label>
                                <div className="password-field">
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Nhập mật khẩu của bạn"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                            </div>

                            <button type="submit" className="login-button">
                                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                            </button>

                            <button
                                type="button"
                                className="google-login"
                                onClick={handleGoogleLogin}
                            >
                                <FaGoogle className="google-icon" />
                                Đăng nhập với tài khoản Google
                            </button>
                        </form>

                        <button type="button" className="google-login">
                            <FaGoogle /> Đăng nhập với Google
                        </button>
                    </form> {/* Đóng form đúng chỗ */}

                    <div className="login-switch">
                        Chưa có tài khoản? {" "}
                        <Link href="/register">
                            Đăng ký ngay
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default LoginPage;