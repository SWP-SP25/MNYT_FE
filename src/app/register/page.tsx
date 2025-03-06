'use client';

import React, { useState } from "react";
import { FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa";
import Link from 'next/link';
import "./page.css";
import { register } from "node:module";
import { useFetch } from "@/hooks/useFetch";
import { AuthUser } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

const SignupPage = () => {
    const { fetchData, loading, error: fetchError } = useFetch();
    const router = useRouter();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        fullName: "",
        phoneNumber: "0987123456",
        address: "",
        role: "Member",
        isExternal: false,
        externalProvider: "",
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
        const API_URL = "https://api-mnyt.purintech.id.vn/api/Authentication";
        e.preventDefault();
        console.log("data to login", formData);
        // Xử lý đăng ký
        await fetchData<{ success: boolean; data: AuthUser }>(`${API_URL}/register`,
            {
                method: "POST",
                body: JSON.stringify(formData)
            }).then(response => {
                if (response.success) {
                    console.log("Đăng ký thành công");
                } else {
                    console.log("Đăng ký thất bại");
                }
                router.push("/login");
            });
    };

    return (
        <div className="signup-container">
            <div className="signup-image"></div>
            <div className="signup-form">
                <h1 className="signup-title">Đăng ký tài khoản</h1>

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
                            placeholder="Nhập tên tài khoản"
                            className="form-input"
                            value={formData.username}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email" className="form-label">
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Nhập email của bạn"
                            className="form-input"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
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
                        <label htmlFor="confirmPassword" className="form-label">
                            Xác nhận mật khẩu
                        </label>
                        <div className="form-password">
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Xác nhận mật khẩu của bạn"
                                className="form-input"
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

                    <button type="submit" className="signup-button">
                        Đăng ký
                    </button>

                    <p className="login-prompt">
                        Đã có tài khoản?{" "}
                        <Link href="/login" className="login-link">
                            Đăng nhập ngay
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default SignupPage;
