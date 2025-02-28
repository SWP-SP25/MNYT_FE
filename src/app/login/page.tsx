"use client";

import React, { useState } from "react";
import { FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa";
import "./page.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import AuthenticatedHomePage from "../homepage/authentication/authHomepage";
const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const { login, loading, error } = useAuth();

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };
    const [formData, setFormData] = useState({
        emailOrUsername: '',
        password: '',
        rememberMe: false
    });
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            console.log(formData);
            await login({
                emailOrUsername: formData.emailOrUsername,
                password: formData.password
            });

            // Lưu remember me nếu được chọn
            if (formData.rememberMe) {
                localStorage.setItem('rememberMe', 'true');
            }

            // Chuyển hướng sau khi đăng nhập thành công
            router.push('/');
        } catch (err) {
            console.error('Lỗi đăng nhập:', err);
        }
    };

    return (
        <div className="login-container">
            <div className="login-image"></div>

            <div className="login-form">
                <h1 className="login-title">CHÚC BẠN CÓ MỘT NGÀY TỐT LÀNH</h1>

                <form className="form">
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

                    <div className="form-group">
                        <label htmlFor="password" className="form-label">
                            Mật khẩu
                        </label>
                        <div className="form-password">
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Nhập mật khẩu của bạn"
                                className="form-input"
                                value={formData.password}
                                onChange={handleInputChange}
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={togglePasswordVisibility}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>

                    <div className="form-options">
                        <label className="remember-me">
                            <input
                                type="checkbox"
                                name="rememberMe"
                                className="checkbox"
                                checked={formData.rememberMe}
                                onChange={handleInputChange}
                            /> Ghi nhớ tôi
                        </label>
                        <Link href="/forgotpassword" className="forgot-password">
                            Bạn quên mật khẩu?
                        </Link>
                    </div>

                    <button type="submit" className="login-button" onClick={handleSubmit}>
                        {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                    </button>

                    <button type="button" className="google-login">
                        <FaGoogle className="google-icon" /> Hoặc đăng nhập với tài khoản
                        Google
                    </button>
                </form>

                <p className="signup-prompt">
                    Bạn chưa có tài khoản?{" "}
                    <Link href="/register" className="signup-link">
                        Đăng ký ngay
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
