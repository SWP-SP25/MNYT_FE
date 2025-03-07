import React from 'react';
import { TextField, Button, Card, CardHeader, CardContent } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import type { Reminder } from '@/types/reminder';

interface ReminderFormProps {
    onSubmit: (reminder: Omit<Reminder, 'id'>) => void;
}

const ReminderForm: React.FC<ReminderFormProps> = ({ onSubmit }) => {
    const [formData, setFormData] = React.useState({
        title: '',
        date: null,
        time: null,
        description: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const reminder = {
            title: formData.title,
            date: formData.date?.format('YYYY-MM-DD'),
            time: formData.time?.format('HH:mm'),
            description: formData.description || '',
        };

        onSubmit(reminder);
        setFormData({ title: '', date: null, time: null, description: '' });
    };

    return (
        <Card>
            <CardHeader title="Tạo Reminder" />
            <CardContent>
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Tiêu đề"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                        margin="normal"
                    />

                    <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DatePicker
                            label="Ngày"
                            value={formData.date}
                            onChange={(newValue) => setFormData({ ...formData, date: newValue })}
                            sx={{ width: '100%', mt: 2, mb: 2 }}
                        />

                        <TimePicker
                            label="Thời gian"
                            value={formData.time}
                            onChange={(newValue) => setFormData({ ...formData, time: newValue })}
                            sx={{ width: '100%', mb: 2 }}
                        />
                    </LocalizationProvider>

                    <TextField
                        fullWidth
                        label="Mô tả"
                        multiline
                        rows={4}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        margin="normal"
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        sx={{ mt: 2 }}
                    >
                        Lưu Reminder
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};

export default ReminderForm; 