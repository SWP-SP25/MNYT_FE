import React, { useState } from 'react';
import {
    TextField,
    Button,
    Box,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Chip,
    CircularProgress,
    Alert
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import type { Reminder } from '@/types/reminder';
import moment from 'moment';

// Định nghĩa các tag có sẵn
const REMINDER_TAGS = [
    { value: 'prenental_checkup', label: 'Khám thai', color: '#f44336' },
    { value: 'ultrasound', label: 'Siêu âm', color: '#4caf50' },
    { value: 'lab_tests', label: 'Xét nghiệm', color: '#2196f3' },
    { value: 'vaccination', label: 'Tiêm chủng', color: '#ff9800' },
];

interface ReminderFormProps {
    onSubmit: (reminder: Omit<Reminder, 'id'>, refreshAfterDelay?: boolean) => void;
    onCancel: () => void;
    initialDate?: string | null;
    addUserReminder?: (title: string, description: string, date: string, status?: string, type?: string) => Promise<boolean>;
}

const ReminderForm: React.FC<ReminderFormProps> = ({ onSubmit, onCancel, initialDate, addUserReminder }) => {
    const [formData, setFormData] = useState({
        title: '',
        date: initialDate ? moment(initialDate) : null,
        time: null,
        description: '',
        tag: '', // Thêm trường tag
    });

    // Thêm state error và submitting
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!formData.date || !formData.time || !formData.tag) {
            setError('Vui lòng điền đầy đủ thông tin');
            return;
        }

        const dateStr = formData.date.format('YYYY-MM-DD');
        const timeStr = formData.time.format('HH:mm');

        // Tạo đối tượng reminder cho UI
        const reminder = {
            title: formData.title,
            date: dateStr,
            time: timeStr,
            description: formData.description || '',
            start: `${dateStr}T${timeStr}`,
            tag: formData.tag,
            status: 'pending' as const,
            type: formData.tag, // Gán type từ tag
            color: REMINDER_TAGS.find(t => t.value === formData.tag)?.color
        };

        // Nếu có hàm addUserReminder (từ API), sử dụng nó
        if (addUserReminder) {
            try {
                setSubmitting(true);
                console.log('Calling API to create reminder:', reminder);

                // Gọi API để tạo reminder mới với đúng các tham số
                const success = await addUserReminder(
                    reminder.title,
                    reminder.description,
                    dateStr,
                    'pending',  // status
                    reminder.type // Gán type từ reminder
                );

                if (success) {
                    console.log('Reminder created successfully via API');
                    onSubmit(reminder, true); // Truyền tham số true để refresh sau 4s
                    setFormData({ title: '', date: null, time: null, description: '', tag: '' });
                } else {
                    setError('Không thể tạo reminder. Vui lòng thử lại sau.');
                }
            } catch (err) {
                console.error('Error creating reminder:', err);
                setError('Lỗi khi tạo reminder: ' + (err.message || 'Unknown error'));
            } finally {
                setSubmitting(false);
            }
        } else {
            // Nếu không có API, chỉ sử dụng hàm onSubmit
            console.log('No API function provided, using local handler only');
            onSubmit(reminder, true); // Truyền tham số true để refresh sau 4s
            setFormData({ title: '', date: null, time: null, description: '', tag: '' });
        }
    };

    return (
        <Box sx={{ p: 0 }}>
            <Box sx={{
                bgcolor: '#1976d2',
                color: 'white',
                py: 2,
                px: 3,
                fontSize: '1.2rem',
                fontWeight: 500
            }}>
                Tạo Reminder
            </Box>
            <Box sx={{ p: 3 }}>
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Tiêu đề"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                        margin="normal"
                        size="medium"
                        InputProps={{
                            sx: { borderRadius: 1 }
                        }}
                        disabled={submitting}
                    />

                    {/* Thêm Select cho tag */}
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="tag-select-label">Phân loại</InputLabel>
                        <Select
                            labelId="tag-select-label"
                            value={formData.tag}
                            label="Phân loại"
                            onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                            required
                            sx={{ borderRadius: 1 }}
                            disabled={submitting}
                        >
                            {REMINDER_TAGS.map((tag) => (
                                <MenuItem key={tag.value} value={tag.value}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Chip
                                            size="small"
                                            label={tag.label}
                                            sx={{
                                                bgcolor: tag.color,
                                                color: 'white',
                                                '& .MuiChip-label': { px: 1 }
                                            }}
                                        />
                                    </Box>
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DatePicker
                            label="Ngày"
                            value={formData.date}
                            onChange={(newValue) => setFormData({ ...formData, date: newValue })}
                            sx={{
                                width: '100%',
                                mt: 2,
                                mb: 2,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 1
                                }
                            }}
                            slotProps={{
                                textField: {
                                    size: 'medium',
                                    disabled: submitting
                                }
                            }}
                        />

                        <TimePicker
                            label="Thời gian"
                            value={formData.time}
                            onChange={(newValue) => setFormData({ ...formData, time: newValue })}
                            sx={{
                                width: '100%',
                                mb: 2,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 1
                                }
                            }}
                            slotProps={{
                                textField: {
                                    size: 'medium',
                                    disabled: submitting
                                }
                            }}
                        />
                    </LocalizationProvider>

                    <TextField
                        fullWidth
                        label="Mô tả"
                        multiline
                        rows={3}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        margin="normal"
                        size="medium"
                        InputProps={{
                            sx: { borderRadius: 1 }
                        }}
                        disabled={submitting}
                    />

                    {error && (
                        <Alert
                            severity="error"
                            sx={{ mt: 2, mb: 2 }}
                        >
                            {error}
                        </Alert>
                    )}

                    <Box sx={{
                        display: 'flex',
                        gap: 2,
                        mt: 3
                    }}>
                        <Button
                            type="button"
                            variant="outlined"
                            fullWidth
                            onClick={onCancel}
                            sx={{
                                textTransform: 'uppercase',
                                py: 1
                            }}
                            disabled={submitting}
                        >
                            Hủy
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            sx={{
                                textTransform: 'uppercase',
                                py: 1,
                                position: 'relative'
                            }}
                            disabled={submitting}
                        >
                            {submitting ? (
                                <>
                                    <CircularProgress
                                        size={24}
                                        sx={{
                                            color: 'white',
                                            position: 'absolute',
                                            top: '50%',
                                            left: '50%',
                                            marginTop: '-12px',
                                            marginLeft: '-12px'
                                        }}
                                    />
                                    <span style={{ visibility: 'hidden' }}>Tạo Reminder</span>
                                </>
                            ) : (
                                'Tạo Reminder'
                            )}
                        </Button>
                    </Box>
                </form>
            </Box>
        </Box>
    );
};

export default ReminderForm;