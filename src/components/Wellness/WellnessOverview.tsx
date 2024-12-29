import React from 'react';
import { Activity, Brain, Heart } from 'lucide-react';
import { useMood } from '../../contexts/MoodContext';

export function WellnessOverview() {
  const { moods } = useMood();
  const latestMood = moods[moods.length - 1]?.mood;

  const stats = [
    {
      icon: <Activity className="w-6 h-6" />,
      label: 'Activity Score',
      value: '85%',
      color: 'bg-[var(--accent-color)]',
    },
    {
      icon: <Brain className="w-6 h-6" />,
      label: 'Mindfulness',
      value: '12 min',
      color: 'bg-purple-500',
    },
    {
      icon: <Heart className="w-6 h-6" />,
      label: 'Current Mood',
      value: latestMood ? latestMood.charAt(0).toUpperCase() + latestMood.slice(1) : 'Not set',
      color: 'bg-pink-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat, index) => (
        <div key={index} className="card flex items-center gap-4">
          <div className={`w-12 h-12 rounded-full ${stat.color}/20 flex items-center justify-center text-${stat.color}`}>
            {stat.icon}
          </div>
          <div>
            <p className="text-sm text-gray-400">{stat.label}</p>
            <p className="text-xl font-semibold">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}