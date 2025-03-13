import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { User } from '@/types/user';
import { Pregnancy, FetusInput } from '@/types/pregnancy';
import './pregnancy-setup-form.css';

interface PregnancySetupFormProps {
    user: User;
    onComplete?: (pregnancy: Pregnancy) => void;
}

const PregnancySetupForm: React.FC<PregnancySetupFormProps> = ({ user, onComplete }) => {
    const router = useRouter();
    const [step, setStep] = useState<'pregnancy' | 'fetus'>('pregnancy');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [pregnancy, setPregnancy] = useState<Pregnancy | null>(null);
    const [fetusCount, setFetusCount] = useState<number>(1);

    // Form data cho pregnancy
    const [pregnancyData, setPregnancyData] = useState({
        type: 'singleton',
        status: 'active',
    });

    // Form data cho fetus (mảng các fetus dựa trên số lượng)
    const [fetusData, setFetusData] = useState<FetusInput[]>([
        {
            inputPeriod: 0,
            weight: 0,
            bpd: 0,
            length: 0,
            hc: 0,
            date: new Date().toISOString().split('T')[0],
            fetusId: 0
        }
    ]);

    // Cấu hình axios
    const axiosInstance = axios.create({
        baseURL: 'https://api-mnyt.purintech.id.vn/api',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    // Thêm interceptor để tự động thêm token vào header
    axiosInstance.interceptors.request.use(
        (config) => {
            const token = Cookies.get('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    // Cập nhật số lượng fetus dựa trên loại thai
    useEffect(() => {
        if (pregnancyData.type === 'singleton') {
            setFetusCount(1);
            // Nếu chuyển từ sinh đôi sang sinh đơn, cắt bớt mảng fetus data
            if (fetusData.length > 1) {
                setFetusData([fetusData[0]]);
            }
        } else if (pregnancyData.type === 'doubleton') {
            setFetusCount(2);
            // Nếu chuyển từ sinh đơn sang sinh đôi, thêm một fetus mới
            if (fetusData.length < 2) {
                setFetusData([
                    ...fetusData,
                    {
                        inputPeriod: 0,
                        weight: 0,
                        bpd: 0,
                        length: 0,
                        hc: 0,
                        date: new Date().toISOString().split('T')[0],
                        fetusId: 0
                    }
                ]);
            }
        }
    }, [pregnancyData.type]);

    // Xử lý thay đổi form pregnancy
    const handlePregnancyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setPregnancyData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Xử lý thay đổi form fetus
    const handleFetusChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const newFetusData = [...fetusData];
        newFetusData[index] = {
            ...newFetusData[index],
            [name]: name === 'date' ? value : parseFloat(value)
        };
        setFetusData(newFetusData);
    };

    // Tạo pregnancy
    const createPregnancy = async () => {
        if (!user) return;

        setLoading(true);
        setError(null);

        try {
            const response = await axiosInstance.post<Pregnancy>('/Pregnancy', {
                accountId: user.id,
                type: pregnancyData.type,
                status: pregnancyData.status,
                endDate: null
            });

            if (response.data) {
                setPregnancy(response.data);
                // Chuyển sang bước tạo fetus
                setStep('fetus');

                // Cập nhật fetusId trong form data
                const updatedFetusData = fetusData.map(fetus => ({
                    ...fetus,
                    fetusId: 0 // Sẽ được cập nhật sau khi tạo fetus
                }));
                setFetusData(updatedFetusData);

                return response.data;
            }
            throw new Error('Không thể tạo thông tin thai kỳ');
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Lỗi khi tạo thông tin thai kỳ';
            setError(errorMessage);
            console.error("Lỗi khi tạo thông tin thai kỳ:", err);
        } finally {
            setLoading(false);
        }
    };

    // Tạo fetus
    const createFetus = async (pregnancyId: number) => {
        setLoading(true);
        setError(null);

        try {
            // Tạo các fetus dựa trên số lượng
            const fetusPromises = Array(fetusCount).fill(null).map((_, index) =>
                axiosInstance.post('/Fetus', {
                    pregnancyId: pregnancyId,
                    name: `Fetus ${index + 1}`,
                    gender: 'unknown',
                    status: 'active'
                })
            );

            const fetusResponses = await Promise.all(fetusPromises);

            // Lấy các fetusId từ response
            const fetusIds = fetusResponses.map(response => response.data.id);

            // Cập nhật fetusId trong form data
            const updatedFetusData = fetusData.map((fetus, index) => ({
                ...fetus,
                fetusId: fetusIds[index]
            }));
            setFetusData(updatedFetusData);

            // Tạo các fetus record
            const recordPromises = updatedFetusData.map(fetus =>
                axiosInstance.post('/FetusRecord', fetus)
            );

            await Promise.all(recordPromises);

            // Lưu pregnancy vào cookie
            if (pregnancy) {
                Cookies.set('pregnancy', JSON.stringify(pregnancy), { expires: 7 });
            }

            // Gọi callback onComplete nếu có
            if (onComplete && pregnancy) {
                onComplete(pregnancy);
            }

            // Chuyển hướng đến trang dashboard sau khi hoàn tất
            router.push('/dashboard');
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Lỗi khi tạo thông tin thai nhi';
            setError(errorMessage);
            console.error("Lỗi khi tạo thông tin thai nhi:", err);
        } finally {
            setLoading(false);
        }
    };

    // Xử lý submit form pregnancy
    const handlePregnancySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const pregnancyResult = await createPregnancy();
        if (pregnancyResult) {
            // Tự động chuyển sang form fetus
            setStep('fetus');
        }
    };

    // Xử lý submit form fetus
    const handleFetusSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (pregnancy) {
            await createFetus(pregnancy.id);
        }
    };

    return (
        <div className="pregnancy-setup-container">
            <h2>Thiết lập thông tin thai kỳ</h2>

            {error && <div className="error-message">{error}</div>}

            {step === 'pregnancy' ? (
                <div className="pregnancy-setup">
                    <form onSubmit={handlePregnancySubmit} className="pregnancy-form">
                        <div className="form-group">
                            <label htmlFor="type">Loại thai:</label>
                            <select
                                id="type"
                                name="type"
                                value={pregnancyData.type}
                                onChange={handlePregnancyChange}
                                required
                            >
                                <option value="singleton">Sinh đơn</option>
                                <option value="doubleton">Sinh đôi</option>
                            </select>
                        </div>

                        <div className="pregnancy-type-info">
                            {pregnancyData.type === 'singleton' ? (
                                <p>Bạn đã chọn sinh đơn. Hệ thống sẽ tạo 1 thai nhi.</p>
                            ) : (
                                <p>Bạn đã chọn sinh đôi. Hệ thống sẽ tạo 2 thai nhi.</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="submit-button"
                            disabled={loading}
                        >
                            {loading ? 'Đang xử lý...' : 'Tiếp tục'}
                        </button>
                    </form>
                </div>
            ) : (
                <div className="fetus-setup">
                    <h3>Thiết lập thông tin thai nhi</h3>
                    <form onSubmit={handleFetusSubmit} className="fetus-form">
                        {Array(fetusCount).fill(null).map((_, index) => (
                            <div key={index} className="fetus-card">
                                <h4>Thai nhi {index + 1}</h4>

                                <div className="form-group">
                                    <label htmlFor={`inputPeriod-${index}`}>Tuần tuổi:</label>
                                    <input
                                        type="number"
                                        id={`inputPeriod-${index}`}
                                        name="inputPeriod"
                                        value={fetusData[index].inputPeriod}
                                        onChange={(e) => handleFetusChange(index, e as React.ChangeEvent<HTMLInputElement>)}
                                        min="0"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor={`weight-${index}`}>Cân nặng (g):</label>
                                    <input
                                        type="number"
                                        id={`weight-${index}`}
                                        name="weight"
                                        value={fetusData[index].weight}
                                        onChange={(e) => handleFetusChange(index, e as React.ChangeEvent<HTMLInputElement>)}
                                        min="0"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor={`length-${index}`}>Chiều dài (cm):</label>
                                    <input
                                        type="number"
                                        id={`length-${index}`}
                                        name="length"
                                        value={fetusData[index].length}
                                        onChange={(e) => handleFetusChange(index, e as React.ChangeEvent<HTMLInputElement>)}
                                        min="0"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor={`bpd-${index}`}>BPD (mm):</label>
                                    <input
                                        type="number"
                                        id={`bpd-${index}`}
                                        name="bpd"
                                        value={fetusData[index].bpd}
                                        onChange={(e) => handleFetusChange(index, e as React.ChangeEvent<HTMLInputElement>)}
                                        min="0"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor={`hc-${index}`}>HC (mm):</label>
                                    <input
                                        type="number"
                                        id={`hc-${index}`}
                                        name="hc"
                                        value={fetusData[index].hc}
                                        onChange={(e) => handleFetusChange(index, e as React.ChangeEvent<HTMLInputElement>)}
                                        min="0"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor={`date-${index}`}>Ngày khám:</label>
                                    <input
                                        type="date"
                                        id={`date-${index}`}
                                        name="date"
                                        value={fetusData[index].date}
                                        onChange={(e) => handleFetusChange(index, e as React.ChangeEvent<HTMLInputElement>)}
                                        required
                                    />
                                </div>
                            </div>
                        ))}

                        <div className="form-actions">
                            <button
                                type="button"
                                className="back-button"
                                onClick={() => setStep('pregnancy')}
                                disabled={loading}
                            >
                                Quay lại
                            </button>
                            <button
                                type="submit"
                                className="submit-button"
                                disabled={loading}
                            >
                                {loading ? 'Đang xử lý...' : 'Hoàn tất'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default PregnancySetupForm;