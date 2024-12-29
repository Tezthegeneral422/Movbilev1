import React from 'react';
import { Brain } from 'lucide-react';
import type { MoodEntry } from '../../contexts/MoodContext';

interface MoodHistoryProps {
  moods: MoodEntry[];
}

const moodToEmoji = {
  great: '😊',
  good: '🙂',
  okay: '😐',
  low: '😔',
  bad: '😢',
};

export function MoodHistory({ moods }: MoodHistoryProps) {
  const recentMoods = moods.slice(-5).reverse();

  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
          <Brain className="w-4 h-4 text-blue-500" />
        </div>
        <h2 className="text-lg font-semibold">Recent Moods</h2>
      </div>

      <div className="space-y-3">
        {recentMoods.map((entry, index) => (
          <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-black/20">
            <span className="text-xl">{moodToEmoji[entry.mood]}</span>
            <div className="flex-1">
              <p className="capitalize">{entry.mood}</p>
              <p className="text-sm text-gray-400">
                {new Date(entry.timestamp).toLocaleString('en-US', {
                  weekday: 'long',
                  hour: 'numeric',
                  minute: 'numeric',
                })}
              </p>
            </div>
          </div>
        ))}
        {recentMoods.length === 0 && (
          <p className="text-center text-gray-400 py-4">
            No mood entries yet. How are you feeling today?
          </p>
        )}
      </div>
    </div>
  );
}