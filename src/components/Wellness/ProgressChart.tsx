import React from 'react';
import { Activity } from 'lucide-react';

interface DataPoint {
  value: number;
  label: string;
}

interface ProgressChartProps {
  title: string;
  data: DataPoint[];
  color: string;
  unit: string;
}

export function ProgressChart({ title, data, color, unit }: ProgressChartProps) {
  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-6">
        <div className={`w-8 h-8 rounded-full bg-${color}/20 flex items-center justify-center`}>
          <Activity className={`w-4 h-4 text-${color}`} />
        </div>
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>

      <div className="h-40 flex items-end justify-between gap-2">
        {data.map((point, i) => (
          <div key={i} className="flex flex-col items-center gap-2 flex-1">
            <div className="w-full">
              <div
                className={`w-full bg-${color}/20 rounded-t-lg transition-all duration-500`}
                style={{ height: `${(point.value / maxValue) * 100}%` }}
              />
            </div>
            <span className="text-xs text-gray-400">{point.label}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 text-sm text-gray-400">
        Average: {(data.reduce((acc, curr) => acc + curr.value, 0) / data.length).toFixed(1)} {unit}
      </div>
    </div>
  );
}