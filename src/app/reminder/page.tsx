'use client';

import React, { useState, useEffect } from 'react';
import {
    Container,
    Button,
    Dialog,
    Snackbar,
    Alert,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Checkbox,
    Typography,
    Box,
    Grid,
    Paper,
    IconButton,
    Popover,
    Chip,
    Select,
    MenuItem,
    CircularProgress
} from '@mui/material';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import AddIcon from '@mui/icons-material/Add';
import ReminderForm from './components/ReminderForm';
import type { Reminder as UserReminder } from '@/types/schedule';
import { useAuth } from '@/hooks/useAuth';
import { useReminders } from '@/hooks/useReminder';
import styles from './page.module.css';
import moment from 'moment';
import CloseIcon from '@mui/icons-material/Close';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const REMINDER_TAGS = [
    { value: 'prenental_checkup', label: 'Khám thai', color: '#f44336' },
    { value: 'ultrasound', label: 'Siêu âm', color: '#4caf50' },
    { value: 'lab_tests', label: 'Xét nghiệm', color: '#2196f3' },
    { value: 'vaccination', label: 'Tiêm chủng', color: '#ff9800' },
    { value: 'user', label: 'Tự tạo', color: '#9c27b0' },
];

export default function ReminderPage() {
    // Lấy thông tin người dùng
    const { user } = useAuth();
    console.log('User object in reminder page:', user);

    // Lấy userId và test API
    const userId = user?.id ? parseInt(user.id) : undefined;
    console.log('User ID for API calls:', userId);

    // Sử dụng hook useReminders để test API
    const {
        reminders: apiReminders,
        loading: apiLoading,
        error: apiError,
        refreshReminders,
        updateReminderStatus,
        addUserReminder
    } = useReminders({ userId });

    // Log kết quả từ hook
    useEffect(() => {
        console.log('API Reminders from hook:', apiReminders);
        console.log('API Loading state:', apiLoading);
        console.log('API Error state:', apiError);
    }, [apiReminders, apiLoading, apiError]);

    // State cho giao diện hiện tại
    const [userReminders, setUserReminders] = useState<UserReminder[]>([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error'
    });
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [selectedReminder, setSelectedReminder] = useState<UserReminder | null>(null);
    const [refreshing, setRefreshing] = useState(false);
    const [fadeIn, setFadeIn] = useState(true);

    // Chuyển đổi reminders từ API sang định dạng của giao diện
    useEffect(() => {
        if (apiReminders && apiReminders.length > 0) {
            console.log('Converting API reminders to UI format');

            const convertedReminders: UserReminder[] = apiReminders.map(apiReminder => {
                // Đảm bảo date là string và có định dạng YYYY-MM-DD
                const date = apiReminder.date || moment().format('YYYY-MM-DD');
                // Mặc định time là 09:00 nếu không có
                const time = "09:00";

                // Xác định tag dựa trên loại reminder và period
                let tag: string;

                if (apiReminder.type === 'user') {
                    tag = 'user'; // Tag cho reminder người dùng tự tạo
                } else if (apiReminder.period) {
                    // Phân loại tag dựa trên tuần thai cho reminder hệ thống
                    if (apiReminder.period < 12) {
                        tag = 'prenental_checkup'; // Khám thai định kỳ đầu
                    } else if (apiReminder.period >= 12 && apiReminder.period < 24) {
                        tag = 'ultrasound'; // Siêu âm giữa kỳ
                    } else if (apiReminder.period >= 24 && apiReminder.period < 36) {
                        tag = 'lab_tests'; // Xét nghiệm
                    } else {
                        tag = 'vaccination'; // Tiêm chủng cuối kỳ
                    }
                } else {
                    tag = 'prenental_checkup'; // Mặc định là khám thai
                }

                // Xác định màu sắc dựa trên tag
                const color = REMINDER_TAGS.find(t => t.value === tag)?.color || '#ff9800';

                return {
                    id: apiReminder.id.toString(),
                    title: apiReminder.title || `Lịch khám thai tuần ${apiReminder.period}`,
                    description: apiReminder.description || `Khám thai định kỳ tuần ${apiReminder.period}`,
                    date: date,
                    time: time,
                    tag: tag,
                    color: color,
                    status: apiReminder.status || 'pending'
                };
            });

            console.log('Converted reminders:', convertedReminders);
            setUserReminders(convertedReminders);
        }
    }, [apiReminders]);

    // Hiển thị thông báo lỗi nếu có
    useEffect(() => {
        if (apiError) {
            console.error('API Error in page component:', apiError);
            setSnackbar({
                open: true,
                message: `Lỗi: ${apiError}`,
                severity: 'error'
            });
        }
    }, [apiError]);

    // Khi refreshing, fade out
    useEffect(() => {
        if (refreshing) {
            setFadeIn(false);
        } else {
            // Fade in sau một chút delay để dữ liệu mới được load
            const timer = setTimeout(() => {
                setFadeIn(true);
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [refreshing]);

    const handleAddReminder = (newReminder: Omit<UserReminder, 'id'>, refreshAfterDelay: boolean = false) => {
        console.log('New reminder created with UI data:', newReminder);

        // Đóng form
        setIsFormOpen(false);
        // Chọn ngày của reminder mới
        setSelectedDate(newReminder.date);

        // Hiển thị thông báo thành công
        setSnackbar({
            open: true,
            message: 'Tạo reminder thành công!',
            severity: 'success'
        });

        // Nếu refreshAfterDelay = true, tự động refresh trang sau 4 giây
        if (refreshAfterDelay) {
            console.log('Will refresh after 4 seconds');
            setTimeout(() => {
                console.log('Refreshing reminders...');
                refreshReminders();
            }, 4000); // 4 giây
        }
    };

    const handleDateClick = (arg: any) => {
        console.log('Date clicked:', arg.dateStr);
        setSelectedDate(arg.dateStr);
    };

    const handleStatusChange = (reminderId: string, status: 'skip' | 'done' | 'pending') => {
        console.log('Changing status for reminder', reminderId, 'to', status);

        // Gọi API để cập nhật trạng thái
        updateReminderStatus(reminderId, status)
            .then(success => {
                if (success) {
                    setSnackbar({
                        open: true,
                        message: 'Cập nhật trạng thái thành công!',
                        severity: 'success'
                    });
                } else {
                    setSnackbar({
                        open: true,
                        message: 'Cập nhật trạng thái thất bại!',
                        severity: 'error'
                    });
                }
            });
    };

    const statusColors = {
        skip: '#ff0000',
        done: '#4caf50',
        pending: '#1976d2'
    };

    // Kết hợp reminders từ API và reminders do người dùng tạo
    const allReminders = [...userReminders];
    console.log('All reminders for display:', allReminders);

    const selectedDateReminders = selectedDate
        ? allReminders
            .filter(reminder => reminder.date === selectedDate)
            .sort((a, b) => a.time.localeCompare(b.time))
        : [];

    const handleEventMouseEnter = (info: any) => {
        const reminder = allReminders.find(r => r.id === info.event.id);
        if (reminder) {
            setSelectedReminder(reminder);
            setAnchorEl(info.el);
        }
    };

    const handleEventMouseLeave = () => {
        setAnchorEl(null);
        setSelectedReminder(null);
    };

    const events = allReminders.map(reminder => ({
        id: reminder.id,
        title: reminder.title,
        start: `${reminder.date}T${reminder.time}:00`,
        end: moment(`${reminder.date}T${reminder.time}:00`).add(30, 'minutes').format('YYYY-MM-DDTHH:mm:ss'),
        description: reminder.description,
        allDay: false,
        color: statusColors[reminder.status as 'skip' | 'done' | 'pending' || 'pending'],
        textColor: '#ffffff',
        display: 'block',
        extendedProps: {
            status: reminder.status || 'pending',
            tag: reminder.tag
        }
    }));

    console.log('Calendar events:', events);

    const refreshRemindersWithIndicator = () => {
        setRefreshing(true);
        refreshReminders();

        // Sau 2 giây, tắt indicator (giả định API call không quá 2 giây)
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    };

    return (
        <Container
            maxWidth="xl"
            sx={{
                pt: '80px',
                px: 3,
                minHeight: 'calc(100vh - 64px)'
            }}
        >
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                mb: 2
            }}>
                <Typography variant="h4" component="h1">
                    Lịch khám thai
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        variant="outlined"
                        onClick={() => {
                            console.log('Refresh button clicked');
                            refreshRemindersWithIndicator();
                        }}
                        disabled={apiLoading || refreshing}
                        startIcon={refreshing ? <CircularProgress size={20} /> : null}
                    >
                        Làm mới
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => setIsFormOpen(true)}
                        sx={{
                            bgcolor: '#1976d2',
                            '&:hover': {
                                bgcolor: '#1565c0'
                            }
                        }}
                    >
                        TẠO REMINDER
                    </Button>
                </Box>
            </Box>

            {/* Hiển thị trạng thái API (chỉ để test) */}
            <Paper sx={{ p: 2, mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2">
                    <strong>API Status:</strong> {apiLoading ? 'Loading...' : apiError ? 'Error' : 'Success'}
                    {apiError && ` - ${apiError}`}
                </Typography>
                <Typography variant="body2">
                    <strong>API Reminders:</strong> {apiReminders?.length || 0}
                </Typography>
            </Paper>

            <Grid container spacing={3} sx={{
                opacity: fadeIn ? 1 : 0.6,
                transition: 'opacity 0.3s ease-in-out'
            }}>
                {selectedDate && (
                    <Grid item xs={12} md={3}>
                        <Paper className={styles.reminderList}>
                            <div className={styles.reminderListHeader}>
                                <Typography variant="h6">
                                    Reminders ngày {moment(selectedDate).format('DD/MM/YYYY')}
                                </Typography>
                                <IconButton
                                    onClick={() => setSelectedDate(null)}
                                    size="small"
                                    className={styles.closeButton}
                                >
                                    <CloseIcon />
                                </IconButton>
                            </div>
                            {selectedDateReminders.length > 0 ? (
                                <List>
                                    {selectedDateReminders.map((reminder) => (
                                        <ListItem
                                            key={reminder.id}
                                            className={styles.reminderItem}
                                            disablePadding
                                            sx={{
                                                position: 'relative',
                                                zIndex: 2
                                            }}
                                        >
                                            <ListItemIcon>
                                                <Select
                                                    value={reminder.status || 'pending'}
                                                    onChange={(e) => handleStatusChange(reminder.id, e.target.value as 'skip' | 'done' | 'pending')}
                                                    size="small"
                                                    MenuProps={{
                                                        sx: {
                                                            zIndex: 9999
                                                        }
                                                    }}
                                                    sx={{
                                                        minWidth: 120,
                                                        '& .MuiSelect-select': {
                                                            py: 1
                                                        }
                                                    }}
                                                >
                                                    <MenuItem value="pending">Chưa làm</MenuItem>
                                                    <MenuItem value="done">Đã làm</MenuItem>
                                                    <MenuItem value="skip">Bỏ qua</MenuItem>
                                                </Select>
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <Typography>
                                                            {reminder.title}
                                                        </Typography>
                                                        <Chip
                                                            size="small"
                                                            label={REMINDER_TAGS.find(t => t.value === reminder.tag)?.label}
                                                            sx={{
                                                                bgcolor: reminder.color,
                                                                color: 'white',
                                                                height: '20px'
                                                            }}
                                                        />
                                                    </Box>
                                                }
                                                secondary={
                                                    <>
                                                        <Typography component="span" variant="body2">
                                                            {reminder.time}
                                                        </Typography>
                                                        <Typography
                                                            component="p"
                                                            variant="body2"
                                                            color="textSecondary"
                                                        >
                                                            {reminder.description}
                                                        </Typography>
                                                    </>
                                                }
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            ) : (
                                <Typography variant="body2" color="textSecondary" className={styles.noReminders}>
                                    Không có reminder nào
                                </Typography>
                            )}
                        </Paper>
                    </Grid>
                )}

                <Grid item xs={12} md={selectedDate ? 9 : 12}>
                    <div className={styles.calendar}>
                        <FullCalendar
                            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                            initialView="timeGridWeek"
                            headerToolbar={{
                                left: 'prev,next today',
                                center: 'title',
                                right: 'dayGridMonth,timeGridWeek'
                            }}
                            events={events}
                            editable={true}
                            selectable={true}
                            selectMirror={true}
                            dayMaxEvents={true}
                            weekends={true}
                            height="auto"
                            locale="vi"
                            slotMinTime="06:00:00"
                            slotMaxTime="22:00:00"
                            dateClick={handleDateClick}
                            buttonText={{
                                today: 'Hôm nay',
                                month: 'Tháng',
                                week: 'Tuần'
                            }}
                            eventTimeFormat={{
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: false
                            }}
                            slotDuration="00:30:00"
                            eventContent={(eventInfo) => {
                                const status = eventInfo.event.extendedProps.status;
                                return {
                                    html: `
                                        <div class="${styles.eventContent} ${status === 'done' ? styles.checkedEvent : ''}">
                                            <div class="${styles.eventTitle}">
                                                ${eventInfo.event.title}
                                            </div>
                                            <div class="${styles.eventTime}">
                                                ${eventInfo.timeText}
                                            </div>
                                        </div>
                                    `
                                };
                            }}
                            eventMouseEnter={handleEventMouseEnter}
                            eventMouseLeave={handleEventMouseLeave}
                        />
                    </div>
                </Grid>
            </Grid>

            <Dialog
                open={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 1,
                        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.15)',
                        zIndex: 1
                    }
                }}
            >
                <ReminderForm
                    onSubmit={handleAddReminder}
                    onCancel={() => setIsFormOpen(false)}
                    initialDate={selectedDate}
                    addUserReminder={addUserReminder}
                />
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert
                    severity={snackbar.severity}
                    onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
                    elevation={6}
                    variant="filled"
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>

            <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                sx={{
                    pointerEvents: 'none',
                }}
                PaperProps={{
                    sx: {
                        p: 2,
                        maxWidth: 300,
                        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.15)',
                    }
                }}
            >
                {selectedReminder && (
                    <Box>
                        <Typography variant="h6" sx={{ mb: 1 }}>
                            {selectedReminder.title}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                            <Chip
                                size="small"
                                label={REMINDER_TAGS.find(t => t.value === selectedReminder.tag)?.label}
                                sx={{
                                    bgcolor: selectedReminder.color,
                                    color: 'white'
                                }}
                            />
                            <Chip
                                size="small"
                                label={selectedReminder.status || 'Chưa làm'}
                                sx={{
                                    bgcolor: statusColors[selectedReminder.status as 'skip' | 'done' | 'pending' || 'pending'],
                                    color: 'white'
                                }}
                            />
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            <AccessTimeIcon sx={{ fontSize: 16, mr: 1, verticalAlign: 'text-bottom' }} />
                            {moment(`${selectedReminder.date} ${selectedReminder.time}`).format('DD/MM/YYYY HH:mm')}
                        </Typography>
                        {selectedReminder.description && (
                            <Typography variant="body2">
                                {selectedReminder.description}
                            </Typography>
                        )}
                    </Box>
                )}
            </Popover>
        </Container>
    );
}