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

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Gửi email xác thực
    console.log("Gửi OTP đến email:", email);
    setStep(2);
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Xác thực OTP
    console.log("Xác thực OTP:", otp);
    setStep(3);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Mật khẩu không khớp!");
      return;
    }
    // TODO: Đổi mật khẩu
    console.log("Đổi mật khẩu thành công!");
  };

  return (
    <div className="forgot-password-page-wrapper">
      <div className="forgot-password-container">
        <div className="forgot-password-image"></div>
        <div className="forgot-password-form">
          <h1 className="forgot-password-title">Khôi phục mật khẩu</h1>
          
          {step === 1 && (
            <form className="form" onSubmit={handleEmailSubmit}>
              <div className="step-indicator">Bước 1/3: Xác nhận email</div>
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email của bạn
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Nhập email đã đăng ký"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="forgot-password-button">
                Gửi mã xác nhận
              </button>
            </form>
          )}

          {step === 2 && (
            <form className="form" onSubmit={handleOtpSubmit}>
              <div className="step-indicator">Bước 2/3: Nhập mã xác nhận</div>
              <div className="form-group">
                <label htmlFor="otp" className="form-label">
                  Mã xác nhận
                </label>
                <input
                  id="otp"
                  type="text"
                  placeholder="Nhập mã đã gửi đến email của bạn"
                  className="form-input"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
                <p className="help-text">
                  Mã xác nhận đã được gửi đến email {email}
                </p>
              </div>
              <button type="submit" className="forgot-password-button">
                Xác nhận
              </button>
            </form>
          )}

          {step === 3 && (
            <form className="form" onSubmit={handlePasswordSubmit}>
              <div className="step-indicator">Bước 3/3: Đặt mật khẩu mới</div>
              {error && <div className="error-message">{error}</div>}
              <div className="form-group">
                <label htmlFor="new-password" className="form-label">
                  Mật khẩu mới
                </label>
                <div className="form-password">
                  <input
                    id="new-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Nhập mật khẩu mới"
                    className="form-input"
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

              <div className="form-group">
                <label htmlFor="confirm-password" className="form-label">
                  Xác nhận mật khẩu
                </label>
                <div className="form-password">
                  <input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Nhập lại mật khẩu mới"
                    className="form-input"
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

              <button type="submit" className="forgot-password-button">
                Đổi mật khẩu
              </button>
            </form>
          )}

          <div className="back-to-login">
            <Link href="/auth/login" className="back-link">
              ← Quay lại đăng nhập
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
