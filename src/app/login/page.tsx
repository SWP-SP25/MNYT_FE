"use client";

import React, { useState, useEffect } from "react";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import { BsPersonFill, BsEnvelopeFill, BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import "./page.css";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

const LoginPage = () => {
    const [isActive, setIsActive] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const { login, loading, error } = useAuth();
    
    const [showLoginPassword, setShowLoginPassword] = useState(false);
    const [showRegisterPassword, setShowRegisterPassword] = useState(false);

    const [loginData, setLoginData] = useState({
        username: '',
        password: '',
    });

    const [registerData, setRegisterData] = useState({
        username: '',
        email: '',
        password: '',
    });

    useEffect(() => {
        // Kiểm tra nếu có query parameter 'mode=register' thì hiển thị form đăng ký
        const mode = searchParams.get('mode');
        if (mode === 'register') {
            setIsActive(true);
        }
    }, [searchParams]);

    const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setLoginData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setRegisterData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await login({
                emailOrUsername: loginData.username,
                password: loginData.password
            });
            router.push('/');
        } catch (err) {
            console.error('Lỗi đăng nhập:', err);
        }
    };

    const handleRegisterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Xử lý đăng ký
        console.log('Register data:', registerData);
    };

    return (
        <div className={`container ${isActive ? 'active' : ''}`}>
            {/* Login Form */}
            <div className="form-box login">
                <form onSubmit={handleLoginSubmit}>
                    <h1>Đăng nhập</h1>
                    {error && <div className="error-message">{error}</div>}
                    
                    <div className="input-box">
                        <input 
                            type="text" 
                            name="username"
                            placeholder="Tên đăng nhập" 
                            value={loginData.username}
                            onChange={handleLoginChange}
                            required 
                        />
                        <i><BsPersonFill /></i>
                    </div>

                    <div className="input-box">
                        <input 
                            type={showLoginPassword ? "text" : "password"}
                            name="password" 
                            placeholder="Mật khẩu"
                            value={loginData.password}
                            onChange={handleLoginChange}
                            required 
                        />
                        <i className="password-icon" onClick={() => setShowLoginPassword(!showLoginPassword)}>
                            {showLoginPassword ? <BsEyeSlashFill /> : <BsEyeFill />}
                        </i>
                    </div>

                    <div className="forgot-link">
                        <Link href="/forgotpassword">Quên mật khẩu?</Link>
                    </div>

                    <button type="submit" className="btn" disabled={loading}>
                        {loading ? "Đang xử lý..." : "Đăng nhập"}
                    </button>

                    <p>hoặc đăng nhập với</p>
                    <div className="social-icons">
                        <a href="#" className="google-btn">
                            <FaGoogle />
                            <span>Google</span>
                        </a>
                        <a href="#" className="facebook-btn">
                            <FaFacebook />
                            <span>Facebook</span>
                        </a>
                    </div>
                </form>
            </div>

            {/* Register Form */}
            <div className="form-box register">
                <form onSubmit={handleRegisterSubmit}>
                    <h1>Đăng ký</h1>
                    
                    <div className="input-box">
                        <input 
                            type="text"
                            name="username"
                            placeholder="Tên đăng nhập"
                            value={registerData.username}
                            onChange={handleRegisterChange}
                            required 
                        />
                        <i><BsPersonFill /></i>
                    </div>

                    <div className="input-box">
                        <input 
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={registerData.email}
                            onChange={handleRegisterChange}
                            required 
                        />
                        <i><BsEnvelopeFill /></i>
                    </div>

                    <div className="input-box">
                        <input 
                            type={showRegisterPassword ? "text" : "password"}
                            name="password"
                            placeholder="Mật khẩu"
                            value={registerData.password}
                            onChange={handleRegisterChange}
                            required 
                        />
                        <i className="password-icon" onClick={() => setShowRegisterPassword(!showRegisterPassword)}>
                            {showRegisterPassword ? <BsEyeSlashFill /> : <BsEyeFill />}
                        </i>
                    </div>

                    <button type="submit" className="btn">Đăng ký</button>

                    <p>hoặc đăng ký với</p>
                    <div className="social-icons">
                        <a href="#" className="google-btn">
                            <FaGoogle />
                            <span>Google</span>
                        </a>
                        <a href="#" className="facebook-btn">
                            <FaFacebook />
                            <span>Facebook</span>
                        </a>
                    </div>
                </form>
            </div>

            {/* Toggle Box */}
            <div className="toggle-box">
                <div className="toggle-panel toggle-left">
                    <h1>Xin chào!</h1>
                    <p>Chưa có tài khoản?</p>
                    <button 
                        className="btn register-btn"
                        onClick={() => setIsActive(true)}
                    >
                        Đăng ký
                    </button>
                </div>

                <div className="toggle-panel toggle-right">
                    <h1>Chào mừng trở lại!</h1>
                    <p>Đã có tài khoản?</p>
                    <button 
                        className="btn login-btn"
                        onClick={() => setIsActive(false)}
                    >
                        Đăng nhập
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;