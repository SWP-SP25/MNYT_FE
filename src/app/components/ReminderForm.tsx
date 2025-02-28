import React from 'react';
import { Form, Input, DatePicker, TimePicker, Button } from 'antd';
import { Card } from 'react-bootstrap';
import type { Reminder } from '@/types/reminder';
import moment from 'moment';

interface ReminderFormProps {
    onSubmit: (reminder: Omit<Reminder, 'id'>) => void;
}

const ReminderForm: React.FC<ReminderFormProps> = ({ onSubmit }) => {
    const [form] = Form.useForm();

    const handleSubmit = (values: any) => {
        const reminder = {
            title: values.title,
            date: values.date.format('YYYY-MM-DD'),
            time: values.time.format('HH:mm'),
            description: values.description || '',
        };

        onSubmit(reminder);
        form.resetFields();
    };

    return (
        <Card>
            <Card.Header>
                <h4>Tạo Reminder</h4>
            </Card.Header>
            <Card.Body>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    <Form.Item
                        name="title"
                        label="Tiêu đề"
                        rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="date"
                        label="Ngày"
                        rules={[{ required: true, message: 'Vui lòng chọn ngày!' }]}
                    >
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                        name="time"
                        label="Thời gian"
                        rules={[{ required: true, message: 'Vui lòng chọn thời gian!' }]}
                    >
                        <TimePicker style={{ width: '100%' }} format="HH:mm" />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="Mô tả"
                    >
                        <Input.TextArea rows={4} />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                            Lưu Reminder
                        </Button>
                    </Form.Item>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default ReminderForm; 