'use client';

import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Link from 'next/link';
import "./page.css";

const ForgotPasswordPage = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            setStep(2);
        } catch (error) {
            setError("Có lỗi xảy ra khi gửi email");
        } finally {
            setIsLoading(false);
        }
    };

    const handleOtpSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStep(3);
    };

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError("Mật khẩu không khớp!");
            return;
        }
        // Xử lý đổi mật khẩu
    };

    return (
        <div className="forgot-container">
            <div className="forgot-image"></div>
            <div className="forgot-form">
                <div className="forgot-content">
                    <h1 className="forgot-title">Khôi phục mật khẩu</h1>
                    <p className="forgot-subtitle">
                        {step === 1 && "Bước 1/3: Xác nhận email"}
                        {step === 2 && "Bước 2/3: Nhập mã xác nhận"}
                        {step === 3 && "Bước 3/3: Đặt mật khẩu mới"}
                    </p>

                    {error && <div className="forgot-error">{error}</div>}

                    {step === 1 && (
                        <form onSubmit={handleEmailSubmit}>
                            <div className="form-group">
                                <label htmlFor="email">
                                    Email của bạn
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="Nhập email đã đăng ký"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            <button
                                type="submit"
                                className="forgot-button"
                                disabled={isLoading}
                            >
                                {isLoading ? "Đang gửi..." : "Gửi mã xác nhận"}
                            </button>
                        </form>
                    )}

                    {step === 2 && (
                        <form onSubmit={handleOtpSubmit}>
                            <div className="form-group">
                                <label htmlFor="otp">
                                    Mã xác nhận
                                </label>
                                <input
                                    id="otp"
                                    type="text"
                                    placeholder="Nhập mã xác nhận từ email"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    required
                                    className="otp-input"
                                    maxLength={6}
                                />
                                <p className="form-help">Mã xác nhận đã được gửi đến email của bạn</p>
                            </div>

                            <button type="submit" className="forgot-button">
                                Xác nhận mã
                            </button>
                        </form>
                    )}

                    {step === 3 && (
                        <form onSubmit={handlePasswordSubmit}>
                            <div className="form-group password-group">
                                <label htmlFor="newPassword">
                                    Mật khẩu mới
                                </label>
                                <div className="password-field">
                                    <input
                                        id="newPassword"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Nhập mật khẩu mới"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
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
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="Nhập lại mật khẩu mới"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
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

                            <button type="submit" className="forgot-button">
                                Đổi mật khẩu
                            </button>
                        </form>
                    )}

                    <div className="forgot-switch">
                        {step === 1 ? (
                            <Link href="/login">
                                Quay lại đăng nhập
                            </Link>
                        ) : (
                            <button
                                type="button"
                                className="back-button"
                                onClick={() => setStep(step - 1)}
                            >
                                Quay lại bước trước
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;