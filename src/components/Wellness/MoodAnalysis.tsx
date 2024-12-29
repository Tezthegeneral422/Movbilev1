import React from 'react';
import { Brain, TrendingUp } from 'lucide-react';
import { useMood } from '../../contexts/MoodContext';

export function MoodAnalysis() {
  const { moods } = useMood();

  const getMoodScore = (mood: string) => {
    switch (mood) {
      case 'great': return 5;
      case 'good': return 4;
      case 'okay': return 3;
      case 'low': return 2;
      case 'bad': return 1;
      default: return 0;
    }
  };

  const getAverageMood = (days: number) => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);

    const recentMoods = moods.filter(m => new Date(m.timestamp) >= cutoff);
    if (recentMoods.length === 0) return 0;

    const sum = recentMoods.reduce((acc, curr) => acc + getMoodScore(curr.mood), 0);
    return sum / recentMoods.length;
  };

  const weeklyAverage = getAverageMood(7);
  const monthlyAverage = getAverageMood(30);
  const trend = weeklyAverage - monthlyAverage;

  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
          <Brain className="w-4 h-4 text-purple-500" />
        </div>
        <h2 className="text-lg font-semibold">Mood Analysis</h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-black/20 rounded-xl">
          <div className="text-sm text-gray-400 mb-1">Weekly Average</div>
          <div className="text-2xl font-semibold">{weeklyAverage.toFixed(1)}</div>
        </div>

        <div className="p-4 bg-black/20 rounded-xl">
          <div className="text-sm text-gray-400 mb-1">Monthly Average</div>
          <div className="text-2xl font-semibold">{monthlyAverage.toFixed(1)}</div>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <TrendingUp className={`w-4 h-4 ${
          trend > 0 ? 'text-green-500' : trend < 0 ? 'text-red-500' : 'text-gray-400'
        }`} />
        <span className="text-sm text-gray-400">
          {trend > 0 ? 'Improving' : trend < 0 ? 'Declining' : 'Stable'} mood trend
        </span>
      </div>
    </div>
  );
}