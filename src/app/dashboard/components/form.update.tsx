'use client'
import React from 'react';
import { Form, Input, Button, Space } from 'antd';
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

    const onFinish = (values: any) => {
        console.log('Form values:', values);
        // Here you would typically make an API call to update the data
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
            >
                <Form.Item
                    label="Tuổi thai (Tuần)"
                    name="pregnancyWeek"
                    rules={[{ required: true, message: 'Vui lòng nhập tuổi thai!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Đường kính lưỡng đỉnh (BDP)"
                    name="bdp"
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Chu vi đầu (HC)"
                    name="hc"
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Chu vi bụng (AC)"
                    name="ac"
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Chiều dài xương đùi (FL)"
                    name="fl"
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Cân nặng ước tính (EFW)"
                    name="efw"
                >
                    <Input />
                </Form.Item>

                <Form.Item>
                    <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                        <Button onClick={onClose}>
                            Hủy
                        </Button>
                        <Button type="primary" htmlType="submit">
                            Cập nhật
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </motion.div>
    );
};

export default UpdateForm;