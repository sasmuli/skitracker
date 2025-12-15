'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

type DatePickerProps = {
  value: string; // YYYY-MM-DD format
  onChange: (value: string) => void;
  maxDate?: string; // YYYY-MM-DD format
};

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

export function DatePicker({ value, onChange, maxDate }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(() => {
    const d = value ? new Date(value) : new Date();
    return { year: d.getFullYear(), month: d.getMonth() };
  });
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Parse selected date
  const selectedDate = value ? new Date(value) : null;
  const maxDateObj = maxDate ? new Date(maxDate) : null;

  // Get days in month
  function getDaysInMonth(year: number, month: number) {
    return new Date(year, month + 1, 0).getDate();
  }

  // Get first day of month (0 = Sunday, convert to Monday-based)
  function getFirstDayOfMonth(year: number, month: number) {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1; // Convert to Monday = 0
  }

  function handlePrevMonth() {
    setViewDate((prev) => {
      if (prev.month === 0) {
        return { year: prev.year - 1, month: 11 };
      }
      return { ...prev, month: prev.month - 1 };
    });
  }

  function handleNextMonth() {
    setViewDate((prev) => {
      if (prev.month === 11) {
        return { year: prev.year + 1, month: 0 };
      }
      return { ...prev, month: prev.month + 1 };
    });
  }

  function handleSelectDay(day: number) {
    const dateStr = `${viewDate.year}-${String(viewDate.month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    onChange(dateStr);
    setIsOpen(false);
  }

  function isDateDisabled(day: number) {
    if (!maxDateObj) return false;
    const date = new Date(viewDate.year, viewDate.month, day);
    return date > maxDateObj;
  }

  function isToday(day: number) {
    const today = new Date();
    return (
      viewDate.year === today.getFullYear() &&
      viewDate.month === today.getMonth() &&
      day === today.getDate()
    );
  }

  function isSelected(day: number) {
    if (!selectedDate) return false;
    return (
      viewDate.year === selectedDate.getFullYear() &&
      viewDate.month === selectedDate.getMonth() &&
      day === selectedDate.getDate()
    );
  }

  // Format display value
  const displayValue = selectedDate
    ? selectedDate.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    : 'Select date';

  const daysInMonth = getDaysInMonth(viewDate.year, viewDate.month);
  const firstDay = getFirstDayOfMonth(viewDate.year, viewDate.month);

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="input w-full flex items-center justify-between text-left"
      >
        <span className={selectedDate ? 'text-slate-100' : 'text-slate-500'}>
          {displayValue}
        </span>
        <Calendar className="w-4 h-4 text-slate-400" />
      </button>

      {/* Dropdown calendar */}
      {isOpen && (
        <div className="absolute z-50 mt-2 p-4 bg-slate-900 border border-slate-700 rounded-lg shadow-xl w-full">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1 hover:bg-slate-800 rounded transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-slate-400" />
            </button>
            <span className="text-sm font-medium text-slate-200">
              {MONTHS[viewDate.month]} {viewDate.year}
            </span>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1 hover:bg-slate-800 rounded transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {DAYS.map((day) => (
              <div
                key={day}
                className="text-center text-xs text-slate-500 font-medium py-1"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty cells for days before first of month */}
            {Array.from({ length: firstDay }, (_, i) => (
              <div key={`empty-${i}`} />
            ))}

            {/* Day cells */}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = i + 1;
              const disabled = isDateDisabled(day);
              const selected = isSelected(day);
              const today = isToday(day);

              return (
                <button
                  key={day}
                  type="button"
                  disabled={disabled}
                  onClick={() => handleSelectDay(day)}
                  className={`
                    w-8 h-8 text-sm rounded-md transition-colors
                    ${disabled
                      ? 'text-slate-600 cursor-not-allowed'
                      : 'hover:bg-slate-700 cursor-pointer'
                    }
                    ${selected
                      ? 'bg-sky-500 text-white hover:bg-sky-600'
                      : ''
                    }
                    ${today && !selected
                      ? 'border border-sky-500 text-sky-400'
                      : ''
                    }
                    ${!selected && !today && !disabled
                      ? 'text-slate-300'
                      : ''
                    }
                  `}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div className="flex justify-between mt-4 pt-3 border-t border-slate-700">
            <button
              type="button"
              onClick={() => {
                onChange('');
                setIsOpen(false);
              }}
              className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => {
                const today = new Date();
                const dateStr = today.toISOString().slice(0, 10);
                if (!maxDateObj || today <= maxDateObj) {
                  onChange(dateStr);
                  setIsOpen(false);
                }
              }}
              className="text-xs text-sky-400 hover:text-sky-300 transition-colors"
            >
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  );
}