import React from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarHeaderProps {
  currentDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

export function CalendarHeader({ currentDate, onPrevMonth, onNextMonth }: CalendarHeaderProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold">Calendar</h1>
      <div className="flex items-center gap-2">
        <button 
          onClick={onPrevMonth}
          className="p-2 hover:bg-black/20 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-[var(--accent-color)]" />
          <span className="font-medium">{formatDate(currentDate)}</span>
        </div>
        <button 
          onClick={onNextMonth}
          className="p-2 hover:bg-black/20 rounded-lg transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}