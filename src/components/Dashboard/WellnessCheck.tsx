import React from 'react';
import { Smile, Meh, Frown } from 'lucide-react';

interface WellnessCheckProps {
  onMoodSelect: (mood: 'great' | 'good' | 'okay' | 'low' | 'bad') => void;
}

export function WellnessCheck({ onMoodSelect }: WellnessCheckProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">How are you feeling?</h2>
      <div className="flex justify-around">
        <button
          onClick={() => onMoodSelect('great')}
          className="flex flex-col items-center gap-2 text-green-500 hover:text-green-600"
        >
          <Smile className="w-8 h-8" />
          <span>Great</span>
        </button>
        <button
          onClick={() => onMoodSelect('okay')}
          className="flex flex-col items-center gap-2 text-yellow-500 hover:text-yellow-600"
        >
          <Meh className="w-8 h-8" />
          <span>Okay</span>
        </button>
        <button
          onClick={() => onMoodSelect('low')}
          className="flex flex-col items-center gap-2 text-red-500 hover:text-red-600"
        >
          <Frown className="w-8 h-8" />
          <span>Low</span>
        </button>
      </div>
    </div>
  );
}