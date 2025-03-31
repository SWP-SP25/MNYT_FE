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
import { styled } from '@mui/material/styles';
import { getUserInfo } from "@/utils/getUserInfo";
interface FormSubmitData {
    birthType: BirthType;
    lastMenstrualPeriod: string;
    period: string;
    bpd: string;
    hc: string;
    length: string;
    efw: string;
}

// Thêm các component đã styled
const StyledDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiPaper-root': {
        borderRadius: '16px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
        padding: '8px',
        maxWidth: '500px',
        width: '100%'
    }
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#279357',
    textAlign: 'center',
    padding: '16px 24px 0'
}));

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
    padding: '20px 24px'
}));

const StyledDialogContentText = styled(DialogContentText)(({ theme }) => ({
    fontSize: '16px',
    color: '#4a5568',
    textAlign: 'center'
}));

const StyledDialogActions = styled(DialogActions)(({ theme }) => ({
    padding: '0 24px 20px',
    justifyContent: 'center',
    gap: '16px'
}));

const CancelButton = styled(Button)(({ theme }) => ({
    padding: '10px 24px',
    borderRadius: '8px',
    fontWeight: 'bold',
    color: '#279357',
    border: '2px solid #279357',
    backgroundColor: '#fff',
    '&:hover': {
        backgroundColor: '#f0fff4'
    }
}));

const ConfirmButton = styled(Button)(({ theme }) => ({
    padding: '10px 24px',
    borderRadius: '8px',
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: '#279357',
    '&:hover': {
        backgroundColor: '#1f7a47'
    }
}));

const AuthenticatedHomePage = () => {
    const { user } = useAuth();
    const userInfo = getUserInfo(user);
    const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
    const [hasActivePregnancy, setHasActivePregnancy] = useState(false);
    const [activePregnancyId, setActivePregnancyId] = useState<string | null>(null);
    const [activePregnancyData, setActivePregnancyData] = useState<any | null>(null);
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
            if (userInfo?.id) {
                try {
                    // Sử dụng API của bạn để lấy thông tin thai kỳ
                    const response = await axios.get(`https://api-mnyt.purintech.id.vn/api/Pregnancy/accountId/${userInfo.id}`);

                    // Kiểm tra xem có thai kỳ active không
                    const pregnancies = response.data;
                    const activePregnancy = pregnancies?.find((pregnancy: any) =>
                        pregnancy.status === 'active' || pregnancy.status === 'Active'
                    );

                    setHasActivePregnancy(!!activePregnancy);
                    if (activePregnancy) {
                        setActivePregnancyId(activePregnancy.id);
                        // Lưu lại toàn bộ thông tin của thai kỳ để sử dụng khi update
                        setActivePregnancyData(activePregnancy);
                    }
                    console.log('Active pregnancy status:', !!activePregnancy);
                    console.log('Active pregnancy ID:', activePregnancy?.id);
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
            // Hiển thị dialog xác nhận thay vì snackbar
            setConfirmDialog({
                open: true,
                title: "Xác nhận dừng thai kỳ hiện tại",
                message: "Hiện tại mẹ đang có thai kỳ đang trong thời gian sinh trưởng, mẹ muốn dừng sao?"
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
        if (!activePregnancyId || !activePregnancyData) {
            console.error('No active pregnancy data found!');
            handleCloseDialog();
            return;
        }

        try {
            setIsDeleting(true);

            // Log original values before any changes
            console.log('Original pregnancy data:', activePregnancyData);
            console.log('Pregnancy ID to update:', activePregnancyId);
            console.log('Original status value:', activePregnancyData.status);

            // Tạo payload với dữ liệu hiện tại và chỉ cập nhật status thành inActive
            const updatePayload = {
                ...activePregnancyData,
                status: "inActive"  // Chỉ thay đổi status, giữ nguyên isDeleted
            };

            console.log('Update payload before sending to API:', JSON.stringify(updatePayload, null, 2));
            console.log('API endpoint:', `https://api-mnyt.purintech.id.vn/api/Pregnancy`);
            console.log('HTTP method:', 'PUT');

            // Sử dụng PUT method để cập nhật
            const response = await axios.put(`https://api-mnyt.purintech.id.vn/api/Pregnancy`, updatePayload);
            console.log('Update response status:', response.status);
            console.log('Update response data:', response.data);

            // Đóng dialog
            handleCloseDialog();

            // Hiển thị thông báo thành công
            setSnackbar({
                open: true,
                message: "Đã dừng thai kỳ thành công! Bạn có thể tạo thai kỳ mới.",
                severity: 'success'
            });

            // Cập nhật lại trạng thái
            setHasActivePregnancy(false);
            setActivePregnancyId(null);
            setActivePregnancyData(null);

            // Mở form tạo mới
            setIsFormOpen(true);

        } catch (error: any) {
            console.error('Update request failed:', error);

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
                message: "Có lỗi xảy ra khi dừng thai kỳ. Vui lòng thử lại sau.",
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
                        <h1>Chào Mừng Bạn Đã Quay Trở Lại {userInfo?.fullName}</h1>
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

            {/* Dialog xác nhận đã được styled */}
            <StyledDialog
                open={confirmDialog.open}
                onClose={handleCloseDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <StyledDialogTitle id="alert-dialog-title">
                    {confirmDialog.title}
                </StyledDialogTitle>
                <StyledDialogContent>
                    <StyledDialogContentText id="alert-dialog-description">
                        {confirmDialog.message}
                    </StyledDialogContentText>
                </StyledDialogContent>
                <StyledDialogActions>
                    <CancelButton
                        onClick={handleCloseDialog}
                        disabled={isDeleting}
                    >
                        Không
                    </CancelButton>
                    <ConfirmButton
                        onClick={handleConfirmCreateNew}
                        autoFocus
                        disabled={isDeleting}
                    >
                        {isDeleting ? 'Đang xử lý...' : 'Có, tạo mới'}
                    </ConfirmButton>
                </StyledDialogActions>
            </StyledDialog>

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
