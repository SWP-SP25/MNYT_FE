"use client";

import React, { useState } from "react";
import { FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa";
import "./page.css";

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
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
                            type="text"
                            placeholder="Email hoặc số điện thoại"
                            className="form-input"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password" className="form-label">
                            Mật khẩu
                        </label>
                        <div className="form-password">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Nhập mật khẩu của bạn"
                                className="form-input"
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
                            <input type="checkbox" className="checkbox" /> Ghi nhớ tôi
                        </label>
                        <a href="/forgotpassword" className="forgot-password">
                            Bạn quên mật khẩu?
                        </a>
                    </div>

                    <button type="submit" className="login-button">
                        Đăng nhập
                    </button>

                    <button type="button" className="google-login">
                        <FaGoogle className="google-icon" /> Hoặc đăng nhập với tài khoản
                        Google
                    </button>
                </form>

                <p className="signup-prompt">
                    Bạn chưa có tài khoản?{" "}
                    <a href="/register" className="signup-link">
                        Đăng ký ngay
                    </a>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
