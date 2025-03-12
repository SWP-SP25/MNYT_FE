'use client'
import React from 'react';
import { Form, Input, Button, DatePicker } from 'antd';
import styles from './account-form.module.css'; // Import CSS module

const AccountForm: React.FC = () => {
    return (
        <Form layout="vertical">
            <Form.Item label="First Name" className={styles.formLabel}>
                <Input placeholder="Enter your first name" className={styles.formInput} />
            </Form.Item>
            <Form.Item label="Second Name" className={styles.formLabel}>
                <Input placeholder="Enter your second name" className={styles.formInput} />
            </Form.Item>
            <Form.Item label="Birth Date" className={styles.formLabel}>
                <DatePicker style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item label="Phone Number" className={styles.formLabel}>
                <Input placeholder="Enter your phone number" className={styles.formInput} />
            </Form.Item>
            <Form.Item label="E-mail Address" className={styles.formLabel}>
                <Input placeholder="Enter your email address" className={styles.formInput} />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" className={styles.saveButton}>
                    Save
                </Button>
            </Form.Item>
        </Form>
    );
};

export default AccountForm;