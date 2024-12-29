import React from 'react';
import { Calendar, Clock } from 'lucide-react';

interface DeadlineSelectorProps {
  date: Date | undefined;
  reminderBefore: number | undefined;
  onDateChange: (date: Date | undefined) => void;
  onReminderChange: (minutes: number | undefined) => void;
}

export function DeadlineSelector({
  date,
  reminderBefore,
  onDateChange,
  onReminderChange,
}: DeadlineSelectorProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const reminderOptions = [
    { value: 0, label: 'At time of deadline' },
    { value: 5, label: '5 minutes before' },
    { value: 15, label: '15 minutes before' },
    { value: 30, label: '30 minutes before' },
    { value: 60, label: '1 hour before' },
    { value: 1440, label: '1 day before' },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-black/20 rounded-xl hover:bg-black/30 transition-colors"
      >
        <Calendar className="w-4 h-4" />
        <span>{date ? formatDate(date) : 'Set deadline'}</span>
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 w-64 bg-[#2A2B2E] rounded-xl p-4 shadow-lg z-10">
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-400">Due date</label>
              <input
                type="date"
                value={date?.toISOString().split('T')[0] || ''}
                onChange={(e) => onDateChange(e.target.value ? new Date(e.target.value) : undefined)}
                className="w-full mt-1 bg-black/20 rounded-lg px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="text-sm text-gray-400">Due time</label>
              <input
                type="time"
                value={date?.toTimeString().slice(0, 5) || ''}
                onChange={(e) => {
                  if (!date) return;
                  const [hours, minutes] = e.target.value.split(':');
                  const newDate = new Date(date);
                  newDate.setHours(parseInt(hours), parseInt(minutes));
                  onDateChange(newDate);
                }}
                className="w-full mt-1 bg-black/20 rounded-lg px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="text-sm text-gray-400">Reminder</label>
              <select
                value={reminderBefore || 0}
                onChange={(e) => onReminderChange(parseInt(e.target.value))}
                className="w-full mt-1 bg-black/20 rounded-lg px-3 py-2 text-sm [&>option]:bg-[#2A2B2E]"
              >
                {reminderOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}