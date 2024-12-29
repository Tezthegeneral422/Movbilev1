import React from 'react';
import { Smile, Meh, Frown } from 'lucide-react';
import { useMood } from '../../contexts/MoodContext';

export function MoodCheck() {
  const { addMood, getLatestMood } = useMood();
  const latestMood = getLatestMood()?.mood;

  return (
    <div className="card space-y-3">
      <h3 className="text-sm font-medium text-gray-400">How are you feeling today?</h3>
      <div className="flex justify-between">
        <button
          onClick={() => addMood('great')}
          className={`flex flex-col items-center gap-1 hover:opacity-80 transition-opacity ${
            latestMood === 'great' ? 'text-[var(--accent-color)]' : 'text-gray-400'
          }`}
        >
          <Smile className="w-8 h-8" />
          <span className="text-xs">Great</span>
        </button>
        <button
          onClick={() => addMood('okay')}
          className={`flex flex-col items-center gap-1 hover:opacity-80 transition-opacity ${
            latestMood === 'okay' ? 'text-yellow-500' : 'text-gray-400'
          }`}
        >
          <Meh className="w-8 h-8" />
          <span className="text-xs">Okay</span>
        </button>
        <button
          onClick={() => addMood('low')}
          className={`flex flex-col items-center gap-1 hover:opacity-80 transition-opacity ${
            latestMood === 'low' ? 'text-red-500' : 'text-gray-400'
          }`}
        >
          <Frown className="w-8 h-8" />
          <span className="text-xs">Low</span>
        </button>
        {latestMood && (
          <p className="text-sm text-gray-400 mt-2">
            Last mood: {latestMood}
          </p>
        )}
      </div>
    </div>
  );
}