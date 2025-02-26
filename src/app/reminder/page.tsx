'use client'

import React, { useState } from 'react';
import { FaPlus, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './page.css';

interface Event {
  id: string;
  time: string;
  title: string;
  date: Date;
}

const ReminderPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState<'Day' | 'Week' | 'Month' | 'Year'>('Week');

  // Mock data for events
  const events: Event[] = [
    {
      id: '1',
      time: '8:00 AM',
      title: 'Hẹn đi khám thai',
      date: new Date(2024, 1, 22)
    },
    {
      id: '2',
      time: '10:00 AM',
      title: 'Đi mua đồ cho con',
      date: new Date(2024, 1, 22)
    },
    {
      id: '3',
      time: '1:00 PM',
      title: 'Đi ăn trưa',
      date: new Date(2024, 1, 22)
    },
    {
      id: '4',
      time: '9:00 AM',
      title: 'Đi tiêm vắc xin',
      date: new Date(2024, 1, 24)
    },
    {
      id: '5',
      time: '10:00 AM',
      title: 'Đi tập yoga cho bà bầu',
      date: new Date(2024, 1, 25)
    }
  ];

  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  
  const getWeekDates = () => {
    const dates = [];
    const currentDate = new Date(selectedDate);
    const firstDayOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay()));
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(firstDayOfWeek);
      date.setDate(firstDayOfWeek.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => 
      event.date.getDate() === date.getDate() &&
      event.date.getMonth() === date.getMonth() &&
      event.date.getFullYear() === date.getFullYear()
    );
  };

  const handlePrevWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 7);
    setSelectedDate(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 7);
    setSelectedDate(newDate);
  };

  const handleToday = () => {
    setSelectedDate(new Date());
  };

  return (
    <div className="main-content">
      <div className="reminder-container">
        <div className="reminder-header">
          <div className="header-left">
            <h2>
              February 2024
              <button className="add-button">
                <FaPlus size={14} />
              </button>
            </h2>
          </div>
          
          <div className="header-navigation">
            <div className="nav-arrows">
              <button onClick={handlePrevWeek}><FaChevronLeft /></button>
              <button className="today-button" onClick={handleToday}>Today</button>
              <button onClick={handleNextWeek}><FaChevronRight /></button>
            </div>
            
            <div className="view-options">
              <button className={view === 'Day' ? 'active' : ''} onClick={() => setView('Day')}>Day</button>
              <button className={view === 'Week' ? 'active' : ''} onClick={() => setView('Week')}>Week</button>
              <button className={view === 'Month' ? 'active' : ''} onClick={() => setView('Month')}>Month</button>
              <button className={view === 'Year' ? 'active' : ''} onClick={() => setView('Year')}>Year</button>
            </div>
          </div>
        </div>

        <div className="calendar-grid">
          <div className="weekday-header">
            <div className="weekday-cell"></div> {/* Empty cell for time column */}
            {getWeekDates().map((date, index) => (
              <div key={index} className="weekday-cell">
                <div className="weekday-name">{daysOfWeek[index]}</div>
                <div className="weekday-date">{date.getDate()}</div>
              </div>
            ))}
          </div>

          <div className="time-grid">
            {Array.from({ length: 17 }, (_, i) => i + 7).map((hour) => (
              <div key={hour} className="time-row">
                <div className="time-label">
                  {hour === 12 ? '12 PM' : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
                </div>
                {getWeekDates().map((date, dateIndex) => (
                  <div key={dateIndex} className="time-cell">
                    {getEventsForDate(date)
                      .filter(event => parseInt(event.time) === hour)
                      .map(event => (
                        <div key={event.id} className="event-item">
                          <span className="event-time">{event.time}</span>
                          <span className="event-title">{event.title}</span>
                        </div>
                      ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReminderPage;