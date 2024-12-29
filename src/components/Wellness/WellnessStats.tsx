import React from 'react';
import { TrendingUp, Edit2 } from 'lucide-react';
import { useWellness } from '../../contexts/WellnessContext';

export function WellnessStats() {
  const { stats, updateStats } = useWellness();
  const [editing, setEditing] = React.useState<keyof typeof stats | null>(null);

  const handleUpdate = (key: keyof typeof stats, value: string) => {
    const numValue = Number(value);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 100) {
      updateStats(key, numValue);
    }
    setEditing(null);
  };

  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-full bg-[var(--accent-color)]/20 flex items-center justify-center">
          <TrendingUp className="w-4 h-4 text-[var(--accent-color)]" />
        </div>
        <h2 className="text-lg font-semibold">Weekly Progress</h2>
      </div>

      <div className="space-y-4">
        {(Object.entries(stats) as [keyof typeof stats, number][]).map(([key, value]) => (
          <div key={key}>
            <div className="flex justify-between text-sm mb-2">
              <span className="capitalize">{key}</span>
              <div className="flex items-center gap-2">
                {editing === key ? (
                  <input
                    type="number"
                    min="0"
                    max="100"
                    defaultValue={value}
                    onBlur={(e) => handleUpdate(key, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleUpdate(key, e.currentTarget.value);
                      }
                    }}
                    className="w-16 bg-black/20 rounded-lg px-2 py-1 text-right"
                    autoFocus
                  />
                ) : (
                  <>
                    <span className="text-gray-400">{value}%</span>
                    <button
                      onClick={() => setEditing(key)}
                      className="p-1 hover:bg-black/20 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
            <div className="h-2 bg-black/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--accent-color)] rounded-full transition-all duration-500"
                style={{ width: `${value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}