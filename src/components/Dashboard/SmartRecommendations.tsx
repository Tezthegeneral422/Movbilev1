import React from 'react';
import { Lightbulb, Clock, Heart } from 'lucide-react';

const recommendations = [
  {
    icon: <Clock className="w-5 h-5" />,
    text: "Move 'Team Meeting' to tomorrow based on your schedule",
    type: 'schedule',
  },
  {
    icon: <Lightbulb className="w-5 h-5" />,
    text: 'Combine grocery shopping with school pickup for efficiency',
    type: 'efficiency',
  },
  {
    icon: <Heart className="w-5 h-5" />,
    text: "Time for a 5-minute stretch break - you've been sitting for a while!",
    type: 'wellness',
  },
];

export function SmartRecommendations() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4">Smart Recommendations</h2>
      <div className="space-y-3">
        {recommendations.map((rec, index) => (
          <div
            key={index}
            className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
          >
            <div className="text-indigo-600">{rec.icon}</div>
            <p className="text-sm text-gray-600">{rec.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}