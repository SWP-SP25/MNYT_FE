'use client'
import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Space, Select, Row, Col, message, Spin, DatePicker } from 'antd';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '@/hooks/useAuth';
import styles from './form-update.module.css'; // Đổi thành CSS Module
import dayjs from 'dayjs'; // Sử dụng dayjs để xử lý ngày tháng với DatePicker

interface UpdateFormProps {
    onClose?: () => void;
}

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
};

export const UpdateForm: React.FC<UpdateFormProps> = ({ onClose }) => {
    const [form] = Form.useForm();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [fetusId, setFetusId] = useState<number | null>(null);
    const [existingRecordId, setExistingRecordId] = useState<number | null>(null);
    const [existingRecordData, setExistingRecordData] = useState<any>(null);
    const [selectedPeriod, setSelectedPeriod] = useState<number | null>(null);
    const [periodOptions, setPeriodOptions] = useState<number[]>([]);

    // Lấy danh sách các tuần thai có thể nhập
    useEffect(() => {
        const generatePeriodOptions = () => {
            // Tạo danh sách các tuần từ 4 đến 40
            const options = Array.from({ length: 37 }, (_, i) => i + 4);
            setPeriodOptions(options);
        };

        generatePeriodOptions();
    }, []);

    // Lấy fetusId khi component mount
    useEffect(() => {
        const fetchFetusId = async () => {
            if (!user?.id) return;

            try {
                setLoading(true);
                // Lấy pregnancy đang active
                const pregnancyResponse = await axios.get(`https://api-mnyt.purintech.id.vn/api/Pregnancy/accountId/${user.id}`);
                const activePregnancy = pregnancyResponse.data.find((p: any) =>
                    p.status === 'active' || p.status === 'Active'
                );

                if (!activePregnancy) {
                    message.error('Không tìm thấy thai kỳ đang hoạt động');
                    return;
                }

                // Lấy fetus đầu tiên của pregnancy
                const fetusResponse = await axios.get(`https://api-mnyt.purintech.id.vn/api/Fetus/pregnancyId/${activePregnancy.id}`);
                if (fetusResponse.data && fetusResponse.data.length > 0) {
                    const firstFetus = fetusResponse.data[0];
                    setFetusId(firstFetus.id);
                    console.log('Fetched fetus ID:', firstFetus.id);
                } else {
                    message.error('Không tìm thấy thông tin thai nhi');
                }
            } catch (error) {
                console.error('Error fetching fetus ID:', error);
                message.error('Lỗi khi lấy thông tin thai nhi');
            } finally {
                setLoading(false);
            }
        };

        fetchFetusId();
    }, [user?.id]);

    // Kiểm tra xem tuần thai đã có dữ liệu chưa
    const checkExistingRecord = async (period: number) => {
        if (!fetusId) return;

        try {
            setLoading(true);
            // Lấy tất cả fetus records
            const recordsResponse = await axios.get(`https://api-mnyt.purintech.id.vn/api/FetusRecord/fetusId/${fetusId}`);

            // Tìm record với inputPeriod trùng khớp
            const existingRecord = recordsResponse.data.find((record: any) =>
                record.inputPeriod === period
            );

            if (existingRecord) {
                console.log('Found existing record for period', period, ':', existingRecord);
                setExistingRecordId(existingRecord.id);
                setExistingRecordData(existingRecord);

                // Định dạng ngày tháng cho DatePicker (sử dụng dayjs)
                let dateValue = null;
                if (existingRecord.date) {
                    // Loại bỏ phần giờ nếu có
                    const dateStr = existingRecord.date.split('T')[0];
                    dateValue = dayjs(dateStr);
                }

                // Cập nhật form với dữ liệu hiện có
                form.setFieldsValue({
                    period: existingRecord.inputPeriod,
                    bpd: existingRecord.bpd,
                    hc: existingRecord.hc,
                    length: existingRecord.length,
                    weight: existingRecord.weight,
                    date: dateValue // Sử dụng dayjs object cho DatePicker
                });

                message.info('Đã tìm thấy dữ liệu cho tuần thai này. Bạn có thể cập nhật thông tin.');
            } else {
                console.log('No existing record for period', period);
                setExistingRecordId(null);
                setExistingRecordData(null);

                // Reset form khi chọn tuần mới
                form.setFieldsValue({
                    period: period,
                    bpd: '',
                    hc: '',
                    length: '',
                    weight: '',
                    date: dayjs() // Ngày hiện tại cho DatePicker
                });

                message.info('Bạn đang tạo dữ liệu mới cho tuần thai này.');
            }
        } catch (error) {
            console.error('Error checking existing records:', error);
            message.error('Lỗi khi kiểm tra dữ liệu hiện có');
        } finally {
            setLoading(false);
        }
    };

    const onPeriodChange = (value: number) => {
        setSelectedPeriod(value);
        checkExistingRecord(value);
    };

    const onFinish = async (values: any) => {
        if (!fetusId) {
            message.error('Không tìm thấy thông tin thai nhi');
            return;
        }

        try {
            setLoading(true);

            // Format ngày từ DatePicker (dayjs) sang string YYYY-MM-DD
            const formattedDate = values.date ? values.date.format('YYYY-MM-DD') : new Date().toISOString().split('T')[0];

            // Chuyển đổi các giá trị thành số
            const numericValues = {
                inputPeriod: parseInt(values.period.toString()),
                weight: parseInt(values.weight.toString()) || 0,
                bpd: parseInt(values.bpd.toString()) || 0,
                length: parseInt(values.length.toString()) || 0,
                hc: parseInt(values.hc.toString()) || 0,
                date: formattedDate, // Sử dụng ngày đã format
                fetusId: fetusId
            };

            console.log('Converted values to send:', numericValues);

            let response;

            // Nếu đã có record, cập nhật bằng PUT
            if (existingRecordId) {
                console.log('Updating existing record ID:', existingRecordId);

                // Chuẩn bị dữ liệu cho PUT, giữ nguyên các trường khác
                const updateData = {
                    ...existingRecordData,
                    id: existingRecordId,
                    updateDate: new Date().toISOString(),
                    inputPeriod: numericValues.inputPeriod,
                    weight: numericValues.weight,
                    bpd: numericValues.bpd,
                    length: numericValues.length,
                    hc: numericValues.hc,
                    date: numericValues.date,
                    fetusId: fetusId
                };

                console.log('Sending PUT request with data:', updateData);
                response = await axios.put(`https://api-mnyt.purintech.id.vn/api/FetusRecord`, updateData);
                message.success('Cập nhật thông tin thai nhi thành công!');
            }
            // Nếu chưa có record, tạo mới bằng POST
            else {
                console.log('Creating new record with data:', numericValues);

                // Gói dữ liệu thành mảng theo yêu cầu của API
                const fetusRecordPayload = [numericValues];

                response = await axios.post(`https://api-mnyt.purintech.id.vn/api/FetusRecord`, fetusRecordPayload);
                message.success('Thêm thông tin thai nhi thành công!');
            }

            console.log('API response:', response.data);

            // Đóng form
            onClose?.();
            window.location.reload();

        } catch (error) {
            console.error('Error saving fetus record:', error);

            if (axios.isAxiosError(error)) {
                console.error('API error response:', error.response?.data);
                console.error('API error status:', error.response?.status);
            }

            message.error('Lỗi khi lưu thông tin thai nhi');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial="initial"
            animate="animate"
            variants={fadeInUp}
            className={styles.formContainer}
        >
            <Spin spinning={loading} tip="Đang xử lý...">
                <div className={styles.formContent}>
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                    >
                        <Form.Item
                            label="Tuần thai"
                            name="period"
                            rules={[{ required: true, message: 'Vui lòng chọn tuần thai!' }]}
                        >
                            <Select
                                onChange={onPeriodChange}
                                placeholder="Chọn tuần thai"
                            >
                                {periodOptions.map(period => (
                                    <Select.Option key={period} value={period}>
                                        Tuần {period}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label="Ngày siêu âm"
                            name="date"
                            rules={[{ required: true, message: 'Vui lòng chọn ngày siêu âm!' }]}
                        >
                            <DatePicker
                                style={{ width: '100%' }}
                                format="DD/MM/YYYY"
                                placeholder="Chọn ngày siêu âm"
                            />
                        </Form.Item>

                        <div className={styles.formSection}>
                            <p className={styles.sectionTitle}>Nhập các chỉ số của thai nhi</p>

                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        label="BPD - Đường kính lưỡng đỉnh (mm)"
                                        name="bpd"
                                        rules={[{ required: true, message: 'Vui lòng nhập BPD!' }]}
                                    >
                                        <Input type="text" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="HC - Chu vi đầu (mm)"
                                        name="hc"
                                        rules={[{ required: true, message: 'Vui lòng nhập HC!' }]}
                                    >
                                        <Input type="text" />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        label="CRL/Chiều dài (mm)"
                                        name="length"
                                        rules={[{ required: true, message: 'Vui lòng nhập chiều dài!' }]}
                                    >
                                        <Input type="text" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="EFW - Cân nặng ước tính (g)"
                                        name="weight"
                                        rules={[{ required: true, message: 'Vui lòng nhập cân nặng!' }]}
                                    >
                                        <Input type="text" />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </div>

                        <div className={styles.formNote}>
                            <p><strong>Chú thích:</strong></p>
                            <ul>
                                <li><strong>BPD</strong> - Đường kính lưỡng đỉnh (Biparietal Diameter)</li>
                                <li><strong>HC</strong> - Chu vi đầu (Head Circumference)</li>
                                <li><strong>CRL</strong> - Chiều dài đầu mông (Crown-Rump Length)</li>
                                <li><strong>EFW</strong> - Ước tính cân nặng thai nhi (Estimated Fetal Weight)</li>
                            </ul>
                        </div>

                        <Form.Item>
                            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                                <Button onClick={onClose}>
                                    Hủy
                                </Button>
                                <Button type="primary" htmlType="submit" loading={loading}>
                                    {existingRecordId ? 'Cập nhật' : 'Thêm mới'}
                                </Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </div>
            </Spin>
        </motion.div>
    );
};

export default UpdateForm;