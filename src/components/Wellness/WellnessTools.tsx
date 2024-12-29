import React from 'react';
import { Play, Brain, Activity, Heart, Timer } from 'lucide-react';

interface WellnessToolsProps {
  onMeditationStart: () => void;
}

export function WellnessTools({ onMeditationStart }: WellnessToolsProps) {
  const tools = [
    {
      icon: <Play className="w-6 h-6" />,
      title: 'Quick Meditation',
      description: '5-minute breathing exercise',
      color: 'bg-[var(--accent-color)]',
      onClick: onMeditationStart,
    },
    {
      icon: <Activity className="w-6 h-6" />,
      title: 'Desk Stretches',
      description: 'Simple exercises for work breaks',
      color: 'bg-blue-500',
      onClick: () => {},
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: 'Mindfulness',
      description: 'Guided mindfulness session',
      color: 'bg-purple-500',
      onClick: () => {},
    },
    {
      icon: <Timer className="w-6 h-6" />,
      title: 'Pomodoro Timer',
      description: '25-minute focus sessions',
      color: 'bg-pink-500',
      onClick: () => {},
    },
  ];

  return (
    <div className="card">
      <h2 className="text-lg font-semibold mb-4">Wellness Tools</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {tools.map((tool, index) => (
          <button
            key={index}
            onClick={tool.onClick}
            className="flex items-center gap-4 p-4 rounded-2xl bg-black/20 hover:bg-black/30 transition-colors text-left"
          >
            <div className={`w-12 h-12 rounded-full ${tool.color}/20 flex items-center justify-center text-${tool.color}`}>
              {tool.icon}
            </div>
            <div>
              <h3 className="font-medium">{tool.title}</h3>
              <p className="text-sm text-gray-400">{tool.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}