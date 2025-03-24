'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';
import componentStyles from './components.module.css';
import { useAuth } from '@/hooks/useAuth';
import axios from 'axios';

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

export default function AccountInfoPage() {
    const [userData, setUserData] = useState<UserData | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();

    // Form data state
    const [formData, setFormData] = useState({
        userName: '',
        fullName: '',
        email: '',
        phoneNumber: '',
    });

    useEffect(() => {
        // Fetch user data when component mounts
        if (user) {
            fetchUserData(user?.id);
        }
    }, [user]);

    const fetchUserData = async (userId: string) => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get(`https://api-mnyt.purintech.id.vn/api/Accounts/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${user?.token}`
                }
            });

            if (response.data.success) {
                const userData = response.data.data;
                setUserData(userData);
                // Initialize form data with user data, handle null values
                setFormData({
                    userName: userData.userName || '',
                    fullName: userData.fullName || '',
                    email: userData.email || '',
                    phoneNumber: userData.phoneNumber || '',
                });
            } else {
                setError('Không thể lấy thông tin người dùng');
            }
        } catch (err) {
            setError('Đã xảy ra lỗi khi tải thông tin người dùng');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSave = async () => {
        if (!userData || !user) return;

        setLoading(true);
        setError(null);

        try {
            // Prepare data for update
            const updateData = {
                fullName: formData.fullName,
                phoneNumber: formData.phoneNumber,
                userName: formData.userName,
                email: formData.email,
                // Bỏ phần password
            };

            const response = await axios.put(`https://api-mnyt.purintech.id.vn/api/Accounts/${userData.id}`, updateData, {
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.success) {
                // Refresh user data after update
                fetchUserData(userData.id.toString());
                setIsEditing(false);
                alert('Thông tin đã được cập nhật thành công!');
            } else {
                setError('Không thể cập nhật thông tin người dùng');
            }
        } catch (err: any) {
            console.error('Error details:', err);
            setError('Đã xảy ra lỗi khi cập nhật thông tin: ' + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        // Reset form data to current user data
        if (userData) {
            setFormData({
                userName: userData.userName || '',
                fullName: userData.fullName || '',
                email: userData.email || '',
                phoneNumber: userData.phoneNumber || '',
            });
        }
        setIsEditing(false);
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

    return (
        <div className={componentStyles.card}>
            <h3>Thông tin cá nhân</h3>

            {loading ? (
                <div className={styles.loadingContainer}>
                    <p>Đang tải thông tin người dùng...</p>
                </div>
            ) : error ? (
                <div className={styles.errorContainer}>
                    <p>{error}</p>
                    <button
                        onClick={() => user && fetchUserData(user?.id)}
                        className={`${componentStyles.button} ${componentStyles.primaryButton}`}
                        style={{ marginTop: '10px' }}
                    >
                        Thử lại
                    </button>
                </div>
            ) : userData ? (
                <>
                    <div className={styles.userInfo}>
                        <div className={styles.avatar}>
                            <div className={styles.avatarImg}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z" />
                                </svg>
                            </div>
                        </div>
                        <div className={styles.userDetails}>
                            <h4>{userData.fullName || 'Chưa cập nhật tên'}</h4>
                            <p>@{userData.userName || ''}</p>
                            <p>{userData.email || 'Chưa cập nhật email'}</p>
                            <p>Thành viên từ: {formatDate(userData.createDate)}</p>
                            <p className={styles.userRole}>
                                {userData.role || 'User'} - {userData.status || 'N/A'}
                            </p>
                        </div>
                    </div>

                    <form>
                        <div className={componentStyles.formGroup}>
                            <label htmlFor="userName">Tên đăng nhập</label>
                            <input
                                type="text"
                                id="userName"
                                name="userName"
                                value={formData.userName}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                            />
                        </div>

                        <div className={componentStyles.formGroup}>
                            <label htmlFor="fullName">Họ và tên</label>
                            <input
                                type="text"
                                id="fullName"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                            />
                        </div>

                        <div className={componentStyles.formGroup}>
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                            />
                        </div>

                        <div className={componentStyles.formGroup}>
                            <label htmlFor="phoneNumber">Số điện thoại</label>
                            <input
                                type="tel"
                                id="phoneNumber"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                            />
                        </div>

                        <div className={componentStyles.buttonGroup}>
                            {!isEditing ? (
                                <button
                                    type="button"
                                    className={`${componentStyles.button} ${componentStyles.primaryButton}`}
                                    onClick={() => setIsEditing(true)}
                                >
                                    Chỉnh sửa
                                </button>
                            ) : (
                                <>
                                    <button
                                        type="button"
                                        className={`${componentStyles.button} ${componentStyles.secondaryButton}`}
                                        onClick={handleCancel}
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        type="button"
                                        className={`${componentStyles.button} ${componentStyles.primaryButton}`}
                                        onClick={handleSave}
                                        disabled={loading}
                                    >
                                        {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                                    </button>
                                </>
                            )}
                        </div>
                    </form>
                </>
            ) : (
                <p>Không tìm thấy thông tin người dùng.</p>
            )}
        </div>
    );
}