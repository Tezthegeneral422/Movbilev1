import React from 'react';
import { Calendar, Clock } from 'lucide-react';
import type { TaskRecurrence } from '../../types';

interface RecurrenceSelectorProps {
  value: TaskRecurrence | undefined;
  onChange: (recurrence: TaskRecurrence | undefined) => void;
}

export function RecurrenceSelector({ value, onChange }: RecurrenceSelectorProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleFrequencyChange = (frequency: TaskRecurrence['frequency']) => {
    onChange({
      frequency,
      interval: 1,
      daysOfWeek: frequency === 'weekly' ? [1] : undefined,
    });
  };

  const handleIntervalChange = (interval: number) => {
    if (!value) return;
    onChange({ ...value, interval });
  };

  const handleDayToggle = (day: number) => {
    if (!value || value.frequency !== 'weekly') return;
    const daysOfWeek = value.daysOfWeek || [];
    const newDays = daysOfWeek.includes(day)
      ? daysOfWeek.filter(d => d !== day)
      : [...daysOfWeek, day];
    onChange({ ...value, daysOfWeek: newDays.sort() });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-black/20 rounded-xl hover:bg-black/30 transition-colors"
      >
        <Clock className="w-4 h-4" />
        <span>
          {value ? `Repeats ${value.frequency}` : 'Add recurrence'}
        </span>
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 w-64 bg-[#2A2B2E] rounded-xl p-4 shadow-lg z-10">
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-400">Frequency</label>
              <select
                value={value?.frequency || ''}
                onChange={(e) => handleFrequencyChange(e.target.value as TaskRecurrence['frequency'])}
                className="w-full mt-1 bg-black/20 rounded-lg px-3 py-2 text-sm [&>option]:bg-[#2A2B2E]"
              >
                <option value="">No repeat</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            {value && (
              <div>
                <label className="text-sm text-gray-400">Repeat every</label>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="number"
                    min="1"
                    value={value.interval}
                    onChange={(e) => handleIntervalChange(parseInt(e.target.value))}
                    className="w-20 bg-black/20 rounded-lg px-3 py-2 text-sm"
                  />
                  <span className="text-sm">
                    {value.frequency === 'daily' && 'days'}
                    {value.frequency === 'weekly' && 'weeks'}
                    {value.frequency === 'monthly' && 'months'}
                  </span>
                </div>
              </div>
            )}

            {value?.frequency === 'weekly' && (
              <div>
                <label className="text-sm text-gray-400">Repeat on</label>
                <div className="flex gap-1 mt-1">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                    <button
                      key={index}
                      onClick={() => handleDayToggle(index)}
                      className={`w-8 h-8 rounded-full text-sm ${
                        value.daysOfWeek?.includes(index)
                          ? 'bg-[var(--accent-color)] text-black'
                          : 'bg-black/20'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}