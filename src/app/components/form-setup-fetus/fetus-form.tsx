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
            console.log('Auth token exists:', !!localStorage.getItem('token'));

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

            console.log('Pregnancy API response status:', pregnancyResponse.status);
            console.log('Full pregnancy response:', pregnancyResponse.data);

            // Lấy ID của pregnancy vừa tạo
            let pregnancyId;
            if (pregnancyResponse.data.data && pregnancyResponse.data.data.id) {
                pregnancyId = pregnancyResponse.data.data.id;
            } else if (pregnancyResponse.data.id) {
                pregnancyId = pregnancyResponse.data.id;
            } else {
                console.error('Cannot find pregnancy ID in response:', pregnancyResponse.data);
                throw new Error('Pregnancy ID not found in response');
            }

            console.log('Extracted Pregnancy ID:', pregnancyId);

            // 2. Tạo fetus cho bé thứ nhất (chỉ với thông tin cơ bản)
            const fetusData = {
                name: "none",
                gender: "none",
                pregnancyId: pregnancyId
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

            console.log('Fetus API response status:', fetusResponse.status);
            console.log('Full fetus response:', fetusResponse.data);

            // Lấy ID của fetus vừa tạo
            let fetusId;
            if (fetusResponse.data.data && fetusResponse.data.data.id) {
                fetusId = fetusResponse.data.data.id;
            } else if (fetusResponse.data.id) {
                fetusId = fetusResponse.data.id;
            } else {
                console.error('Cannot find fetus ID in response:', fetusResponse.data);
                throw new Error('Fetus ID not found in response');
            }

            console.log('Extracted Fetus ID:', fetusId);

            // 3. Tạo FetusRecord với các thông số đo lường
            const fetusRecordData = {
                inputPeriod: formData.period,
                weight: formData.efw, // EFW là ước tính cân nặng
                bpd: formData.bpd,
                length: formData.length,
                hc: formData.hc,
                date: new Date().toISOString().split('T')[0], // Ngày hiện tại
                fetusId: fetusId
            };

            console.log('FetusRecord data to be sent (string values):', fetusRecordData);

            // Gọi API tạo FetusRecord
            console.log('Calling FetusRecord API for first baby...');
            const fetusRecordResponse = await axios.post(
                'https://api-mnyt.purintech.id.vn/api/FetusRecord',
                fetusRecordData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            console.log('FetusRecord API response status:', fetusRecordResponse.status);
            console.log('Full fetus record response:', fetusRecordResponse.data);

            // Lấy ID của fetusRecord vừa tạo
            let fetusRecordId;
            if (fetusRecordResponse.data.data && fetusRecordResponse.data.data.id) {
                fetusRecordId = fetusRecordResponse.data.data.id;
            } else if (fetusRecordResponse.data.id) {
                fetusRecordId = fetusRecordResponse.data.id;
            } else {
                console.error('Cannot find fetus record ID in response:', fetusRecordResponse.data);
                fetusRecordId = 'unknown';
            }

            console.log('Extracted Fetus Record ID:', fetusRecordId);

            // 4. Nếu là sinh đôi, tạo thêm fetus và fetusRecord cho bé thứ hai
            let fetusId2, fetusRecordId2;
            if (birthType === 'twins' && formData.bpd2 && formData.hc2 && formData.length2 && formData.efw2) {
                console.log('Creating second fetus for twins...');

                const fetusData2 = {
                    name: "none",
                    gender: "none",
                    pregnancyId: pregnancyId
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

                console.log('Second fetus API response status:', fetusResponse2.status);
                console.log('Full second fetus response:', fetusResponse2.data);

                // Lấy ID của fetus thứ hai
                if (fetusResponse2.data.data && fetusResponse2.data.data.id) {
                    fetusId2 = fetusResponse2.data.data.id;
                } else if (fetusResponse2.data.id) {
                    fetusId2 = fetusResponse2.data.id;
                } else {
                    console.error('Cannot find second fetus ID in response:', fetusResponse2.data);
                    throw new Error('Second fetus ID not found in response');
                }

                console.log('Extracted Second Fetus ID:', fetusId2);

                // Tạo FetusRecord cho bé thứ hai
                const fetusRecordData2 = {
                    inputPeriod: formData.period,
                    weight: formData.efw2,
                    bpd: formData.bpd2,
                    length: formData.length2,
                    hc: formData.hc2,
                    date: new Date().toISOString().split('T')[0],
                    fetusId: fetusId2
                };

                console.log('Second FetusRecord data to be sent (string values):', fetusRecordData2);

                console.log('Calling FetusRecord API for second baby...');
                const fetusRecordResponse2 = await axios.post(
                    'https://api-mnyt.purintech.id.vn/api/FetusRecord',
                    fetusRecordData2,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    }
                );

                console.log('Second FetusRecord API response status:', fetusRecordResponse2.status);
                console.log('Full second fetus record response:', fetusRecordResponse2.data);

                // Lấy ID của fetusRecord thứ hai
                if (fetusRecordResponse2.data.data && fetusRecordResponse2.data.data.id) {
                    fetusRecordId2 = fetusRecordResponse2.data.data.id;
                } else if (fetusRecordResponse2.data.id) {
                    fetusRecordId2 = fetusRecordResponse2.data.id;
                } else {
                    console.error('Cannot find second fetus record ID in response:', fetusRecordResponse2.data);
                    fetusRecordId2 = 'unknown';
                }

                console.log('Extracted Second Fetus Record ID:', fetusRecordId2);
            }

            // Tổng hợp dữ liệu đã tạo
            const summaryData = {
                pregnancy: {
                    id: pregnancyId,
                    type: birthType,
                    accountId: user?.id,
                    startDate: formData.lastMenstrualPeriod
                },
                firstFetus: {
                    id: fetusId,
                    pregnancyId: pregnancyId
                },
                firstFetusRecord: {
                    id: fetusRecordId,
                    fetusId: fetusId,
                    measurements: {
                        bpd: formData.bpd,
                        hc: formData.hc,
                        length: formData.length,
                        weight: formData.efw,
                        inputPeriod: formData.period
                    }
                },
                ...(birthType === 'twins' && fetusId2 ? {
                    secondFetus: {
                        id: fetusId2,
                        pregnancyId: pregnancyId
                    },
                    secondFetusRecord: {
                        id: fetusRecordId2,
                        fetusId: fetusId2,
                        measurements: {
                            bpd: formData.bpd2,
                            hc: formData.hc2,
                            length: formData.length2,
                            weight: formData.efw2,
                            inputPeriod: formData.period
                        }
                    }
                } : {})
            };

            console.log('All API calls completed successfully!');
            console.log('Summary of created data:', summaryData);

            // Lưu dữ liệu đã submit để hiển thị nếu cần
            setSubmittedData(summaryData);

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
                console.error('API error config:', error.config);
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
                                        <label htmlFor="bpd">BPD (mm)</label>
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
                                        <label htmlFor="hc">HC (mm)</label>
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
                                        <label htmlFor="length">CRL (mm)</label>
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
                                        <label htmlFor="efw">EFW (gram)</label>
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
                                <div className={styles.formSection}>
                                    <p className={styles.sectionTitle}>Mẹ nhập giúp các chỉ số của bé thứ hai dưới này nhé</p>

                                    <div className={styles.formRow}>
                                        <div className={styles.formGroupHalf}>
                                            <label htmlFor="bpd2">BPD (mm):</label>
                                            <input
                                                type="string"
                                                id="bpd2"
                                                name="bpd2"
                                                value={formData.bpd2 || ''}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>

                                        <div className={styles.formGroupHalf}>
                                            <label htmlFor="hc2">HC (mm):</label>
                                            <input
                                                type="string"
                                                id="hc2"
                                                name="hc2"
                                                value={formData.hc2 || ''}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className={styles.formRow}>
                                        <div className={styles.formGroupHalf}>
                                            <label htmlFor="length2">Chiều dài (mm):</label>
                                            <input
                                                type="string"
                                                id="length2"
                                                name="length2"
                                                value={formData.length2 || ''}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>

                                        <div className={styles.formGroupHalf}>
                                            <label htmlFor="efw2">EFW (g):</label>
                                            <input
                                                type="string"
                                                id="efw2"
                                                name="efw2"
                                                value={formData.efw2 || ''}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label htmlFor="additionalInfo">Thông tin thêm về sinh đôi:</label>
                                        <textarea
                                            id="additionalInfo"
                                            name="additionalInfo"
                                            value={formData.additionalInfo || ''}
                                            onChange={handleInputChange}
                                            rows={3}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className={styles.formNote}>
                                <p><strong>Chú thích:</strong></p>
                                <ul>
                                    <li><strong>BPD</strong> - Đường kính lưỡng đỉnh (Biparietal Diameter)</li>
                                    <li><strong>HC</strong> - Chu vi đầu (Head Circumference)</li>
                                    <li><strong>CRL</strong> - Chiều dài đầu mông (Crown-Rump Length)</li>
                                    <li><strong>EFW</strong> - Ước tính cân nặng thai nhi (Estimated Fetal Weight)</li>
                                </ul>
                            </div>

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