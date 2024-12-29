import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import type { Activity } from '../../types';

interface ActivityCardProps {
  activity: Activity;
}

export function ActivityCard({ activity }: ActivityCardProps) {
  return (
    <div 
      className="rounded-3xl p-4 aspect-square relative"
      style={{ backgroundColor: activity.color }}
    >
      <div className="flex justify-between">
        <div className="flex -space-x-2">
          {activity.participants.map((participant, index) => (
            <img
              key={index}
              src={`https://images.unsplash.com/photo-${participant}?w=32&h=32&fit=crop`}
              alt={`Participant ${index + 1}`}
              className="w-8 h-8 rounded-full border-2 border-black object-cover"
            />
          ))}
        </div>
        <button className="w-8 h-8 rounded-full bg-black/20 flex items-center justify-center">
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>
      
      <div className="absolute bottom-4">
        <div className="text-xl font-semibold capitalize mb-1">
          {activity.type}
        </div>
        <div className="text-sm opacity-80">
          {activity.time}
        </div>
      </div>
    </div>
  );
}