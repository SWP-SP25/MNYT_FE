'use client'
import React from 'react';
import { Form, Input, Button, Card } from 'antd';

export const UpdateForm: React.FC = () => {
    const [form] = Form.useForm();

    const onFinish = (values: any) => {
        console.log('Form values:', values);
    };

    return (
        <Card title="Cập nhật chỉ số thai nhi" style={{ margin: '20px' }}>
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
                    label="Cân nặng ước tính của thai nhi (EFW)"
                    name="efw"
                >
                    <Input />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" block>
                        Cập nhật
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
};
export default UpdateForm;