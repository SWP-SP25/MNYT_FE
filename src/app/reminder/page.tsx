'use client';

import React, { useState } from 'react';
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
    MenuItem
} from '@mui/material';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import AddIcon from '@mui/icons-material/Add';
import ReminderForm from './components/ReminderForm';
import type { Reminder } from '@/types/reminder';
import styles from './page.module.css';
import moment from 'moment';
import CloseIcon from '@mui/icons-material/Close';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const REMINDER_TAGS = [
    { value: 'work', label: 'Công việc', color: '#f44336' },
    { value: 'personal', label: 'Cá nhân', color: '#4caf50' },
    { value: 'study', label: 'Học tập', color: '#2196f3' },
    { value: 'health', label: 'Sức khỏe', color: '#ff9800' },
    { value: 'family', label: 'Gia đình', color: '#9c27b0' },
    { value: 'other', label: 'Khác', color: '#757575' },
];

export default function ReminderPage() {
    const [reminders, setReminders] = useState<Reminder[]>([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error'
    });
    const [reminderStatuses, setReminderStatuses] = useState<Record<string, 'skip' | 'done' | 'pending'>>({});
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [selectedReminder, setSelectedReminder] = useState<Reminder | null>(null);

    const handleAddReminder = (newReminder: Omit<Reminder, 'id'>) => {
        const reminder: Reminder = {
            ...newReminder,
            id: Date.now().toString(),
            color: '#1976d2',
        };

        setReminders(prev => [...prev, reminder]);
        setIsFormOpen(false);

        setSelectedDate(reminder.date);

        setSnackbar({
            open: true,
            message: 'Tạo reminder thành công!',
            severity: 'success'
        });
    };

    const handleDateClick = (arg: any) => {
        setSelectedDate(arg.dateStr);
    };

    const handleStatusChange = (reminderId: string, status: 'skip' | 'done' | 'pending') => {
        setReminderStatuses(prev => ({
            ...prev,
            [reminderId]: status
        }));
    };

    const statusColors = {
        skip: '#ff0000',
        done: '#4caf50',
        pending: '#1976d2'
    };

    const selectedDateReminders = selectedDate
        ? reminders
            .filter(reminder => reminder.date === selectedDate)
            .sort((a, b) => a.time.localeCompare(b.time))
        : [];

    const handleEventMouseEnter = (info: any) => {
        const reminder = reminders.find(r => r.id === info.event.id);
        if (reminder) {
            setSelectedReminder(reminder);
            setAnchorEl(info.el);
        }
    };

    const handleEventMouseLeave = () => {
        setAnchorEl(null);
        setSelectedReminder(null);
    };

    const events = reminders.map(reminder => ({
        id: reminder.id,
        title: reminder.title,
        start: `${reminder.date}T${reminder.time}:00`,
        end: moment(`${reminder.date}T${reminder.time}:00`).add(30, 'minutes').format('YYYY-MM-DDTHH:mm:ss'),
        description: reminder.description,
        allDay: false,
        color: statusColors[reminderStatuses[reminder.id] || 'pending'],
        textColor: '#ffffff',
        display: 'block',
        extendedProps: {
            status: reminderStatuses[reminder.id] || 'pending'
        }
    }));

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
                justifyContent: 'flex-end',
                mb: 2
            }}>
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

            <Grid container spacing={3}>
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
                                                    value={reminderStatuses[reminder.id] || 'pending'}
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
                />
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert
                    severity={snackbar.severity}
                    onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
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
                                label={reminderStatuses[selectedReminder.id] || 'Chưa làm'}
                                sx={{
                                    bgcolor: statusColors[reminderStatuses[selectedReminder.id] || 'pending'],
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