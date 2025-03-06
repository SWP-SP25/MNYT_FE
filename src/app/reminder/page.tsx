'use client';

import React, { useState } from 'react';
import { Grid, Container, Alert, Snackbar } from '@mui/material';
import Calendar from '../components/Calendar';
import ReminderForm from '../components/ReminderForm';
import type { Reminder } from '@/types/reminder';
import type { Moment } from 'moment';

export default function ReminderPage() {
    const [reminders, setReminders] = useState<Reminder[]>([]);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'info' | 'warning' | 'error'
    });

    const handleAddReminder = (newReminder: Omit<Reminder, 'id'>) => {
        const reminder: Reminder = {
            ...newReminder,
            id: Date.now().toString(),
        };
        setReminders(prev => [...prev, reminder]);
        setSnackbar({
            open: true,
            message: 'Đã tạo reminder thành công!',
            severity: 'success'
        });
    };

    const handleDayClick = (date: Moment) => {
        const dayReminders = reminders.filter(
            reminder => reminder.date === date.format('YYYY-MM-DD')
        );

        if (dayReminders.length > 0) {
            const reminderList = dayReminders
                .map(r => `${r.time} - ${r.title}`)
                .join('\n');
            setSnackbar({
                open: true,
                message: `Reminders cho ngày ${date.format('DD/MM/YYYY')}:\n${reminderList}`,
                severity: 'info'
            });
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    return (
        <Container maxWidth="xl" sx={{ py: 3 }}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Calendar
                        reminders={reminders}
                        onDayClick={handleDayClick}
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <ReminderForm onSubmit={handleAddReminder} />
                </Grid>
            </Grid>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    sx={{ whiteSpace: 'pre-line' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
}