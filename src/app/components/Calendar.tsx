import React from 'react';
import { Calendar as AntCalendar } from 'antd';
import { Badge } from 'react-bootstrap';
import type { Reminder } from '@/types/reminder';
import type { Moment } from 'moment';

interface CalendarProps {
    reminders: Reminder[];
    onDayClick: (date: Moment) => void;
}

const Calendar: React.FC<CalendarProps> = ({ reminders, onDayClick }) => {
    const cellRender = (date: Moment) => {
        const dayReminders = reminders.filter(
            reminder => date.format('YYYY-MM-DD') === reminder.date
        );

        return (
            <ul className="events" style={{ listStyle: 'none', padding: 0 }}>
                {dayReminders.map(reminder => (
                    <li key={reminder.id}>
                        <Badge bg="primary">
                            {reminder.time} - {reminder.title}
                        </Badge>
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <AntCalendar
            onSelect={onDayClick}
            cellRender={cellRender}
            style={{ padding: '20px' }}
        />
    );
};

export default Calendar; 