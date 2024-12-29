import React from 'react';
import { Clock } from 'lucide-react';
import { useProfile } from '../../contexts/ProfileContext';

export function TimezoneSettings() {
  const { profile, updateProfile } = useProfile();
  const [selectedTimezone, setSelectedTimezone] = React.useState(profile.timezone);

  const timezones = Intl.supportedValuesOf('timeZone');

  const handleTimezoneChange = (timezone: string) => {
    setSelectedTimezone(timezone);
    updateProfile({ timezone });
  };

  return (
    <div className="card space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center">
          <Clock className="w-4 h-4 text-orange-500" />
        </div>
        <h2 className="text-lg font-semibold">Timezone Settings</h2>
      </div>

      <div>
        <label className="text-sm text-gray-400">Current Timezone</label>
        <select
          value={selectedTimezone}
          onChange={(e) => handleTimezoneChange(e.target.value)}
          className="w-full mt-2 bg-black/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] [&>option]:bg-[#2A2B2E]"
        >
          {timezones.map((timezone) => (
            <option key={timezone} value={timezone}>
              {timezone.replace(/_/g, ' ')}
            </option>
          ))}
        </select>
        <p className="mt-2 text-sm text-gray-400">
          Current time: {new Date().toLocaleTimeString('en-US', { timeZone: selectedTimezone })}
        </p>
      </div>
    </div>
  );
}