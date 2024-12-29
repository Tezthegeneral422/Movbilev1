import React, { useState } from 'react';
import { X, Clock } from 'lucide-react';
import type { Activity } from '../../types';

interface AddActivityModalProps {
  onClose: () => void;
  onAdd: (activity: Omit<Activity, 'color'>) => void;
}

export function AddActivityModal({ onClose, onAdd }: AddActivityModalProps) {
  const [type, setType] = useState<Activity['type']>('running');
  const [time, setTime] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!time) return;

    onAdd({
      type,
      time,
      participants: ['user1'], // Default to current user
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <div className="fixed inset-x-4 bottom-0 md:relative md:inset-auto md:max-w-md md:mx-auto md:mt-[20vh]">
        <div className="bg-[#2A2B2E] rounded-t-3xl md:rounded-3xl p-6 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Add Activity</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-black/20 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Activity Type</label>
              <div className="grid grid-cols-2 gap-3">
                {['running', 'gym', 'meditation', 'yoga'].map((activityType) => (
                  <button
                    key={activityType}
                    type="button"
                    onClick={() => setType(activityType as Activity['type'])}
                    className={`p-4 rounded-2xl capitalize text-left transition-colors ${
                      type === activityType
                        ? 'bg-[var(--accent-color)] text-black'
                        : 'bg-black/20 text-white hover:bg-black/30'
                    }`}
                  >
                    {activityType}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-400">Time</label>
              <div className="relative">
                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full bg-black/20 rounded-2xl px-12 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[var(--accent-color)] text-black rounded-2xl py-4 font-medium hover:bg-[var(--accent-color)]/90 transition-colors"
            >
              Add Activity
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}