'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './page.module.css';
import componentStyles from './components.module.css';
import { useAuth } from '@/hooks/useAuth';
import axios from 'axios';
import { BsEyeFill, BsEyeSlashFill, BsCheckLg, BsPencilFill } from 'react-icons/bs';
import { IoMdCheckmarkCircle, IoMdCloseCircle } from 'react-icons/io';
import { getUserInfo } from '@/utils/getUserInfo';
// Định nghĩa interface cho dữ liệu người dùng
interface UserData {
    id: number;
    userName: string;
    fullName: string | null;
    email: string;
    phoneNumber: string | null;
    role: string;
    status: string;
    isExternal: boolean;
    externalProvider: string | null;
    createDate: string;
}

// Thêm type cho notification
type NotificationType = 'success' | 'error' | 'info' | '';
type NotificationMessage = string;

export default function AccountInfoPage() {
    const { user } = useAuth();
    const userInfo = getUserInfo(user);
    // Bỏ getUserInfo, lấy trực tiếp từ user
    const token = user?.token;

    const [originalData, setOriginalData] = useState<UserData | null>(null);
    const [formData, setFormData] = useState({
        userName: '',
        fullName: '',
        email: '',
        phoneNumber: ''
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Password states
    const [isResettingPassword, setIsResettingPassword] = useState(false);
    const [passwordData, setPasswordData] = useState({
        newPassword: '',
        confirmPassword: ''
    });
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [notification, setNotification] = useState<{
        type: NotificationType,
        message: NotificationMessage
    }>({ type: '', message: '' });

    const [shouldUpdate, setShouldUpdate] = useState(false);

    // Thêm hàm showNotification
    const showNotification = (type: NotificationType, message: string) => {
        setNotification({ type, message });
        // Tự động ẩn sau 3 giây
        setTimeout(() => {
            setNotification({ type: '', message: '' });
        }, 3000);
    };

    // Fetch data một lần khi component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    `https://api-mnyt.purintech.id.vn/api/Accounts/${userInfo?.id}`, // Hardcode ID = 4
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                );

                if (response.data.success) {
                    const data = response.data.data;
                    setOriginalData(data);
                    setFormData({
                        userName: data.userName || '',
                        fullName: data.fullName || '',
                        email: data.email || '',
                        phoneNumber: data.phoneNumber || ''
                    });
                }
            } catch (err) {
                console.error('Error fetching user data:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []); // Chỉ fetch một lần khi mount

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };


    const handleSave = async () => {
        try {
            const response = await axios.put(
                `https://api-mnyt.purintech.id.vn/api/Accounts/${userInfo.id}`, // Sử dụng userInfo.id
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`, // Thêm token vào headers
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.success) {
                setOriginalData(prev => ({
                    ...prev!,
                    ...formData
                }));
                setIsEditing(false);
                showNotification('success', 'Cập nhật thành công');
            } else {
                throw new Error(response.data.message || 'Cập nhật thất bại');
            }
        } catch (err: any) {
            console.error('Error updating:', err);
            showNotification('error', 'Không thể cập nhật thông tin');
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        if (originalData) {
            setFormData({
                userName: originalData.userName || '',
                fullName: originalData.fullName || '',
                email: originalData.email || '',
                phoneNumber: originalData.phoneNumber || ''
            });
        }
    };

    const handleResetPassword = async () => {
        if (!userInfo?.userName) return;
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            showNotification('error', 'Mật khẩu xác nhận không khớp');
            return;
        }

        try {
            const response = await axios.post(
                'https://api-mnyt.purintech.id.vn/api/Accounts/reset-password',
                {
                    userNameOrEmail: userInfo.userName,
                    newPassword: passwordData.newPassword,
                    confirmNewPassword: passwordData.confirmPassword
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`, // Thêm token vào headers
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.success) {
                showNotification('success', 'Đổi mật khẩu thành công');
                setPasswordData({ newPassword: '', confirmPassword: '' });
                setIsResettingPassword(false);
            }
        } catch (err: any) {
            console.error('Error resetting password:', err);
            const errorMessage = err.response?.data?.message || 'Không thể đổi mật khẩu. Vui lòng thử lại.';
            showNotification('error', errorMessage);
        }
    };

    // Format date safely
    const formatDate = (dateString: string | null | undefined) => {
        if (!dateString) return 'N/A';

        try {
            const date = new Date(dateString);
            return new Intl.DateTimeFormat('vi-VN', {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric'
            }).format(date);
        } catch (e) {
            return 'Invalid date';
        }
    };

    // Loading state
    if (isLoading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.loading}>
                    <div className={styles.loadingSpinner}></div>
                    <p>Đang tải thông tin...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className={styles.errorContainer}>
                <div className={styles.error}>
                    <IoMdCloseCircle className={styles.errorIcon} />
                    <p>{error}</p>
                    <button
                        className={styles.retryButton}
                        onClick={() => window.location.reload()}
                    >
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.profileContainer}>
            {/* Thêm notification */}
            {notification.type && (
                <div className={`${styles.notification} ${styles[notification.type]}`}>
                    {notification.type === 'success' ? (
                        <IoMdCheckmarkCircle className={styles.notificationIcon} />
                    ) : notification.type === 'error' ? (
                        <IoMdCloseCircle className={styles.notificationIcon} />
                    ) : (
                        <IoMdCheckmarkCircle className={styles.notificationIcon} />
                    )}
                    <span>{notification.message}</span>
                    <button
                        className={styles.closeNotification}
                        onClick={() => setNotification({ type: '', message: '' })}
                    >
                        &times;
                    </button>
                </div>
            )}

            <div className={styles.userHeader}>
                <div className={styles.avatarLarge}>
                    {originalData?.fullName ? (
                        <img src="https://res.cloudinary.com/mnyt/image/upload/v1743451509/avt_e49ndc.png" alt="User avatar" />
                    ) : (
                        <div className={styles.avatarPlaceholder}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z" />
                            </svg>
                        </div>
                    )}
                </div>
                <div className={styles.userHeaderInfo}>
                    <h2>{originalData?.fullName || 'Chưa cập nhật'}</h2>
                    <div className={styles.username}>@{originalData?.userName}</div>
                    <div className={styles.memberStatus}>Thành viên từ: {formatDate(originalData?.createDate)}</div>
                </div>
            </div>

            <div className={styles.infoGrid}>
                {/* Thông tin người dùng */}
                {Object.entries({
                    userName: 'Tên đăng nhập',
                    fullName: 'Họ và tên',
                    email: 'Email',
                    phoneNumber: 'Số điện thoại'
                }).map(([field, label]) => (
                    <div key={field} className={styles.infoRow}>
                        <div className={styles.infoLabel}>{label}</div>
                        <div className={styles.infoValue}>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name={field}
                                    value={formData[field as keyof typeof formData]}
                                    onChange={handleInputChange}
                                    className={styles.editInput}
                                />
                            ) : (
                                <span>{originalData?.[field as keyof UserData] || 'Chưa cập nhật'}</span>
                            )}
                        </div>
                    </div>
                ))}

                {/* Password section */}
                <div className={styles.infoRow}>
                    <div className={styles.infoLabel}>Mật khẩu</div>
                    <div className={styles.infoValue}>
                        {!isResettingPassword ? (
                            <>
                                <div className={styles.passwordField}>••••••••</div>
                                <button
                                    className={styles.resetPasswordButton}
                                    onClick={() => setIsResettingPassword(true)}
                                >
                                    Đặt lại mật khẩu
                                </button>
                            </>
                        ) : (
                            <div className={styles.passwordResetRow}>
                                <div className={styles.passwordInputGroup}>
                                    <input
                                        type={showNewPassword ? "text" : "password"}
                                        placeholder="Mật khẩu mới"
                                        value={passwordData.newPassword}
                                        onChange={(e) => setPasswordData({
                                            ...passwordData,
                                            newPassword: e.target.value
                                        })}
                                    />
                                    <button
                                        type="button"
                                        className={styles.togglePassword}
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                    >
                                        {showNewPassword ? <BsEyeSlashFill /> : <BsEyeFill />}
                                    </button>
                                </div>
                                <div className={styles.passwordInputGroup}>
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="Xác nhận mật khẩu mới"
                                        value={passwordData.confirmPassword}
                                        onChange={(e) => setPasswordData({
                                            ...passwordData,
                                            confirmPassword: e.target.value
                                        })}
                                    />
                                    <button
                                        type="button"
                                        className={styles.togglePassword}
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? <BsEyeSlashFill /> : <BsEyeFill />}
                                    </button>
                                </div>
                                <button
                                    className={styles.cancelButton}
                                    onClick={() => {
                                        setIsResettingPassword(false);
                                        setPasswordData({ newPassword: '', confirmPassword: '' });
                                    }}
                                >
                                    Hủy
                                </button>
                                <button
                                    className={styles.confirmButton}
                                    onClick={handleResetPassword}
                                >
                                    Xác nhận
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Action buttons */}
                <div className={styles.actionButtons}>
                    {!isEditing ? (
                        <button
                            className={styles.editButton}
                            onClick={() => {
                                console.log('Starting edit mode');
                                setIsEditing(true);
                            }}
                        >
                            Chỉnh sửa thông tin
                        </button>
                    ) : (
                        <>
                            <button
                                className={styles.cancelButton}
                                onClick={handleCancel}
                            >
                                Hủy
                            </button>
                            <button
                                className={styles.saveButton}
                                onClick={() => {
                                    console.log('Save button clicked');
                                    handleSave();
                                }}
                            >
                                Lưu thay đổi
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}