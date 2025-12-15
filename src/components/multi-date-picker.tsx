'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, X } from 'lucide-react';

type MultiDatePickerProps = {
  selectedDates: string[]; // Array of YYYY-MM-DD strings
  onChange: (dates: string[]) => void;
  maxDate?: string; // YYYY-MM-DD format
};

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

export function MultiDatePicker({ selectedDates, onChange, maxDate }: MultiDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(() => {
    const d = new Date();
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

  const maxDateObj = maxDate ? new Date(maxDate) : null;

  function getDaysInMonth(year: number, month: number) {
    return new Date(year, month + 1, 0).getDate();
  }

  function getFirstDayOfMonth(year: number, month: number) {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1;
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

  function handleToggleDay(day: number) {
    const dateStr = `${viewDate.year}-${String(viewDate.month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    if (selectedDates.includes(dateStr)) {
      onChange(selectedDates.filter(d => d !== dateStr));
    } else {
      // Add and sort dates
      const newDates = [...selectedDates, dateStr].sort();
      onChange(newDates);
    }
  }

  function removeDate(dateStr: string) {
    onChange(selectedDates.filter(d => d !== dateStr));
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
    const dateStr = `${viewDate.year}-${String(viewDate.month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return selectedDates.includes(dateStr);
  }

  function formatDate(dateStr: string) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  const daysInMonth = getDaysInMonth(viewDate.year, viewDate.month);
  const firstDay = getFirstDayOfMonth(viewDate.year, viewDate.month);

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="input w-full flex items-center justify-between text-left min-h-[44px]"
      >
        <span className={selectedDates.length > 0 ? 'text-slate-100' : 'text-slate-500'}>
          {selectedDates.length === 0 
            ? 'Select dates' 
            : `${selectedDates.length} day${selectedDates.length > 1 ? 's' : ''} selected`}
        </span>
        <Calendar className="w-4 h-4 text-slate-400 flex-shrink-0" />
      </button>

      {/* Selected dates chips */}
      {selectedDates.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedDates.map((dateStr) => (
            <span
              key={dateStr}
              className="inline-flex items-center gap-1 px-2 py-1 bg-sky-500/20 text-sky-300 text-xs rounded-full"
            >
              {formatDate(dateStr)}
              <button
                type="button"
                onClick={() => removeDate(dateStr)}
                className="hover:text-sky-100 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

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
            {Array.from({ length: firstDay }, (_, i) => (
              <div key={`empty-${i}`} />
            ))}

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
                  onClick={() => handleToggleDay(day)}
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
              onClick={() => onChange([])}
              className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
            >
              Clear all
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-xs text-sky-400 hover:text-sky-300 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
