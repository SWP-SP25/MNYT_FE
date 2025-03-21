'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Container, Dialog, Snackbar, Alert, Box, Grid, Paper } from '@mui/material';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import ReminderForm from './components/ReminderForm';
import TimelineDayView from './components/TimelineDayView';
import type { Reminder as UserReminder } from '@/types/schedule';
import type { Reminder } from '@/types/reminder';
import { useAuth } from '@/hooks/useAuth';
import { useReminders } from '@/hooks/useReminder';
import styles from './page.module.css';
import moment from 'moment';

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
    const userId = user && (user as any).id ? parseInt((user as any).id) : undefined;

    // Sử dụng hook useReminders để giao tiếp với API Backend
    const {
        reminders: apiReminders,       // Dữ liệu reminders từ API 
        loading: apiLoading,           // Trạng thái loading khi gọi API
        error: apiError,               // Lỗi từ API (nếu có)
        refreshReminders,              // Hàm làm mới dữ liệu từ API
        updateReminderStatus,          // Hàm gọi API để cập nhật trạng thái reminder
        addUserReminder                // Hàm gọi API để tạo reminder mới
    } = useReminders({ userId });

    // Ref cho container chính
    const mainContainerRef = useRef<HTMLDivElement>(null);

    // Xử lý vấn đề hiệu ứng khi hover và cuộn
    const handleScroll = useCallback(() => {
        if (mainContainerRef.current) {
            // Đảm bảo rằng scroll position được lưu trữ đúng
            const scrollTop = mainContainerRef.current.scrollTop;
            requestAnimationFrame(() => {
                if (mainContainerRef.current) {
                    mainContainerRef.current.scrollTop = scrollTop;
                }
            });
        }
    }, []);

    // Sử dụng useEffect để thêm event listener cho scroll
    useEffect(() => {
        const container = mainContainerRef.current;
        if (container) {
            container.addEventListener('scroll', handleScroll, { passive: true });
        }

        return () => {
            if (container) {
                container.removeEventListener('scroll', handleScroll);
            }
        };
    }, [handleScroll]);

    // State cho giao diện hiện tại
    const [userReminders, setUserReminders] = useState<Array<{
        id: string;
        title: string;
        description: string;
        date: string;
        time: string;
        tag: string;
        color: string;
        status: 'pending' | 'done' | 'skip';
    }>>([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error' | 'warning' | 'info'
    });
    const [fadeIn, setFadeIn] = useState(true);

    // Chuyển đổi reminders từ API sang định dạng của giao diện frontend
    useEffect(() => {
        if (apiReminders && apiReminders.length > 0) {
            // Chuyển đổi dữ liệu từ định dạng API sang định dạng phù hợp với UI
            const convertedReminders = apiReminders.map(apiReminder => {
                const date = apiReminder.date || moment().format('YYYY-MM-DD');
                const time = "09:00";

                let tag;

                if (apiReminder.type === 'user') {
                    tag = 'user';
                } else if (apiReminder.period) {
                    if (apiReminder.period < 12) {
                        tag = 'prenental_checkup';
                    } else if (apiReminder.period >= 12 && apiReminder.period < 24) {
                        tag = 'ultrasound';
                    } else if (apiReminder.period >= 24 && apiReminder.period < 36) {
                        tag = 'lab_tests';
                    } else {
                        tag = 'vaccination';
                    }
                } else {
                    tag = 'prenental_checkup';
                }

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

            setUserReminders(convertedReminders);
        }
    }, [apiReminders]);

    // Hiển thị thông báo lỗi từ API nếu có
    useEffect(() => {
        if (apiError) {
            setSnackbar({
                open: true,
                message: `Lỗi: ${apiError}`,
                severity: 'error'
            });
        }
    }, [apiError]);

    // Khi refreshing, fade out
    useEffect(() => {
        if (!fadeIn) {
            const timer = setTimeout(() => {
                setFadeIn(true);
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [fadeIn]);

    // Xử lý việc thêm reminder mới (sẽ gọi API thông qua ReminderForm)
    const handleAddReminder = (newReminder: Omit<UserReminder, 'id'>, refreshAfterDelay = false) => {
        setIsFormOpen(false);
        setSelectedDate(newReminder.date);

        setSnackbar({
            open: true,
            message: 'Tạo reminder thành công!',
            severity: 'success'
        });

        // Nếu refreshAfterDelay = true, sẽ gọi API refreshReminders sau 4 giây
        if (refreshAfterDelay) {
            setTimeout(() => {
                refreshReminders(); // Gọi API để lấy lại dữ liệu mới nhất
            }, 4000);
        }
    };

    const handleDateClick = (arg: { dateStr: string }) => {
        if (selectedDate) {
            setSelectedDate(arg.dateStr);
            const newSelectedDateReminders = userReminders
                .filter(reminder => reminder.date === arg.dateStr)
                .sort((a, b) => a.time.localeCompare(b.time));
            setFadeIn(false);
            setTimeout(() => setFadeIn(true), 200);
        } else {
            setSelectedDate(arg.dateStr);
        }
    };

    const handleStatusChange = (reminderId: string, status: 'pending' | 'done' | 'skip') => {
        // Gọi API để cập nhật trạng thái của reminder
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
        skip: '#e53935',
        done: '#4caf50',
        pending: '#1976d2'
    };

    // Lọc reminder theo ngày được chọn
    const selectedDateReminders = selectedDate
        ? userReminders
            .filter(reminder => reminder.date === selectedDate)
            .sort((a, b) => a.time.localeCompare(b.time))
        : [];

    // Xoá hoặc vô hiệu hóa các handler này
    const handleEventMouseEnter = () => {
        // Không làm gì cả
    };

    const handleEventMouseLeave = () => {
        // Không làm gì cả
    };

    const events = userReminders.map(reminder => ({
        id: reminder.id,
        title: reminder.title,
        start: `${reminder.date}T${reminder.time}:00`,
        end: moment(`${reminder.date}T${reminder.time}:00`).add(30, 'minutes').format('YYYY-MM-DDTHH:mm:ss'),
        description: reminder.description,
        allDay: false,
        color: statusColors[reminder.status],
        textColor: '#ffffff',
        display: 'block',
        extendedProps: {
            status: reminder.status || 'pending',
            tag: reminder.tag,
            originalColor: reminder.color
        }
    }));

    useEffect(() => {
        const syncHeight = () => {
            const calendarEl = document.getElementById('mainCalendar');
            const timelineEl = document.querySelector(`.${styles.timelineContainer}`);

            if (calendarEl && timelineEl && timelineEl.parentElement) {
                // Điều chỉnh chiều cao của container chứa timeline
                timelineEl.parentElement.style.height = `${calendarEl.offsetHeight}px`;
            }
        };

        // Thực hiện đồng bộ khi selectedDate thay đổi
        if (selectedDate) {
            // Đợi một chút để đảm bảo FullCalendar đã render xong
            setTimeout(syncHeight, 50);
            setTimeout(syncHeight, 200); // Thử lại sau 200ms đề phòng FullCalendar render chậm
        }

        window.addEventListener('resize', syncHeight);
        return () => {
            window.removeEventListener('resize', syncHeight);
        };
    }, [selectedDate, styles.timelineContainer]);

    // Xử lý khi click vào link "more"
    const handleMoreLinkClick = (arg: { date: Date }): void => {
        // Mở TimelineView cho ngày đó
        setSelectedDate(moment(arg.date).format('YYYY-MM-DD'));
        // Không return anything
    };

    // Đăng ký event listener để tùy chỉnh popover sau khi nó được tạo
    useEffect(() => {
        const customizePopover = () => {
            const popovers = document.querySelectorAll('.fc-popover');
            popovers.forEach(popover => {
                // Kiểm tra nếu popover chưa được tùy chỉnh
                if (!popover.classList.contains('customized')) {
                    // Thêm class để đánh dấu đã tùy chỉnh
                    popover.classList.add('customized');

                    // Tùy chỉnh title
                    const title = popover.querySelector('.fc-popover-title');
                    if (title) {
                        title.textContent = 'Tất cả sự kiện';
                    }

                    // Tùy chỉnh các sự kiện trong popover
                    const events = popover.querySelectorAll('.fc-event');
                    events.forEach(event => {
                        // Thêm style hoặc listener cho từng event
                        event.addEventListener('click', (e) => {
                            // Xử lý khi click vào event trong popover
                            const eventId = event.getAttribute('data-event-id');
                            if (eventId) {
                                // Tìm và hiển thị chi tiết event
                                const reminder = userReminders.find(r => r.id === eventId);
                                if (reminder) {
                                    setSelectedDate(reminder.date);
                                }
                            }
                            e.stopPropagation();
                        });
                    });
                }
            });
        };

        // Đợi một chút để FullCalendar tạo popover
        document.addEventListener('click', () => {
            setTimeout(customizePopover, 50);
        });

        return () => {
            document.removeEventListener('click', customizePopover);
        };
    }, [userReminders]);

    // useEffect để xử lý cảnh báo khi có quá nhiều sự kiện
    useEffect(() => {
        // Nhóm sự kiện theo ngày
        const eventsByDate: Record<string, any[]> = {};

        userReminders.forEach(reminder => {
            if (!eventsByDate[reminder.date]) {
                eventsByDate[reminder.date] = [];
            }
            eventsByDate[reminder.date].push(reminder);
        });

        // Kiểm tra nếu có ngày nào có quá nhiều sự kiện (ví dụ: trên 5)
        Object.keys(eventsByDate).forEach(date => {
            if (eventsByDate[date].length > 5) {
                console.log(`Ngày ${date} có ${eventsByDate[date].length} sự kiện. Có thể ảnh hưởng đến hiển thị.`);
                // Có thể thêm logic để hiển thị cảnh báo hoặc thực hiện các hành động khác
            }
        });
    }, [userReminders]);

    return (
        <Container
            maxWidth={false}
            ref={mainContainerRef}
            sx={{
                pt: 3,
                pb: 3,
                px: { xs: 2, sm: 3, md: 4 },
                mt: '64px',
                mb: '16px',
                minHeight: 'calc(100vh - 64px - 16px - 24px - 24px)',
                backgroundColor: '#f9fcf9',
                overflow: 'hidden',
                position: 'relative',
                '& *': {
                    backfaceVisibility: 'hidden',
                    WebkitFontSmoothing: 'antialiased',
                }
            }}
        >
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Grid container spacing={3} sx={{
                    opacity: fadeIn ? 1 : 0.6,
                    transition: 'opacity 0.3s ease-in-out'
                }}>
                    {selectedDate && (
                        <Grid item xs={12} md={3} sx={{
                            height: { xs: 'auto', md: 'fit-content' },
                            position: 'relative',
                            display: 'flex'
                        }}>
                            <Paper
                                className={styles.hideScrollbar}
                                sx={{
                                    p: 0,
                                    overflow: 'hidden',
                                    height: { xs: 'calc(100vh - 220px)', md: 'auto' },
                                    width: '100%',
                                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                                    borderRadius: 2,
                                    my: 0,
                                    flexGrow: 1,
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}
                            >
                                <TimelineDayView
                                    date={selectedDate}
                                    reminders={selectedDateReminders}
                                    onClose={() => setSelectedDate(null)}
                                    handleStatusChange={(reminderId: string, status: string) => handleStatusChange(reminderId, status as 'pending' | 'done' | 'skip')}
                                />
                            </Paper>
                        </Grid>
                    )}

                    <Grid item xs={12} md={selectedDate ? 9 : 12}>
                        <div className={styles.calendar} id="mainCalendar">
                            <FullCalendar
                                plugins={[dayGridPlugin, interactionPlugin]}
                                initialView="dayGridMonth"
                                headerToolbar={{
                                    left: 'prev,next today',
                                    center: 'title',
                                    right: 'addReminder'
                                }}
                                customButtons={{
                                    addReminder: {
                                        text: '+',
                                        click: () => setIsFormOpen(true)
                                    }
                                }}
                                events={events}
                                editable={true}
                                selectable={true}
                                selectMirror={true}
                                dayMaxEvents={false}
                                moreLinkText={(n) => `Xem thêm ${n} sự kiện`}
                                moreLinkClick={handleMoreLinkClick}
                                weekends={true}
                                height="auto"
                                locale="vi"
                                dateClick={handleDateClick}
                                buttonText={{
                                    today: 'Hôm nay'
                                }}
                                eventTimeFormat={{
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: false
                                }}
                                eventContent={(eventInfo) => {
                                    const status = eventInfo.event.extendedProps.status;
                                    return {
                                        html: `
                                            <div class="${styles.eventContent} ${status === 'done' ? styles.checkedEvent : ''}">
                                                <div class="${styles.eventTitle}">
                                                    ${eventInfo.event.title}
                                                </div>
                                                <div class="${styles.eventTime}">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 2px;">
                                                        <circle cx="12" cy="12" r="10"></circle>
                                                        <polyline points="12 6 12 12 16 14"></polyline>
                                                    </svg>
                                                    ${eventInfo.timeText}
                                                </div>
                                            </div>
                                        `
                                    };
                                }}
                                moreLinkClassNames={styles.moreLink}
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
                            borderRadius: 2,
                            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.15)',
                            overflow: 'hidden'
                        }
                    }}
                >
                    <ReminderForm
                        onSubmit={handleAddReminder as (reminder: Omit<Reminder, 'id'>, refreshAfterDelay?: boolean) => void}
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
                        sx={{
                            bgcolor: snackbar.severity === 'success' ? '#4caf50' : '#e53935'
                        }}
                    >
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </Box>
        </Container>
    );
}