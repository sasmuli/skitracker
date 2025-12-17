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
  const [currentDate, setCurrentDate] = useState(new Date()); //TODO add more ui to calendar day like show resort name or something like that 

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
    <div className="bg-slate-800/50 rounded-xl p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={prevMonth}
          className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <h2 className="text-lg font-semibold">
          {MONTHS[month]} {year}
        </h2>
        
        <button
          type="button"
          onClick={nextMonth}
          className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {WEEKDAYS.map(day => (
          <div key={day} className="text-center text-xs text-slate-400 py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} className="aspect-square" />;
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
              className={`
                aspect-square rounded-lg flex items-center justify-center text-sm
                transition-colors relative
                ${isToday ? 'ring-2 ring-sky-400' : ''}
                ${hasSkiDay 
                  ? 'bg-sky-600 hover:bg-sky-500 text-white font-medium' 
                  : 'hover:bg-slate-700 text-slate-300'
                }
              `}
            >
              {day}
              {hasSkiDay && skiDay.rating && (
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 text-[8px]">
                  {'⭐'.repeat(Math.min(skiDay.rating, 3))}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
