"use client";
import { useAuth } from "@/hooks/useAuth";
import styles from "./auth-homepage.module.css";
import AppSlider from "../../components/slider/app-slider";
import Link from "next/link";
import Image from "next/image";
import { FaCalendarAlt, FaBabyCarriage, FaBookMedical, FaUserMd } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import BirthTypeForm from '@/app/components/form-setup-fetus/fetus-form';
import { BirthType, FormFetusData } from '@/types/form';
import { Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import axios from 'axios';

interface FormSubmitData {
  birthType: BirthType;
  lastMenstrualPeriod: string;
  period: string;
  bpd: string;
  hc: string;
  length: string;
  efw: string;
}

const AuthenticatedHomePage = () => {
    const { user } = useAuth();
    const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
    const [hasActivePregnancy, setHasActivePregnancy] = useState(false);
    const [activePregnancyId, setActivePregnancyId] = useState<string | null>(null);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'info' as 'error' | 'info' | 'success' | 'warning'
    });
    const [confirmDialog, setConfirmDialog] = useState({
        open: false,
        title: '',
        message: ''
    });
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        // Kiểm tra xem người dùng có thai kỳ active không
        const checkActivePregnancy = async () => {
            if (user?.id) {
                try {
                    // Sử dụng API của bạn để lấy thông tin thai kỳ
                    const response = await axios.get(`https://api-mnyt.purintech.id.vn/api/Pregnancy/accountId/${user.id}`);

                    // Kiểm tra xem có thai kỳ active không
                    const pregnancies = response.data;
                    const activePregnancy = pregnancies?.find((pregnancy: any) =>
                        pregnancy.status === 'active' || pregnancy.status === 'Active'
                    );

                    setHasActivePregnancy(!!activePregnancy);
                    console.log('Active pregnancy status:', !!activePregnancy);
                } catch (error) {
                    console.error('Error checking active pregnancy:', error);
                    setHasActivePregnancy(false);
                }
            }
        };

        checkActivePregnancy();
    }, [user]);

    const handleOpenForm = () => {
        if (hasActivePregnancy) {
            // Hiển thị thông báo nếu người dùng đã có thai kỳ active
            setSnackbar({
                open: true,
                message: "Mẹ ơi, 1 người chỉ có thể có 1 thai kì 1 lần thôi",
                severity: 'warning'
            });
        } else {
            setIsFormOpen(true);
        }
    };

  const handleCloseForm = () => {
    setIsFormOpen(false);
  };

    const handleCloseDialog = () => {
        setConfirmDialog({ ...confirmDialog, open: false });
    };

    const handleConfirmCreateNew = async () => {
        if (!activePregnancyId) {
            console.error('No active pregnancy ID found!');
            handleCloseDialog();
            return;
        }

        try {
            setIsDeleting(true);

            console.log(`Attempting to update pregnancy with ID: ${activePregnancyId}`);
            console.log('Type of pregnancy ID:', typeof activePregnancyId);

            // Tạo payload đơn giản nhất có thể
            const updatePayload = {
                id: activePregnancyId,
                status: "inactive",
                isDeleted: true
            };

            console.log('Update payload:', updatePayload);

            // Thử gọi API PUT để cập nhật
            try {
                console.log('Sending PUT request to:', 'https://api-mnyt.purintech.id.vn/api/Pregnancy');
                const updateResponse = await axios.put(`https://api-mnyt.purintech.id.vn/api/Pregnancy`, updatePayload);
                console.log('Update response:', updateResponse);
                console.log('Update data:', updateResponse.data);
            } catch (putError) {
                console.error('PUT request failed:', putError);
                console.error('Error response:', putError.response);

                // Nếu PUT thất bại, thử dùng PATCH
                console.log('Trying PATCH request...');
                try {
                    const patchResponse = await axios.patch(`https://api-mnyt.purintech.id.vn/api/Pregnancy`, updatePayload);
                    console.log('PATCH response:', patchResponse);
                } catch (patchError) {
                    console.error('PATCH request failed:', patchError);
                    throw patchError; // Ném lỗi để catch bên ngoài xử lý
                }
            }

            // Đóng dialog
            handleCloseDialog();

            // Hiển thị thông báo thành công
            setSnackbar({
                open: true,
                message: "Đã xóa thai kỳ cũ thành công! Bạn có thể tạo thai kỳ mới.",
                severity: 'success'
            });

            // Cập nhật lại trạng thái
            setHasActivePregnancy(false);
            setActivePregnancyId(null);

            // Sau đó mở form tạo mới
            // ... code mở form tạo mới thai kỳ ...

        } catch (error) {
            console.error('All update attempts failed:', error);

            // Log chi tiết lỗi để debug
            if (error.response) {
                console.error('Error response data:', error.response.data);
                console.error('Error response status:', error.response.status);
            } else {
                console.error('Error message:', error.message);
            }

            // Hiển thị thông báo lỗi
            setSnackbar({
                open: true,
                message: "Có lỗi xảy ra khi xóa thai kỳ cũ. Vui lòng thử lại sau.",
                severity: 'error'
            });
        } finally {
            setIsDeleting(false);
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const handleFormSubmit = (data: FormSubmitData) => {
        console.log('Form submitted with data:', data);
        // Xử lý dữ liệu form ở đây
        // Ví dụ: gửi dữ liệu đến API
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className={styles.page}>
            <div className={styles.sliderWrapper}>
                <AppSlider />
            </div>

            <main className={styles.main}>
                {/* Hero Section */}
                <section className={styles.hero}>
                    <div className={styles.heroContent}>
                        <h1>Chào Mừng Bạn Đã Quay Trở Lại {user.fullName}</h1>
                        <p>Đồng hành cùng mẹ trong hành trình thai kỳ và chăm sóc em bé</p>
                        <div className={styles.heroButtons}>
                            <button
                                onClick={handleOpenForm}
                                className={styles.primaryButton}
                                disabled={isDeleting}
                            >
                                {isDeleting ? 'Đang xử lý...' : 'Thiết lập thai nhi'}
                            </button>
                            <Link href="/blog" className={styles.secondaryButton}>
                                Đọc Blog
                            </Link>
                        </div>
                    </div>
                    <div className={styles.heroImage}>
                        {/* <Image
                            src=""
                            alt=""
                            width={600}
                            height={400}
                            priority
                        /> */}
                    </div>
                </section>

                {/* Features Section */}
                <section className={styles.features}>
                    <h2>Dịch Vụ Của Chúng Tôi</h2>
                    <div className={styles.featureGrid}>
                        <div className={styles.featureCard}>
                            <FaCalendarAlt className={styles.featureIcon} />
                            <h3>Theo Dõi Thai Kỳ</h3>
                            <p>Lịch trình chi tiết và nhắc nhở quan trọng cho từng giai đoạn thai kỳ</p>
                        </div>
                        <div className={styles.featureCard}>
                            <FaBabyCarriage className={styles.featureIcon} />
                            <h3>Chăm Sóc Em Bé</h3>
                            <p>Hướng dẫn chăm sóc và theo dõi sự phát triển của bé</p>
                        </div>
                        <div className={styles.featureCard}>
                            <FaBookMedical className={styles.featureIcon} />
                            <h3>Kiến Thức Bổ Ích</h3>
                            <p>Chia sẻ kiến thức và kinh nghiệm từ các chuyên gia</p>
                        </div>
                        <div className={styles.featureCard}>
                            <FaUserMd className={styles.featureIcon} />
                            <h3>Tư Vấn Y Tế</h3>
                            <p>Kết nối với đội ngũ bác sĩ và chuyên gia dinh dưỡng</p>
                        </div>
                    </div>
                </section>

                {/* Blog Preview Section */}
                <section className={styles.blogPreview}>
                    <h2>Bài Viết Mới Nhất</h2>
                    <div className={styles.blogGrid}>
                        <div className={styles.blogCard}>
                            {/* <Image
                                src="/images/blog/nutrition.jpg"
                                alt="Dinh dưỡng thai kỳ"
                                width={300}
                                height={200}
                            /> */}
                            <div className={styles.blogContent}>
                                <h3>Dinh Dưỡng Trong Thai Kỳ</h3>
                                <p>Những thực phẩm cần thiết cho mẹ bầu...</p>
                                <Link href="/blog/nutrition" className={styles.readMore}>
                                    Đọc thêm →
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className={styles.cta}>
                    <div className={styles.ctaContent}>
                        <h2>Khám Phá Các Tính Năng</h2>
                        <p>Sử dụng đầy đủ các tính năng để theo dõi thai kỳ hiệu quả</p>
                        <Link href="/dashboard" className={styles.ctaButton}>
                            Đi Đến Dashboard
                        </Link>
                    </div>
                </section>
            </main>

            <BirthTypeForm
                isOpen={isFormOpen}
                onClose={handleCloseForm}
                onSubmit={handleFormSubmit}
            />

            {/* Dialog xác nhận */}
            <Dialog
                open={confirmDialog.open}
                onClose={handleCloseDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {confirmDialog.title}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {confirmDialog.message}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleCloseDialog}
                        color="primary"
                        disabled={isDeleting}
                    >
                        Không
                    </Button>
                    <Button
                        onClick={handleConfirmCreateNew}
                        color="primary"
                        autoFocus
                        disabled={isDeleting}
                    >
                        {isDeleting ? 'Đang xử lý...' : 'Có, tạo mới'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar thông báo */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default AuthenticatedHomePage;
