'use client'
import React, { useState } from 'react';
import { Form, Input, Button, Space, Select, Row, Col } from 'antd';
import { motion } from 'framer-motion';

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
    const [selectedWeek, setSelectedWeek] = useState<number | null>(null);

    // Bước 2: Gọi API để lấy dữ liệu của tuần thai đã chọn
    const fetchWeekData = async (week: number) => {
        try {
            // Gắn API để lấy dữ liệu của tuần thai
            // const response = await fetch(`/api/your-endpoint?week=${week}`);
            // const data = await response.json();
            // form.setFieldsValue(data);
            console.log(`Fetching data for week: ${week}`);
        } catch (error) {
            console.error('Error fetching week data:', error);
        }
    };

    const onWeekChange = (value: number) => {
        setSelectedWeek(value);
        fetchWeekData(value);
    };

    const onFinish = (values: any) => {
        console.log('Form values:', values);
        // Bước 3: Gửi dữ liệu cập nhật về backend
        // fetch('/api/your-update-endpoint', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify(values),
        // });
        onClose?.();
    };

    return (
        <motion.div
            initial="initial"
            animate="animate"
            variants={fadeInUp}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                style={{ maxWidth: '400px', margin: '0 auto' }}
            >
                <Form.Item
                    label="Chọn tuần thai"
                    name="pregnancyWeek"
                    rules={[{ required: true, message: 'Vui lòng chọn tuần thai!' }]}
                >
                    <Select onChange={onWeekChange} size="small">
                        <Select.Option value={12}>Tuần 12</Select.Option>
                        <Select.Option value={13}>Tuần 13</Select.Option>
                        <Select.Option value={40}>Tuần 40</Select.Option>
                    </Select>
                </Form.Item>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="BDP" name="bdp">
                            <Input size="small" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="HC" name="hc">
                            <Input size="small" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="AC" name="ac">
                            <Input size="small" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="FL" name="fl">
                            <Input size="small" />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item label="EFW" name="efw">
                    <Input size="small" />
                </Form.Item>

                <Form.Item>
                    <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                        <Button onClick={onClose} size="small">
                            Hủy
                        </Button>
                        <Button type="primary" htmlType="submit" size="small">
                            Cập nhật
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </motion.div>
    );
};

export default UpdateForm;