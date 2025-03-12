"use client";

import React, { useState, useEffect } from "react";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import { BsPersonFill, BsEnvelopeFill, BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import "./page.css";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Cookies from "js-cookie";

const LoginPage = () => {
    const [isActive, setIsActive] = useState(false);
    const router = useRouter();
    const { login, loading } = useAuth();

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

    const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            await login({
                emailOrUsername: loginData.username,
                password: loginData.password
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
                Cookies.set('rememberMe', 'true');
            }
        } catch (err) {
            console.error('Lỗi đăng nhập:', err);
        }
    };

    return (
        <div className="login-container">
            <div className="login-image"></div>

            <div className="login-form">
                <h1 className="login-title">CHÚC BẠN CÓ MỘT NGÀY TỐT LÀNH</h1>

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

                    <button type="submit" className="login-button">
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
