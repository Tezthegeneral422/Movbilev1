import React from 'react';
import { Settings } from 'lucide-react';
import { useProfile } from '../../contexts/ProfileContext';

export function PreferenceSettings() {
  const { profile, updatePreference } = useProfile();

  return (
    <div className="card space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
          <Settings className="w-4 h-4 text-blue-500" />
        </div>
        <h2 className="text-lg font-semibold">Preferences</h2>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="font-medium mb-4">Calendar Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-400">Default View</label>
              <select
                value={profile.preferences.calendar.defaultView}
                onChange={(e) => updatePreference('calendar', {
                  defaultView: e.target.value as 'month' | 'week' | 'day'
                })}
                className="w-full mt-1 bg-black/20 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] [&>option]:bg-[#2A2B2E] text-white"
              >
                <option value="month">Month</option>
                <option value="week">Week</option>
                <option value="day">Day</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-400">Start of Week</label>
              <select
                value={profile.preferences.calendar.startOfWeek}
                onChange={(e) => updatePreference('calendar', {
                  startOfWeek: e.target.value as 'monday' | 'sunday'
                })}
                className="w-full mt-1 bg-black/20 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] [&>option]:bg-[#2A2B2E] text-white"
              >
                <option value="monday">Monday</option>
                <option value="sunday">Sunday</option>
              </select>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-4">Language & Region</h3>
          <div>
            <label className="text-sm text-gray-400">Language</label>
            <select
              value={profile.preferences.language}
              onChange={(e) => updatePreference('language', e.target.value)}
              className="w-full mt-1 bg-black/20 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] [&>option]:bg-[#2A2B2E] text-white"
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}