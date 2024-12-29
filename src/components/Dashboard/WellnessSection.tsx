import React from 'react';
import { Play, Brain, Quote } from 'lucide-react';
import { useMood } from '../../contexts/MoodContext';

interface WellnessSectionProps {
  onMeditationStart: () => void;
}

const moodToHeight = {
  great: 90,
  good: 75,
  okay: 60,
  low: 40,
  bad: 20,
};

const quotes = [
  "Take care of your body. It's the only place you have to live.",
  "Self-care is not selfish. You cannot serve from an empty vessel.",
  "The greatest wealth is health.",
];

export function WellnessSection({ onMeditationStart }: WellnessSectionProps) {
  const { moods } = useMood();
  const [quote] = React.useState(() => 
    quotes[Math.floor(Math.random() * quotes.length)]
  );

  const lastSevenDays = React.useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const moodsForDay = moods.filter(m => {
        const moodDate = new Date(m.timestamp);
        return moodDate.getDate() === date.getDate() &&
               moodDate.getMonth() === date.getMonth() &&
               moodDate.getFullYear() === date.getFullYear();
      });
      
      const lastMoodForDay = moodsForDay[moodsForDay.length - 1];
      days.push({
        date,
        height: lastMoodForDay ? moodToHeight[lastMoodForDay.mood] : 0
      });
    }
    return days;
  }, [moods]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Meditation Quick Launch */}
      <button
        onClick={onMeditationStart}
        className="card flex items-center gap-4 hover:bg-[#2A2B2E]/80 transition-colors group"
      >
        <div className="w-12 h-12 rounded-full bg-[var(--accent-color)] flex items-center justify-center">
          <Play className="w-6 h-6 text-black" />
        </div>
        <div className="flex-1 text-left">
          <h3 className="font-medium mb-1">Quick Meditation</h3>
          <p className="text-sm text-gray-400">5-minute breathing exercise</p>
        </div>
      </button>

      {/* Daily Quote */}
      <div className="card flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
          <Quote className="w-6 h-6 text-purple-500" />
        </div>
        <p className="flex-1 text-sm text-gray-400 italic">"{quote}"</p>
      </div>

      {/* Mood Insights Card */}
      <div className="card md:col-span-2">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
            <Brain className="w-4 h-4 text-blue-500" />
          </div>
          <h3 className="font-medium">Mood Insights</h3>
        </div>
        
        <div className="h-32 flex items-end justify-between gap-2">
          {lastSevenDays.map((day, i) => (
            <div
              key={i}
              className={`rounded-t-lg w-full transition-all duration-300 ${
                day.height > 0 
                  ? 'bg-[var(--accent-color)]/20'
                  : 'bg-gray-600/20'
              }`}
              style={{ height: `${day.height}%` }}
            />
          ))}
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-400">
          {lastSevenDays.map((day, i) => (
            <span key={i}>
              {day.date.toLocaleDateString('en-US', { weekday: 'short' })}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}