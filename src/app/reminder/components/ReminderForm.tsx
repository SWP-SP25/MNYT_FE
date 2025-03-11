import React from 'react';
import {
    TextField,
    Button,
    Box,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Chip
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import type { Reminder } from '@/types/reminder';
import moment from 'moment';

// Định nghĩa các tag có sẵn
const REMINDER_TAGS = [
    { value: 'work', label: 'Công việc', color: '#f44336' },
    { value: 'personal', label: 'Cá nhân', color: '#4caf50' },
    { value: 'study', label: 'Học tập', color: '#2196f3' },
    { value: 'health', label: 'Sức khỏe', color: '#ff9800' },
    { value: 'family', label: 'Gia đình', color: '#9c27b0' },
    { value: 'other', label: 'Khác', color: '#757575' },
] as const;

interface ReminderFormProps {
    onSubmit: (reminder: Omit<Reminder, 'id'>) => void;
    onCancel: () => void;
    initialDate?: string | null;
}

const ReminderForm: React.FC<ReminderFormProps> = ({ onSubmit, onCancel, initialDate }) => {
    const [formData, setFormData] = React.useState({
        title: '',
        date: initialDate ? moment(initialDate) : null,
        time: null,
        description: '',
        tag: '', // Thêm trường tag
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.date || !formData.time || !formData.tag) {
            alert('Vui lòng điền đầy đủ thông tin');
            return;
        }

        const dateStr = formData.date.format('YYYY-MM-DD');
        const timeStr = formData.time.format('HH:mm');

        const reminder = {
            title: formData.title,
            date: dateStr,
            time: timeStr,
            description: formData.description || '',
            start: `${dateStr}T${timeStr}`,
            tag: formData.tag,
            status: 'pending' as const,
            color: REMINDER_TAGS.find(t => t.value === formData.tag)?.color
        };

        onSubmit(reminder);
        setFormData({ title: '', date: null, time: null, description: '', tag: '' });
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
                    />

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
                        >
                            Hủy
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            sx={{
                                textTransform: 'uppercase',
                                py: 1
                            }}
                        >
                            Tạo Reminder
                        </Button>
                    </Box>
                </form>
            </Box>
        </Box>
    );
};

export default ReminderForm; 