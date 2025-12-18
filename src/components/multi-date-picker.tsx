'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Position dropdown when opened
  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setDropdownStyle({
        position: 'fixed',
        top: rect.bottom + 8,
        left: rect.left,
        width: rect.width,
        zIndex: 9999,
      });
    }
  }, [isOpen]);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      const isOutsideContainer = containerRef.current && !containerRef.current.contains(target);
      const isOutsideDropdown = dropdownRef.current && !dropdownRef.current.contains(target);
      
      if (isOutsideContainer && isOutsideDropdown) {
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
    <div ref={containerRef} className="date-picker">
      {/* Trigger button */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="input date-picker-trigger"
      >
        <span className={selectedDates.length > 0 ? 'date-picker-trigger-text' : 'date-picker-trigger-placeholder'}>
          {selectedDates.length === 0 
            ? 'Select dates' 
            : `${selectedDates.length} day${selectedDates.length > 1 ? 's' : ''} selected`}
        </span>
        <Calendar className="date-picker-trigger-icon" />
      </button>

      {/* Selected dates chips */}
      {selectedDates.length > 0 && (
        <div className="date-picker-chips">
          {selectedDates.map((dateStr) => (
            <span key={dateStr} className="date-picker-chip">
              {formatDate(dateStr)}
              <button
                type="button"
                onClick={() => removeDate(dateStr)}
                className="date-picker-chip-remove"
              >
                <X className="date-picker-chip-remove-icon" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Dropdown calendar - rendered via Portal */}
      {isOpen && typeof document !== 'undefined' && createPortal(
        <div ref={dropdownRef} className="date-picker-dropdown" style={dropdownStyle}>
          {/* Header */}
          <div className="date-picker-header">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="date-picker-nav"
            >
              <ChevronLeft className="date-picker-nav-icon" />
            </button>
            <span className="date-picker-title">
              {MONTHS[viewDate.month]} {viewDate.year}
            </span>
            <button
              type="button"
              onClick={handleNextMonth}
              className="date-picker-nav"
            >
              <ChevronRight className="date-picker-nav-icon" />
            </button>
          </div>

          {/* Day headers */}
          <div className="date-picker-weekdays">
            {DAYS.map((day) => (
              <div key={day} className="date-picker-weekday">
                {day}
              </div>
            ))}
          </div>

          {/* Days grid */}
          <div className="date-picker-grid">
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
                  className={`date-picker-day ${selected ? 'date-picker-day-selected' : ''} ${today && !selected ? 'date-picker-day-today' : ''}`}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div className="date-picker-footer">
            <button
              type="button"
              onClick={() => onChange([])}
              className="date-picker-clear"
            >
              Clear all
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="date-picker-done"
            >
              Done
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
