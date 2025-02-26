'use client';

import React, { useState } from "react";
import { FaGoogle, FaEye, FaEyeSlash, FaArrowLeft } from "react-icons/fa";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from 'next/link';
import "./page.css";

interface FormData {
  username: string;
  password: string;
  rememberMe: boolean;
}

const LoginPage = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    username: "",
    password: "",
    rememberMe: false
  });
  const [error, setError] = useState("");

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError(""); // Clear error when user starts typing
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        username: formData.username,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Tên đăng nhập hoặc mật khẩu không đúng");
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      setError("Đã có lỗi xảy ra. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch (error) {
      setError("Đăng nhập bằng Google thất bại. Vui lòng thử lại.");
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-container">
        <div className="login-image">
          <Link href="/" className="back-button">
            <FaArrowLeft /> Trang chủ
          </Link>
        </div>
        <div className="login-form">
          <h1 className="login-title">CHÚC BẠN CÓ MỘT NGÀY TỐT LÀNH</h1>

          {error && <div className="error-message">{error}</div>}

          <form className="form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username" className="form-label">
                Tên tài khoản
              </label>
              <input
                id="username"
                name="username"
                type="text"
                placeholder="Email hoặc số điện thoại"
                className="form-input"
                value={formData.username}
                onChange={handleInputChange}
                required
                disabled={isLoading}
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
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={togglePasswordVisibility}
                  disabled={isLoading}
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
                  disabled={isLoading}
                /> 
                Ghi nhớ tôi
              </label>
              <Link href="/auth/forgotpassword" className="forgot-password">
                Bạn quên mật khẩu?
              </Link>
            </div>

            <button 
              type="submit" 
              className="login-button"
              disabled={isLoading}
            >
              {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>

            <button 
              type="button" 
              className="google-login"
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              <FaGoogle className="google-icon" /> 
              Hoặc đăng nhập với tài khoản Google
            </button>
          </form>

          <p className="signup-prompt">
            Bạn chưa có tài khoản?{" "}
            <Link href="/auth/signup" className="signup-link">
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;