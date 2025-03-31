import React, { useState, useEffect, useRef } from 'react';
import {
    Box, Typography, IconButton, Chip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import moment from 'moment';
import styles from './TimelineDayView.module.css';

// Định nghĩa kiểu dữ liệu cho props
interface TimelineDayViewProps {
    date: string;
    reminders: any[]; // Nên thay bằng kiểu cụ thể của reminder
    onClose: () => void;
    handleStatusChange: (reminderId: string, status: string) => void;
}

// Định nghĩa REMINDER_TAGS (hoặc nhận vào từ props)
const REMINDER_TAGS = [
    { value: 'prenental_checkup', label: 'Khám thai', color: '#f44336' },
    { value: 'ultrasound', label: 'Siêu âm', color: '#4caf50' },
    { value: 'lab_tests', label: 'Xét nghiệm', color: '#2196f3' },
    { value: 'vaccination', label: 'Tiêm chủng', color: '#ff9800' },
];

const TimelineDayView: React.FC<TimelineDayViewProps> = ({
    date,
    reminders,
    onClose,
    handleStatusChange
}) => {
    const containerRef = useRef<HTMLDivElement>(null);

    // Đảm bảo reminders luôn là một mảng
    const safeReminders = reminders || [];

    // Nhóm reminder theo giờ
    const remindersByHour: Record<number, any[]> = {};
    safeReminders.forEach(reminder => {
        if (reminder) {
            // Đảm bảo sử dụng time từ reminder, KHÔNG thay đổi giá trị gốc
            const timeString = reminder.time;

            // Xử lý theo giờ (lấy phần số giờ đầu tiên) chỉ để phân nhóm hiển thị
            let hourValue = -1; // Giá trị mặc định nếu không phân tích được giờ

            if (timeString && typeof timeString === 'string') {
                const timeParts = timeString.split(':');
                if (timeParts.length >= 2) {
                    hourValue = parseInt(timeParts[0], 10);
                }
            }

            // Nếu giờ không hợp lệ, đặt vào nhóm giờ mặc định (9h) CHỈ để hiển thị
            // KHÔNG thay đổi giá trị time trong reminder
            if (typeof hourValue !== 'number' || isNaN(hourValue) || hourValue < 0 || hourValue > 23) {
                hourValue = 9; // Sử dụng 9h CHỈ cho mục đích nhóm hiển thị
            }

            // Tạo mảng cho giờ nếu chưa có
            if (!remindersByHour[hourValue]) {
                remindersByHour[hourValue] = [];
            }

            // Thêm reminder gốc (không thay đổi) vào mảng theo giờ
            remindersByHour[hourValue].push(reminder);
        }
    });

    // Tạo danh sách các khung giờ từ 6:00 đến 22:00
    const timeSlots = Array.from({ length: 17 }, (_, i) => i + 6); // 6h -> 22h

    // State để xử lý reminder được chọn
    const [selectedReminder, setSelectedReminder] = useState(null);

    // State cho expanded hours
    const [expandedHours, setExpandedHours] = useState<number[]>([]);

    // Thêm state để theo dõi sự kiện được chọn
    const [expandedReminderId, setExpandedReminderId] = useState<string | null>(null);

    // Hàm rút gọn description
    const truncateText = (text: string, maxLength = 40) => {
        if (!text) return '';
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };

    // Toggle expanded hour
    const toggleExpandHour = (hour: number) => {
        if (expandedHours.includes(hour)) {
            setExpandedHours(expandedHours.filter(h => h !== hour));
        } else {
            setExpandedHours([...expandedHours, hour]);
        }
    };

    // Hàm toggle chi tiết sự kiện
    const toggleReminderDetails = (reminderId: string) => {
        if (expandedReminderId === reminderId) {
            setExpandedReminderId(null); // Đóng nếu đã mở
        } else {
            setExpandedReminderId(reminderId); // Mở nếu chưa mở
        }
    };

    // Component hiển thị reminder item để tái sử dụng
    const ReminderItemComponent = ({ reminder }: { reminder: any }) => (
        <Box
            key={reminder.id}
            className={`${styles.reminderItem} ${reminder.status === 'done' || reminder.status === 'skip' ? styles.completedReminder : ''}`}
            onClick={() => toggleReminderDetails(reminder.id)}
            sx={{
                borderLeftColor: reminder.color || '#4caf50',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                '&:hover': {
                    transform: 'none',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.08)'
                },
                ...(expandedReminderId === reminder.id ? {
                    backgroundColor: '#e8f5e9',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.12) !important'
                } : {})
            }}
        >
            {/* Phần header chứa tiêu đề, tag và status */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 0.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {/* Icon status */}
                    <Box
                        component="span"
                        sx={{
                            display: 'inline-flex',
                            width: 18,
                            height: 18,
                            borderRadius: '50%',
                            backgroundColor:
                                reminder.status === 'done' ? '#4caf50' :
                                    reminder.status === 'skip' ? '#f44336' : '#1976d2',
                            color: 'white',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.7rem',
                            mr: 0.5
                        }}
                    >
                        {
                            reminder.status === 'done' ? '✓' :
                                reminder.status === 'skip' ? '✗' : '⧖'
                        }
                    </Box>

                    {/* Tiêu đề */}
                    <Typography variant="body2" sx={{
                        fontWeight: 500,
                        fontSize: '0.85rem',
                        lineHeight: 1.2
                    }}>
                        {reminder.title}
                    </Typography>
                </Box>

                {/* Tag chip */}
                <Chip
                    size="small"
                    label={REMINDER_TAGS.find(t => t.value === reminder.tag)?.label || 'Tự tạo'}
                    sx={{
                        bgcolor: reminder.color || '#4caf50',
                        color: 'white',
                        height: '18px',
                        fontSize: '0.65rem',
                        '& .MuiChip-label': {
                            px: 1,
                            py: 0
                        }
                    }}
                />
            </Box>

            {/* Phần thời gian và description - tận dụng không gian trống bên dưới */}
            <Box sx={{
                pl: 0.5,
                pr: 0.5,
                pt: 0.5,
                display: 'flex',
                flexDirection: 'column',
                gap: 0.5
            }}>
                {/* Thời gian */}
                <Typography
                    variant="caption"
                    sx={{
                        color: 'text.secondary',
                        fontSize: '0.75rem',
                        display: 'flex',
                        alignItems: 'center'
                    }}
                >
                    <Box component="span" sx={{
                        display: 'inline-flex',
                        width: 16,
                        height: 16,
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 0.5,
                        opacity: 0.7
                    }}>
                        ⏱
                    </Box>
                    {reminder.time}
                </Typography>

                {/* Description - hiển thị nếu có */}
                {reminder.description && (
                    <Typography
                        variant="caption"
                        sx={{
                            color: 'text.secondary',
                            fontSize: '0.75rem',
                            lineHeight: 1.3,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            ml: 2.5
                        }}
                    >
                        {reminder.description}
                    </Typography>
                )}
            </Box>

            {/* Phần chi tiết chỉ hiển thị khi reminder được chọn */}
            {expandedReminderId === reminder.id && (
                <Box sx={{
                    mt: 1.5,
                    pt: 1.5,
                    borderTop: '1px dashed #e0e0e0',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1
                }}>
                    {reminder.description && (
                        <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
                            {reminder.description}
                        </Typography>
                    )}

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            Trạng thái:
                        </Typography>

                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                            <Chip
                                label="Chưa làm"
                                size="small"
                                clickable
                                color={reminder.status === 'pending' ? 'primary' : 'default'}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    // Gọi hàm thay đổi trạng thái (sẽ gọi API updateReminderStatus)
                                    handleStatusChange(reminder.id, 'pending');
                                }}
                                sx={{ height: '24px', fontSize: '0.7rem' }}
                            />
                            <Chip
                                label="Đã làm"
                                size="small"
                                clickable
                                color={reminder.status === 'done' ? 'success' : 'default'}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    // Gọi hàm thay đổi trạng thái (sẽ gọi API updateReminderStatus)
                                    handleStatusChange(reminder.id, 'done');
                                }}
                                sx={{ height: '24px', fontSize: '0.7rem' }}
                            />
                            <Chip
                                label="Bỏ qua"
                                size="small"
                                clickable
                                color={reminder.status === 'skip' ? 'error' : 'default'}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    // Gọi hàm thay đổi trạng thái (sẽ gọi API updateReminderStatus)
                                    handleStatusChange(reminder.id, 'skip');
                                }}
                                sx={{ height: '24px', fontSize: '0.7rem' }}
                            />
                        </Box>
                    </Box>
                </Box>
            )}
        </Box>
    );

    // Thêm vào useEffect khi date thay đổi
    useEffect(() => {
        // Reset các state khi date thay đổi
        setExpandedHours([]);
        setExpandedReminderId(null);
    }, [date]);

    return (
        <Box
            ref={containerRef}
            className={styles.timelineContainer}
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                bgcolor: 'white'
            }}
        >
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                p: 1.5,
                borderBottom: '1px solid #e0e0e0',
                bgcolor: 'white',
                zIndex: 2 // Đảm bảo header luôn hiển thị trên cùng
            }}>
                <Typography variant="subtitle1" sx={{
                    color: '#2e7d32',
                    fontWeight: 500,
                    fontSize: '0.9rem'
                }}>
                    Lịch trình ngày {moment(date).format('DD/MM/YYYY')}
                </Typography>

                <IconButton onClick={onClose} size="small" sx={{ p: 0.5 }}>
                    <CloseIcon fontSize="small" />
                </IconButton>
            </Box>

            <Box className={styles.timelineScrollContainer} sx={{ p: 1, flex: 1, overflowY: 'auto' }}>
                {/* Hiển thị các reminder không có giờ hoặc giờ không hợp lệ */}
                {remindersByHour[-1] && remindersByHour[-1].length > 0 && (
                    <Box className={styles.timeSlotContainer}>
                        <Box className={styles.timeLabel} sx={{ color: '#f44336' }}>
                            Không rõ giờ
                        </Box>
                        <Box className={styles.remindersList}>
                            {remindersByHour[-1].map(reminder => (
                                <ReminderItemComponent reminder={reminder} key={reminder.id} />
                            ))}
                        </Box>
                    </Box>
                )}

                {timeSlots.map(hour => {
                    const hourReminders = remindersByHour[hour] || [];
                    const hasReminders = hourReminders.length > 0;

                    return (
                        <Box key={hour} className={styles.timeSlotContainer}>
                            <Box className={styles.timeLabel}>
                                {`${hour}:00`}
                            </Box>

                            <Box className={styles.remindersList}>
                                {hasReminders ? (
                                    <>
                                        {hourReminders.length > 2 && !expandedHours.includes(hour) ? (
                                            <>
                                                {/* Hiển thị 2 sự kiện đầu tiên */}
                                                {hourReminders.slice(0, 2).map(reminder => (
                                                    <ReminderItemComponent reminder={reminder} key={reminder.id} />
                                                ))}

                                                {/* Nút hiển thị thêm */}
                                                <Box
                                                    className={styles.showMoreButton}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggleExpandHour(hour);
                                                    }}
                                                >
                                                    <ExpandMoreIcon fontSize="small" sx={{ mr: 0.5, fontSize: '1rem' }} />
                                                    <Typography variant="caption">
                                                        Xem thêm {hourReminders.length - 2} sự kiện
                                                    </Typography>
                                                </Box>
                                            </>
                                        ) : (
                                            <>
                                                {/* Hiển thị tất cả sự kiện */}
                                                {hourReminders.map(reminder => (
                                                    <ReminderItemComponent reminder={reminder} key={reminder.id} />
                                                ))}

                                                {/* Nút thu gọn nếu đang mở rộng */}
                                                {hourReminders.length > 2 && expandedHours.includes(hour) && (
                                                    <Box
                                                        className={styles.showMoreButton}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            toggleExpandHour(hour);
                                                        }}
                                                    >
                                                        <ExpandLessIcon fontSize="small" sx={{ mr: 0.5, fontSize: '1rem' }} />
                                                        <Typography variant="caption">
                                                            Thu gọn
                                                        </Typography>
                                                    </Box>
                                                )}
                                            </>
                                        )}
                                    </>
                                ) : (
                                    <Box className={styles.emptySlot}></Box>
                                )}
                            </Box>
                        </Box>
                    );
                })}
            </Box>
        </Box>
    );
};

export default TimelineDayView; 