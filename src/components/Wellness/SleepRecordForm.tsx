import React, { useState } from 'react';
import { X, Moon, Star } from 'lucide-react';

interface SleepRecordFormProps {
  onSubmit: (data: {
    startTime: Date;
    endTime: Date;
    quality: number;
    notes?: string;
    moodOnWakeup?: string;
  }) => void;
  onClose: () => void;
}

export function SleepRecordForm({ onSubmit, onClose }: SleepRecordFormProps) {
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [quality, setQuality] = useState(3);
  const [notes, setNotes] = useState('');
  const [moodOnWakeup, setMoodOnWakeup] = useState<string>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      startTime,
      endTime,
      quality,
      notes: notes || undefined,
      moodOnWakeup,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-[#2A2B2E] rounded-3xl p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">Add Sleep Record</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-black/20 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-400">Sleep Time</label>
              <input
                type="datetime-local"
                value={startTime.toISOString().slice(0, 16)}
                onChange={(e) => setStartTime(new Date(e.target.value))}
                className="w-full mt-1 px-4 py-2 bg-black/20 rounded-xl text-white"
                required
              />
            </div>
            <div>
              <label className="text-sm text-gray-400">Wake Time</label>
              <input
                type="datetime-local"
                value={endTime.toISOString().slice(0, 16)}
                onChange={(e) => setEndTime(new Date(e.target.value))}
                className="w-full mt-1 px-4 py-2 bg-black/20 rounded-xl text-white"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-400">Sleep Quality</label>
            <div className="flex items-center gap-2 mt-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setQuality(value)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    quality >= value ? 'text-yellow-500' : 'text-gray-600'
                  }`}
                >
                  <Star className="w-6 h-6" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-400">Mood on Wake</label>
            <select
              value={moodOnWakeup || ''}
              onChange={(e) => setMoodOnWakeup(e.target.value || undefined)}
              className="w-full mt-1 px-4 py-2 bg-black/20 rounded-xl text-white [&>option]:bg-[#2A2B2E]"
            >
              <option value="">Select mood</option>
              <option value="great">Great</option>
              <option value="good">Good</option>
              <option value="okay">Okay</option>
              <option value="low">Low</option>
              <option value="bad">Bad</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-400">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="How did you sleep?"
              className="w-full mt-1 px-4 py-2 bg-black/20 rounded-xl text-white min-h-[80px] resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[var(--accent-color)] text-black rounded-xl py-3 font-medium hover:opacity-90 transition-opacity"
          >
            Add Record
          </button>
        </form>
      </div>
    </div>
  );
}