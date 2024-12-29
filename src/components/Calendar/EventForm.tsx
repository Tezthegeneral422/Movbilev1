import React, { useState } from 'react';
import { X, Users, Bell } from 'lucide-react';
import { CollaboratorSelector } from '../Tasks/CollaboratorSelector';
import type { CollaboratorRole } from '../../types';

interface EventFormProps {
  onSubmit: (event: {
    title: string;
    description: string;
    startTime: Date;
    endTime: Date;
    allDay: boolean;
    location?: string;
    color?: string;
    collaborators: Array<{ email: string; role: CollaboratorRole }>;
    reminders: Array<{ time: number; type: 'email' | 'push' | 'both' }>;
  }) => void;
  onClose: () => void;
}

export function EventForm({ onSubmit, onClose }: EventFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [allDay, setAllDay] = useState(false);
  const [location, setLocation] = useState('');
  const [color, setColor] = useState('#9FFF32');
  const [collaborators, setCollaborators] = useState<Array<{ email: string; role: CollaboratorRole }>>([]);
  const [reminders, setReminders] = useState<Array<{ time: number; type: 'email' | 'push' | 'both' }>>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      description,
      startTime,
      endTime,
      allDay,
      location,
      color,
      collaborators,
      reminders,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-[#2A2B2E] rounded-3xl p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Add Event</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-black/20 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Event title"
            className="w-full px-4 py-3 bg-black/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
            required
          />

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className="w-full px-4 py-3 bg-black/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] min-h-[80px] resize-none"
          />

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={allDay}
                onChange={(e) => setAllDay(e.target.checked)}
                className="rounded bg-black/20"
              />
              <span className="text-sm">All day</span>
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-400">Start</label>
              <input
                type={allDay ? 'date' : 'datetime-local'}
                value={startTime.toISOString().slice(0, allDay ? 10 : 16)}
                onChange={(e) => setStartTime(new Date(e.target.value))}
                className="w-full mt-1 px-4 py-2 bg-black/20 rounded-xl text-white"
                required
              />
            </div>
            <div>
              <label className="text-sm text-gray-400">End</label>
              <input
                type={allDay ? 'date' : 'datetime-local'}
                value={endTime.toISOString().slice(0, allDay ? 10 : 16)}
                onChange={(e) => setEndTime(new Date(e.target.value))}
                className="w-full mt-1 px-4 py-2 bg-black/20 rounded-xl text-white"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-400">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Add location"
              className="w-full mt-1 px-4 py-2 bg-black/20 rounded-xl text-white"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400">Color</label>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="block w-full h-10 mt-1 rounded-xl"
            />
          </div>

          <div className="flex gap-4">
            <CollaboratorSelector
              collaborators={collaborators}
              onAdd={(email, role) => setCollaborators([...collaborators, { email, role }])}
              onRemove={(email) => setCollaborators(collaborators.filter(c => c.email !== email))}
            />

            <button
              type="button"
              onClick={() => setReminders([...reminders, { time: 15, type: 'both' }])}
              className="flex items-center gap-2 px-4 py-2 bg-black/20 rounded-xl hover:bg-black/30 transition-colors"
            >
              <Bell className="w-4 h-4" />
              <span>Add reminder</span>
            </button>
          </div>

          {reminders.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm text-gray-400">Reminders</h4>
              {reminders.map((reminder, index) => (
                <div key={index} className="flex items-center gap-2">
                  <select
                    value={reminder.time}
                    onChange={(e) => {
                      const newReminders = [...reminders];
                      newReminders[index].time = Number(e.target.value);
                      setReminders(newReminders);
                    }}
                    className="bg-black/20 rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="5">5 minutes before</option>
                    <option value="15">15 minutes before</option>
                    <option value="30">30 minutes before</option>
                    <option value="60">1 hour before</option>
                  </select>
                  <select
                    value={reminder.type}
                    onChange={(e) => {
                      const newReminders = [...reminders];
                      newReminders[index].type = e.target.value as 'email' | 'push' | 'both';
                      setReminders(newReminders);
                    }}
                    className="bg-black/20 rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="email">Email</option>
                    <option value="push">Push</option>
                    <option value="both">Both</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => setReminders(reminders.filter((_, i) => i !== index))}
                    className="p-2 hover:bg-black/20 rounded-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-[var(--accent-color)] text-black rounded-xl py-3 font-medium hover:opacity-90 transition-opacity"
          >
            Add Event
          </button>
        </form>
      </div>
    </div>
  );
}