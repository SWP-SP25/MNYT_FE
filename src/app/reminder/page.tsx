'use client'

import React, { useState } from 'react';
import { FaPlus, FaChevronLeft, FaChevronRight, FaSun } from 'react-icons/fa';
import './page.css';

interface Event {
  id: string;
  time: string;
  title: string;
  date: Date;
  type: 'primary' | 'secondary';
}

const ReminderPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState<'Day' | 'Week' | 'Month' | 'Year'>('Week');

  const events: Event[] = [
    {
      id: '1',
      time: '8:00 AM',
      title: 'Hẹn đi khám thai',
      date: new Date(2024, 1, 22),
      type: 'primary'
    },
    {
      id: '2',
      time: '10:00 AM',
      title: 'Đi mua đồ cho con',
      date: new Date(2024, 1, 22),
      type: 'secondary'
    },
    {
      id: '3',
      time: '1:00 PM',
      title: 'Đi ăn trưa',
      date: new Date(2024, 1, 22),
      type: 'primary'
    },
    {
      id: '4',
      time: '9:00 AM',
      title: 'Đi tiêm vắc xin',
      date: new Date(2024, 1, 24),
      type: 'primary'
    },
    {
      id: '5',
      time: '10:00 AM',
      title: 'Đi tập yoga cho bà bầu',
      date: new Date(2024, 1, 25),
      type: 'secondary'
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

  const renderMiniCalendar = () => {
    const today = new Date();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).getDay();
    
    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day-mini" />);
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      const isToday = i === today.getDate();
      const hasEvent = events.some(event => event.date.getDate() === i);
      days.push(
        <div
          key={i}
          className={`calendar-day-mini ${isToday ? 'today' : ''} ${hasEvent ? 'has-event' : ''}`}
        >
          {i}
        </div>
      );
    }
    
    return days;
  };

  return (
    <div className="reminder-layout">
      <div className="reminder-sidebar">
        <div className="mini-calendar">
          <div className="month-header">
            <h2 className="month-title">
              February <span>2024</span>
            </h2>
            <button className="add-button">
              <FaPlus size={14} />
            </button>
          </div>
          
          <div className="weekday-header">
            {daysOfWeek.map(day => (
              <span key={day}>{day.slice(0, 1)}</span>
            ))}
          </div>
          
          <div className="calendar-grid-mini">
            {renderMiniCalendar()}
          </div>
        </div>

        <div className="important-days">
          <div className="important-day">
            <div className="day-header">
              <div className="day-date">HÔM NAY 2/22/2021</div>
              <div className="day-weather">
                55°/40° <FaSun />
              </div>
              <div className="important-tag">NGÀY QUAN TRỌNG</div>
            </div>
            <div className="day-events">
              {events.slice(0, 2).map(event => (
                <div key={event.id} className="event">
                  <div className="event-time">{event.time}</div>
                  <div className="event-title">{event.title}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="calendar-container">
        <div className="calendar-header">
          <h2>February 2024</h2>
          <div className="view-controls">
            <div className="nav-buttons">
              <button className="nav-button" onClick={handlePrevWeek}>
                <FaChevronLeft />
              </button>
              <button className="nav-button" onClick={handleToday}>
                Today
              </button>
              <button className="nav-button" onClick={handleNextWeek}>
                <FaChevronRight />
              </button>
            </div>
            
            <div className="view-options">
              <button
                className={`view-option ${view === 'Day' ? 'active' : ''}`}
                onClick={() => setView('Day')}
              >
                Day
              </button>
              <button
                className={`view-option ${view === 'Week' ? 'active' : ''}`}
                onClick={() => setView('Week')}
              >
                Week
              </button>
              <button
                className={`view-option ${view === 'Month' ? 'active' : ''}`}
                onClick={() => setView('Month')}
              >
                Month
              </button>
              <button
                className={`view-option ${view === 'Year' ? 'active' : ''}`}
                onClick={() => setView('Year')}
              >
                Year
              </button>
            </div>
          </div>
        </div>

        <div className="week-grid">
          <div className="time-column">
            <div className="time-column-header"></div>
            {Array.from({ length: 15 }, (_, i) => i + 7).map(hour => (
              <div key={hour} className="time-slot">
                {hour === 12 ? '12 PM' : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
              </div>
            ))}
          </div>

          {getWeekDates().map((date, index) => (
            <div key={index} className="day-column">
              <div className="day-header">
                <div className="day-name">{daysOfWeek[date.getDay()]}</div>
                <div className="day-number">{date.getDate()}</div>
              </div>
              
              {Array.from({ length: 15 }, (_, i) => i + 7).map(hour => (
                <div key={hour} className="time-block">
                  {getEventsForDate(date)
                    .filter(event => parseInt(event.time) === hour)
                    .map(event => (
                      <div key={event.id} className={`event-block ${event.type}`}>
                        <div className="event-time">{event.time}</div>
                        <div className="event-title">{event.title}</div>
                      </div>
                    ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReminderPage;