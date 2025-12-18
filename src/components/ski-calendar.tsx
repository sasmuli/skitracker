'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { SkiDay } from '@/types';

type SkiCalendarProps = {
  skiDays: SkiDay[];
  onDayClick?: (date: string) => void;
};

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function SkiCalendar({ skiDays, onDayClick }: SkiCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Get first day of month (0 = Sunday, adjust for Monday start)
  const firstDayOfMonth = new Date(year, month, 1);
  let startDay = firstDayOfMonth.getDay() - 1;
  if (startDay < 0) startDay = 6; // Sunday becomes 6

  // Get number of days in month
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Create map of ski days by date string
  const skiDayMap = new Map<string, SkiDay>();
  skiDays.forEach(day => {
    skiDayMap.set(day.date, day);
  });

  // Generate calendar days
  const calendarDays: (number | null)[] = [];
  
  // Empty cells before first day
  for (let i = 0; i < startDay; i++) {
    calendarDays.push(null);
  }
  
  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  function prevMonth() {
    setCurrentDate(new Date(year, month - 1, 1));
  }

  function nextMonth() {
    setCurrentDate(new Date(year, month + 1, 1));
  }

  function formatDateString(day: number): string {
    const m = (month + 1).toString().padStart(2, '0');
    const d = day.toString().padStart(2, '0');
    return `${year}-${m}-${d}`;
  }

  const today = new Date();
  const todayString = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;

  return (
    <div className="ski-calendar">
      {/* Header */}
      <div className="ski-calendar-header">
        <button
          type="button"
          onClick={prevMonth}
          className="ski-calendar-nav"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <h2 className="ski-calendar-title">
          {MONTHS[month]} {year}
        </h2>
        
        <button
          type="button"
          onClick={nextMonth}
          className="ski-calendar-nav"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="ski-calendar-weekdays">
        {WEEKDAYS.map(day => (
          <div key={day} className="ski-calendar-weekday">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      {/* TODO Change color of the day according to ski type (park, piste etc) not sure how to do if multiple choosen */}
      <div className="ski-calendar-grid">
        {calendarDays.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} className="ski-calendar-day" style={{ visibility: 'hidden' }} />;
          }

          const dateString = formatDateString(day);
          const skiDay = skiDayMap.get(dateString);
          const isToday = dateString === todayString;
          const hasSkiDay = !!skiDay;

          return (
            <button
              key={dateString}
              type="button"
              onClick={() => onDayClick?.(dateString)}
              className={`ski-calendar-day ${isToday ? 'ski-calendar-day-today' : ''} ${hasSkiDay ? 'ski-calendar-day-ski' : ''}`}
            >
              <span className="ski-calendar-day-number">{day}</span>
              {hasSkiDay && skiDay.resort && (
                <span className="ski-calendar-day-resort">
                  {skiDay.resort.name}
                </span>
              )}
              {hasSkiDay && skiDay.rating && (
                <span className="ski-calendar-day-rating">
                  {'⭐'.repeat(Math.min(skiDay.rating, 5))}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
