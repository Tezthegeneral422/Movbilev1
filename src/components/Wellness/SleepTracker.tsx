import React, { useState } from 'react';
import { Moon, Plus, Star } from 'lucide-react';
import { useSleepTracking } from '../../hooks/useSleepTracking';

export function SleepTracker() {
  const { records, addRecord, getSleepStats } = useSleepTracking();
  const [showAddForm, setShowAddForm] = useState(false);
  const stats = getSleepStats(7);

  const formatDuration = (hours: number) => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  return (
    <div className="card space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
            <Moon className="w-4 h-4 text-blue-500" />
          </div>
          <h2 className="text-lg font-semibold">Sleep Tracking</h2>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="p-2 hover:bg-black/20 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-black/20 rounded-xl">
          <div className="text-sm text-gray-400 mb-1">Avg. Duration</div>
          <div className="text-xl font-semibold">
            {formatDuration(stats.averageDuration)}
          </div>
        </div>
        <div className="p-4 bg-black/20 rounded-xl">
          <div className="text-sm text-gray-400 mb-1">Avg. Quality</div>
          <div className="text-xl font-semibold flex items-center gap-1">
            {stats.averageQuality.toFixed(1)}
            <Star className="w-4 h-4 text-yellow-500" />
          </div>
        </div>
        <div className="p-4 bg-black/20 rounded-xl">
          <div className="text-sm text-gray-400 mb-1">Total Sleep</div>
          <div className="text-xl font-semibold">
            {formatDuration(stats.totalSleep)}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-400">Recent Records</h3>
        {records.slice(0, 5).map((record) => (
          <div key={record.id} className="p-4 bg-black/20 rounded-xl">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-medium">
                  {record.startTime.toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  })}
                </div>
                <div className="text-sm text-gray-400">
                  {record.startTime.toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                  {' → '}
                  {record.endTime.toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-sm">{record.quality}</span>
                <Star className="w-4 h-4 text-yellow-500" />
              </div>
            </div>
            {record.notes && (
              <p className="text-sm text-gray-400 mt-2">{record.notes}</p>
            )}
          </div>
        ))}
      </div>

      {showAddForm && (
        <SleepRecordForm
          onSubmit={async (data) => {
            await addRecord(data);
            setShowAddForm(false);
          }}
          onClose={() => setShowAddForm(false)}
        />
      )}
    </div>
  );
}