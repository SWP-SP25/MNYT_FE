'use client';

import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import "./page.css";

const ForgotPasswordPage = () => {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        setSuccessMessage("");

        try {
            const response = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Có lỗi xảy ra');
            }

            setSuccessMessage(data.message);
            setStep(2);
        } catch (error: any) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOtpSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        setSuccessMessage("");

        try {
            const response = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, otp }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Có lỗi xảy ra');
            }

            setSuccessMessage(data.message);
            setStep(3);
        } catch (error: any) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        setSuccessMessage("");

        if (newPassword !== confirmPassword) {
            setError("Mật khẩu không khớp!");
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, otp, newPassword }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Có lỗi xảy ra');
            }

            setSuccessMessage(data.message);
            setTimeout(() => {
                router.push('/login');
            }, 2000);
        } catch (error: any) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
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
                    {successMessage && <div className="forgot-success">{successMessage}</div>}

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
                                    disabled={isLoading}
                                />
                                <p className="form-help">Mã xác nhận đã được gửi đến email của bạn</p>
                            </div>

                            <button
                                type="submit"
                                className="forgot-button"
                                disabled={isLoading}
                            >
                                {isLoading ? "Đang xác nhận..." : "Xác nhận mã"}
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
                                        disabled={isLoading}
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

                            <div className="form-group">
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
                                        disabled={isLoading}
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

                            <button
                                type="submit"
                                className="forgot-button"
                                disabled={isLoading}
                            >
                                {isLoading ? "Đang xử lý..." : "Đổi mật khẩu"}
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
                                disabled={isLoading}
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