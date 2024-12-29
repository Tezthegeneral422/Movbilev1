import React from 'react';

interface ProgressRingProps {
  progress: number;
  label: string;
  color: 'indigo' | 'pink' | 'purple';
}

export function ProgressRing({ progress, label, color }: ProgressRingProps) {
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;
  
  const colorClasses = {
    indigo: 'text-[var(--accent-color)] stroke-[var(--accent-color)]',
    pink: 'text-pink-500 stroke-pink-500',
    purple: 'text-purple-500 stroke-purple-500',
  };

  return (
    <div className="card flex flex-col items-center py-6">
      <div className="relative mb-2">
        <svg className="w-20 h-20 transform -rotate-90">
          <circle
            className="stroke-gray-700"
            strokeWidth="6"
            fill="transparent"
            r={radius}
            cx="40"
            cy="40"
          />
          <circle
            className={colorClasses[color]}
            strokeWidth="6"
            strokeLinecap="round"
            fill="transparent"
            r={radius}
            cx="40"
            cy="40"
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: offset,
              transition: 'stroke-dashoffset 0.5s',
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-sm font-semibold ${colorClasses[color]}`}>
            {progress}%
          </span>
        </div>
      </div>
      <span className="text-sm font-medium text-gray-400">{label}</span>
    </div>
  );
}