import React, { useState } from 'react';
import {
    TextField, Button, Box, Select, MenuItem, FormControl, InputLabel, Chip, CircularProgress, Alert
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import type { Reminder } from '@/types/reminder';
import moment from 'moment';
import { FormReminderDataType } from '@/types/reminder';

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
    addUserReminder?: (title: string, description: string, date: string, status?: string, tag?: string) => Promise<boolean>;
}
const ReminderForm: React.FC<ReminderFormProps> = ({ onSubmit, onCancel, initialDate, addUserReminder }) => {
    const [formData, setFormData] = useState<FormReminderDataType>({
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

        // ĐẢM BẢO format đúng dữ liệu trước khi gửi đi
        const dateStr = formData.date.format('YYYY-MM-DD');
        const timeStr = formData.time.format('HH:mm');

        // Tạo chuỗi datetime theo đúng định dạng ISO để API hiểu được
        const dateTimeStr = `${dateStr}T${timeStr}:00`;

        // Tạo đối tượng reminder cho UI
        const reminder: Omit<Reminder, 'id'> = {
            title: formData.title,
            date: dateStr,
            time: timeStr,
            description: formData.description || '',
            tag: formData.tag,
            status: 'pending',
            color: REMINDER_TAGS.find(t => t.value === formData.tag)?.color || '#ff9800'
        };

        // Nếu có hàm addUserReminder (từ API), sử dụng nó
        if (addUserReminder) {
            try {
                setSubmitting(true);

                // Đảm bảo tag không bao giờ là undefined
                const finalTag = formData.tag || 'prenental_checkup';

                // Gọi API để tạo reminder mới với đúng các tham số
                const success = await addUserReminder(
                    reminder.title,      // Tiêu đề reminder
                    reminder.description, // Mô tả
                    dateTimeStr,         // Ngày giờ dạng ISO: YYYY-MM-DDThh:mm:ss
                    'pending',           // Trạng thái mặc định
                    finalTag             // Tag đã được thiết lập
                );

                if (success) {
                    onSubmit(reminder, true); // Truyền tham số true để refresh sau 4s
                    setFormData({ title: '', date: null, time: null, description: '', tag: '' });
                } else {
                    setError('Không thể tạo reminder. Vui lòng thử lại sau.');
                }
            } catch (err: unknown) {
                // Xử lý lỗi từ API
                console.error('Error creating reminder:', err);
                const errorMessage = err instanceof Error ? err.message : 'Unknown error';
                setError('Lỗi khi tạo reminder: ' + errorMessage);
            } finally {
                setSubmitting(false);
            }
        } else {
            // Nếu không có API, chỉ sử dụng hàm onSubmit
            onSubmit(reminder, true); // Truyền tham số true để refresh sau 4s
            setFormData({ title: '', date: null, time: null, description: '', tag: '' });
        }
    };

    return (
        <Box sx={{ p: 0 }}>
            <Box sx={{
                bgcolor: '#4caf50', // Thay đổi màu nền thành xanh lá
                color: 'white',
                py: 2,
                px: 3,
                fontSize: '1.2rem',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: 1.5
            }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
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
                            sx: { borderRadius: 2 }
                        }}
                        disabled={submitting}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '&.Mui-focused fieldset': {
                                    borderColor: '#4caf50',
                                },
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                                color: '#4caf50',
                            },
                        }}
                    />

                    <FormControl fullWidth margin="normal">
                        <InputLabel id="tag-select-label" sx={{ '&.Mui-focused': { color: '#4caf50' } }}>Phân loại</InputLabel>
                        <Select
                            labelId="tag-select-label"
                            value={formData.tag}
                            label="Phân loại"
                            onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                            required
                            sx={{
                                borderRadius: 2,
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#4caf50',
                                }
                            }}
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
                                                '& .MuiChip-label': { px: 1 },
                                                fontWeight: 500
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
                                    borderRadius: 2,
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#4caf50',
                                    }
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                    color: '#4caf50',
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
                                    borderRadius: 2,
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#4caf50',
                                    }
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                    color: '#4caf50',
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
                            sx: { borderRadius: 2 }
                        }}
                        disabled={submitting}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '&.Mui-focused fieldset': {
                                    borderColor: '#4caf50',
                                },
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                                color: '#4caf50',
                            },
                        }}
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
                                py: 1,
                                borderColor: '#4caf50',
                                color: '#4caf50',
                                '&:hover': {
                                    borderColor: '#2e7d32',
                                    backgroundColor: 'rgba(76, 175, 80, 0.08)'
                                }
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
                                position: 'relative',
                                bgcolor: '#4caf50',
                                '&:hover': {
                                    bgcolor: '#2e7d32'
                                }
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