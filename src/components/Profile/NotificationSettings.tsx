import React from 'react';
import { Bell } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export function NotificationSettings() {
  const [notifications, setNotifications] = React.useState({
    email: true,
    push: true,
    weekly: false
  });

  const updateNotification = async (key: keyof typeof notifications, enabled: boolean) => {
    try {
      const { data } = await supabase
        .from('notification_preferences')
        .upsert({
          feature: key,
          channel: enabled ? 'both' : 'none',
          enabled
        });

      setNotifications(prev => ({
        ...prev,
        [key]: enabled
      }));
    } catch (error) {
      console.error('Error updating notification:', error);
    }
  };

  return (
    <div className="card space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
          <Bell className="w-4 h-4 text-purple-500" />
        </div>
        <h2 className="text-lg font-semibold">Notifications</h2>
      </div>

      <div className="space-y-4">
        {Object.entries(notifications).map(([key, enabled]) => (
          <div key={key} className="flex items-center justify-between">
            <div>
              <p className="font-medium capitalize">{key} Notifications</p>
              <p className="text-sm text-gray-400">
                Receive {key} notifications about your activities
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={enabled}
                onChange={(e) => updateNotification(key as keyof typeof profile.notifications, e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-black/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--accent-color)]"></div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}