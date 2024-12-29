import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

interface DateSelectorProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export function DateSelector({ selectedDate, onDateChange }: DateSelectorProps) {
  const [showCalendar, setShowCalendar] = useState(false);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const handlePrevDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    onDateChange(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    onDateChange(newDate);
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <button
          onClick={handlePrevDay}
          className="p-2 hover:bg-black/20 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <button
          onClick={() => setShowCalendar(!showCalendar)}
          className="flex items-center gap-2 px-3 py-2 hover:bg-black/20 rounded-lg transition-colors"
        >
          <CalendarIcon className="w-5 h-5 text-[var(--accent-color)]" />
          <span className="font-medium">
            {isToday(selectedDate) ? 'Today' : formatDate(selectedDate)}
          </span>
        </button>

        <button
          onClick={handleNextDay}
          className="p-2 hover:bg-black/20 rounded-lg transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {showCalendar && (
        <div className="absolute top-full mt-2 left-0 bg-[#2A2B2E] rounded-xl p-4 shadow-lg z-10">
          <div className="w-64">
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                <div key={day} className="text-center text-sm text-gray-400">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: 35 }, (_, i) => {
                const date = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
                date.setDate(i - date.getDay() + 1);
                
                const isSelected = date.getDate() === selectedDate.getDate() &&
                                 date.getMonth() === selectedDate.getMonth();
                const isCurrentMonth = date.getMonth() === selectedDate.getMonth();
                
                return (
                  <button
                    key={i}
                    onClick={() => {
                      onDateChange(date);
                      setShowCalendar(false);
                    }}
                    className={`
                      h-8 rounded-lg text-sm flex items-center justify-center
                      ${isSelected ? 'bg-[var(--accent-color)] text-black' : 'hover:bg-black/20'}
                      ${!isCurrentMonth ? 'text-gray-600' : ''}
                    `}
                  >
                    {date.getDate()}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}