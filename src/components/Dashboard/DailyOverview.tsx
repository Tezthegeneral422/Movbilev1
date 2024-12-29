import React from 'react';
import { Cloud, Sun, Briefcase, Home, Heart, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';
import { useProfile } from '../../contexts/ProfileContext';
import type { Task } from '../../types';

interface DailyOverviewProps {
  userName: string;
  weatherTemp?: number;
  tasks?: Task[];
}

export function DailyOverview({ userName, weatherTemp = 72, tasks = [] }: DailyOverviewProps) {
  const { user } = useAuthContext();
  const { profile } = useProfile();
  const displayName = user?.user_metadata?.name || profile.name || userName;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const formatDate = () => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  };

  const getOpenTaskCount = (role: 'work' | 'family' | 'personal') => {
    return tasks.filter(task => task.role === role && task.status === 'todo').length;
  };

  const taskCards = [
    { role: 'work', label: 'Work', icon: <Briefcase className="w-6 h-6" />, color: 'bg-[#2A2B2E]', textColor: 'text-white' },
    { role: 'family', label: 'Family', icon: <Home className="w-6 h-6" />, color: 'bg-[#c8e45c]', textColor: 'text-black' },
    { role: 'personal', label: 'Personal', icon: <Heart className="w-6 h-6" />, color: 'bg-[#4b65de]', textColor: 'text-white' },
  ] as const;
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <h1 className="text-xl font-bold text-white">
            {getGreeting()},{' '}
            <Link 
              to="/profile" 
              className="inline-flex items-center gap-1 text-[var(--accent-color)] hover:opacity-90 transition-opacity font-medium"
            >
              {displayName}
              <ChevronRight className="w-4 h-4" />
            </Link>
            ! Let's make today productive.
          </h1>
          <p className="text-sm text-gray-400">{formatDate()}</p>
        </div>
        <div className="flex items-center gap-2 text-gray-400 bg-[#2A2B2E] px-3 py-2 rounded-full">
          {weatherTemp > 75 ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Cloud className="w-5 h-5" />
          )}
          <span>{weatherTemp}°F</span>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        {taskCards.map(({ role, label, icon, color, textColor }) => (
          <div key={role} className={`${color} aspect-square flex flex-col items-center justify-center text-center rounded-3xl ${textColor}`}>
            <div className={`w-14 h-14 rounded-full bg-white/10 flex items-center justify-center mb-3`}>
              {icon}
            </div>
            <div>
              <p className="text-2xl font-semibold">{getOpenTaskCount(role)}</p>
              <p className="text-sm mt-1 opacity-80">{label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}