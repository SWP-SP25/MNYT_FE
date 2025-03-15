import React, { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import ReactDOM from 'react-dom';
import styles from './fetus-form.module.css';
import { FormFetusData, BirthTypeFormProps, BirthType } from '@/types/form';
import { useAuth } from "@/hooks/useAuth";
import axios from 'axios';

const BirthTypeForm: React.FC<BirthTypeFormProps> = ({ isOpen, onClose, onSubmit }) => {
    const { user } = useAuth();
    const [birthType, setBirthType] = useState<BirthType>('singletons');
    const [formData, setFormData] = useState<FormFetusData>({
        lastMenstrualPeriod: '',
        period: '',
        bpd: '',
        hc: '',
        length: '',
        efw: ''
    });
    const [submittedData, setSubmittedData] = useState<any>(null);
    const [showSubmitInfo, setShowSubmitInfo] = useState<boolean>(false);

    // Xử lý khi người dùng chọn loại sinh
    const handleBirthTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setBirthType(e.target.value as BirthType);
    };

    // Xử lý khi người dùng thay đổi các trường input
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Xử lý khi người dùng submit form
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            console.log('Form data before submission:', formData);
            console.log('Birth type:', birthType);
            console.log('User ID:', user?.id);

            // 1. Tạo pregnancy trước
            const pregnancyData = {
                accountId: user?.id,
                type: birthType,
                status: "active",
                startDate: formData.lastMenstrualPeriod
            };

            console.log('Pregnancy data to be sent:', pregnancyData);

            // Gọi API tạo pregnancy
            console.log('Calling Pregnancy API...');
            const pregnancyResponse = await axios.post(
                'https://api-mnyt.purintech.id.vn/api/Pregnancy',
                pregnancyData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            console.log('Pregnancy API response:', pregnancyResponse);
            console.log('Pregnancy created successfully:', pregnancyResponse.data);

            // Lấy ID của pregnancy vừa tạo
            const pregnancyId = pregnancyResponse.data.id;
            console.log('Pregnancy ID:', pregnancyId);

            // 2. Tạo fetus cho bé thứ nhất
            const fetusData = {
                name: "none",
                gender: "none",
                pregnancyId: pregnancyId,
                bpd: formData.bpd,
                hc: formData.hc,
                length: formData.length,
                efw: formData.efw,
                period: formData.period
            };

            console.log('Fetus data to be sent:', fetusData);

            // Gọi API tạo fetus
            console.log('Calling Fetus API for first baby...');
            const fetusResponse = await axios.post(
                'https://api-mnyt.purintech.id.vn/api/Fetus',
                fetusData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            console.log('Fetus API response:', fetusResponse);
            console.log('First fetus created successfully:', fetusResponse.data);

            // 3. Nếu là sinh đôi, tạo thêm fetus cho bé thứ hai
            if (birthType === 'twins' && formData.bpd2 && formData.hc2 && formData.length2 && formData.efw2) {
                console.log('Creating second fetus for twins...');

                const fetusData2 = {
                    name: "none",
                    gender: "none",
                    pregnancyId: pregnancyId,
                    bpd: formData.bpd2,
                    hc: formData.hc2,
                    length: formData.length2,
                    efw: formData.efw2,
                    period: formData.period
                };

                console.log('Second fetus data to be sent:', fetusData2);

                console.log('Calling Fetus API for second baby...');
                const fetusResponse2 = await axios.post(
                    'https://api-mnyt.purintech.id.vn/api/Fetus',
                    fetusData2,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    }
                );

                console.log('Second fetus API response:', fetusResponse2);
                console.log('Second fetus created successfully:', fetusResponse2.data);
            }

            console.log('All API calls completed successfully!');

            // Hiển thị thông báo thành công
            alert('Đã khởi tạo thai kỳ thành công!');

            // Gọi hàm onSubmit từ props
            onSubmit({ birthType, ...formData });
            console.log('onSubmit called with data:', { birthType, ...formData });

            // Reset form
            setBirthType('singletons');
            setFormData({
                lastMenstrualPeriod: '',
                period: '',
                bpd: '',
                hc: '',
                length: '',
                efw: ''
            });
            console.log('Form reset completed');

            // Đóng form
            onClose();
            console.log('Form closed');

        } catch (error) {
            console.error('Error details:', error);

            if (axios.isAxiosError(error)) {
                console.error('API error response:', error.response?.data);
                console.error('API error status:', error.response?.status);
                console.error('API error headers:', error.response?.headers);
            }

            console.error('Error creating pregnancy or fetus:', error);
            alert('Có lỗi xảy ra khi khởi tạo thai kỳ. Vui lòng thử lại!');
        }
    };

    if (!isOpen) {
        return showSubmitInfo ? (
            <div className={styles.submittedDataOverlay}>
                <div className={styles.submittedDataContainer}>
                    <h3>Dữ liệu đã gửi:</h3>
                    <pre>{JSON.stringify(submittedData, null, 2)}</pre>
                    <button onClick={() => setShowSubmitInfo(false)}>Đóng</button>
                </div>
            </div>
        ) : null;
    }

    // Sử dụng React Portal để render popup trực tiếp vào body
    return ReactDOM.createPortal(
        <>
            <div className={styles.popupOverlay}>
                <div className={styles.popupContainer}>
                    <div className={styles.popupHeader}>
                        <h2>Khởi tạo thai kì</h2>
                        <button className={styles.closeButton} onClick={onClose}>×</button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className={styles.formGroup}>
                            <label htmlFor="birthType">Mẹ mang bầu mấy bé nè?</label>
                            <select
                                id="birthType"
                                value={birthType}
                                onChange={handleBirthTypeChange}
                                required
                            >
                                <option value="singletons">1 bé ( Sinh Đơn )</option>
                                <option value="twins">2 bé ( Sinh đôi )</option>
                            </select>
                        </div>

                        <>
                            <div className={styles.formGroup}>
                                <label htmlFor="lastMenstrualPeriod">Ngày hết kinh gần nhất</label>
                                <input
                                    type="Date"
                                    id="lastMenstrualPeriod"
                                    name="lastMenstrualPeriod"
                                    value={formData.lastMenstrualPeriod}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="period">Bé được mấy tuần tuổi rồi?</label>
                                <input
                                    type="string"
                                    id="period"
                                    name="period"
                                    value={formData.period}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className={styles.formSection}>
                                <p className={styles.sectionTitle}>Mẹ nhập giúp các chỉ số của bé dưới này nhé</p>

                                <div className={styles.formRow}>
                                    <div className={styles.formGroupHalf}>
                                        <label htmlFor="bpd">BPD (mm):</label>
                                        <input
                                            type="string"
                                            id="bpd"
                                            name="bpd"
                                            value={formData.bpd}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    <div className={styles.formGroupHalf}>
                                        <label htmlFor="hc">HC (mm):</label>
                                        <input
                                            type="string"
                                            id="hc"
                                            name="hc"
                                            value={formData.hc}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className={styles.formRow}>
                                    <div className={styles.formGroupHalf}>
                                        <label htmlFor="length">Chiều dài (mm):</label>
                                        <input
                                            type="string"
                                            id="length"
                                            name="length"
                                            value={formData.length}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    <div className={styles.formGroupHalf}>
                                        <label htmlFor="efw">EFW (g):</label>
                                        <input
                                            type="string"
                                            id="efw"
                                            name="efw"
                                            value={formData.efw}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {birthType === 'twins' && (
                                <div className={styles.formGroup}>
                                    <label htmlFor="additionalInfo">Thông tin thêm về sinh đôi:</label>
                                    <textarea
                                        id="additionalInfo"
                                        name="additionalInfo"
                                        value={formData.additionalInfo}
                                        onChange={handleInputChange}
                                        rows={3}
                                    />
                                </div>
                            )}

                            <div className={styles.formActions}>
                                <button type="button" onClick={onClose}>Hủy</button>
                                <button type="submit">Lưu</button>
                            </div>
                        </>
                    </form>
                </div>
            </div>

            {showSubmitInfo && (
                <div className={styles.submittedDataOverlay}>
                    <div className={styles.submittedDataContainer}>
                        <h3>Dữ liệu đã gửi:</h3>
                        <pre>{JSON.stringify(submittedData, null, 2)}</pre>
                        <button onClick={() => setShowSubmitInfo(false)}>Đóng</button>
                    </div>
                </div>
            )}
        </>,
        document.body
    );
};

export default BirthTypeForm;