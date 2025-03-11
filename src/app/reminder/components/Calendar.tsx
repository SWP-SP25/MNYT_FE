
import React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import { Paper, Chip, Box } from '@mui/material';
import type { Reminder } from '@/types/reminder';
import type { Moment } from 'moment';

interface CalendarProps {
    reminders: Reminder[];
    onDayClick: (date: Moment) => void;
}

const Calendar: React.FC<CalendarProps> = ({ reminders, onDayClick }) => {
    const renderDayContent = (date: Moment) => {
        const dayReminders = reminders.filter(
            reminder => date.format('YYYY-MM-DD') === reminder.date
        );

        if (dayReminders.length === 0) return null;

        return (
            <Box sx={{
                position: 'absolute',
                bottom: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                flexDirection: 'column',
                gap: 0.5,
                alignItems: 'center'
            }}>
                {dayReminders.map(reminder => (
                    <Chip
                        key={reminder.id}
                        label={`${reminder.time} - ${reminder.title}`}
                        size="small"
                        color="primary"
                        sx={{
                            maxWidth: '90%',
                            fontSize: '0.7rem',
                            height: '20px'
                        }}
                    />
                ))}
            </Box>
        );
    };

    return (
        <Paper elevation={3} sx={{ p: 2 }}>
            <LocalizationProvider dateAdapter={AdapterMoment}>
                <DateCalendar
                    onChange={(newDate) => onDayClick(newDate as Moment)}
                    slots={{
                        day: (props) => {
                            const { day, ...other } = props;
                            return (
                                <Box
                                    sx={{
                                        position: 'relative',
                                        height: '70px',
                                        width: '100%'
                                    }}
                                >
                                    <PickersDay day={day} {...other} />
                                    {renderDayContent(day)}
                                </Box>
                            );
                        }
                    }}
                />
            </LocalizationProvider>
        </Paper>
    );
};

export default Calendar; 