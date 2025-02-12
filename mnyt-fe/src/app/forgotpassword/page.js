"use client";

import React, { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./page.css";

const ForgotPasswordPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const handleCaptchaChange = (value) => {
    console.log("Captcha value:", value);
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-image"></div>

      <div className="forgot-password-form">
        <h1 className="forgot-password-title">CHÚC BẠN CÓ MỘT NGÀY TỐT LÀNH</h1>

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
            <label htmlFor="new-password" className="form-label">
              Mật khẩu mới
            </label>
            <div className="form-password">
              <input
                id="new-password"
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

          <div className="form-group">
            <label htmlFor="confirm-password" className="form-label">
              Nhập lại mật khẩu mới
            </label>
            <div className="form-password">
              <input
                id="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Nhập mật khẩu của bạn"
                className="form-input"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={toggleConfirmPasswordVisibility}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="form-group otp-recaptcha">
            <div className="otp-input">
              <label htmlFor="otp" className="form-label">
                OTP
              </label>
              <input
                id="otp"
                type="text"
                placeholder="Nhập mã OTP"
                className="form-input"
              />
            </div>

            <div className="recaptcha">
              <ReCAPTCHA
                sitekey="YOUR_SITE_KEY"
                onChange={handleCaptchaChange}
              />
            </div>
          </div>

          <button type="submit" className="forgot-password-button">
            Đăng ký
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
