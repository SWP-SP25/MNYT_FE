'use client';

import React, { useState } from "react";
import { FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa";
import Link from 'next/link';
import "./page.css";

const RegisterPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [error, setError] = useState("");

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Xử lý đăng ký
    };

    return (
        <div className="register-container">
            <div className="register-image"></div>
            <div className="register-form">
                <div className="register-content">
                    <h1 className="register-title">Đăng ký tài khoản</h1>
                    <p className="register-subtitle">Chào mừng bạn đến với ứng dụng của chúng tôi!</p>

                    {error && <div className="register-error">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="username">
                                Tên tài khoản
                            </label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                placeholder="Nhập tên tài khoản"
                                value={formData.username}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Nhập email của bạn"
                                value={formData.email}
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

                        <div className="form-group password-group">
                            <label htmlFor="confirmPassword">
                                Xác nhận mật khẩu
                            </label>
                            <div className="password-field">
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Xác nhận mật khẩu của bạn"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    required
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </div>

                        <button type="submit" className="register-button">
                            Đăng ký
                        </button>

                        <button type="button" className="google-login">
                            <FaGoogle /> Đăng ký với Google
                        </button>
                    </form>

                    <div className="register-switch">
                        Đã có tài khoản? {" "}
                        <Link href="/login">
                            Đăng nhập ngay
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
