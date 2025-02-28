'use client';

import React, { useState } from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import Calendar from '../components/Calendar';
import ReminderForm from '../components/ReminderForm';
import type { Reminder } from '@/types/reminder';
import type { Moment } from 'moment';
import { message } from 'antd';
import styles from './page.module.css';

export default function ReminderPage() {
    const [reminders, setReminders] = useState<Reminder[]>([]);

    const handleAddReminder = (newReminder: Omit<Reminder, 'id'>) => {
        const reminder: Reminder = {
            ...newReminder,
            id: Date.now().toString(),
        };
        setReminders(prev => [...prev, reminder]);
        message.success('Đã tạo reminder thành công!');
    };

    const handleDayClick = (date: Moment) => {
        const dayReminders = reminders.filter(
            reminder => reminder.date === date.format('YYYY-MM-DD')
        );

        if (dayReminders.length > 0) {
            const reminderList = dayReminders
                .map(r => `${r.time} - ${r.title}`)
                .join('\n');
            message.info(`Reminders cho ngày ${date.format('DD/MM/YYYY')}:\n${reminderList}`);
        }
    };

    return (
        <Container fluid className={styles.container}>
            <Row>
                <Col md={8}>
                    <div className={styles.calendar}>
                        <Calendar
                            reminders={reminders}
                            onDayClick={handleDayClick}
                        />
                    </div>
                </Col>
                <Col md={4}>
                    <div className={styles.formWrapper}>
                        <ReminderForm onSubmit={handleAddReminder} />
                    </div>
                </Col>
            </Row>
        </Container>
    );
}