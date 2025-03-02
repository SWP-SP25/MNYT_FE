"use client";

import React, { useState } from "react";
import { FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa";
import "./page.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const { login, loading, error } = useAuth();

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
            router.push('/');
        } catch (err) {
            console.error('Lỗi đăng nhập:', err);
        }
    };

    return (
        <div className="login-container">
            <div className="login-image"></div>
            <div className="login-form">
                <div className="login-content">
                    <h1 className="login-title">Đăng nhập</h1>
                    <p className="login-subtitle">Chào mừng bạn đã quay trở lại!</p>

                    {error && <div className="login-error">{error}</div>}

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

                        <Link href="/forgotpassword" className="forgot-link">
                            Quên mật khẩu?
                        </Link>

                        <button 
                            type="submit" 
                            className="login-button"
                            disabled={loading}
                        >
                            {loading ? "Đang xử lý..." : "Đăng nhập"}
                        </button>

                        <button type="button" className="google-login">
                            <FaGoogle /> Đăng nhập với Google
                        </button>
                    </form>

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