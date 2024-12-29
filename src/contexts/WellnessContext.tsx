import React, { createContext, useContext, useState } from 'react';

export interface WellnessGoal {
  id: string;
  text: string;
  completed: boolean;
  target: number;
  current: number;
  unit: string;
}

export interface WellnessStats {
  meditation: number;
  exercise: number;
  sleep: number;
}

interface WellnessContextType {
  goals: WellnessGoal[];
  stats: WellnessStats;
  addGoal: (goal: Omit<WellnessGoal, 'id'>) => void;
  updateGoal: (id: string, updates: Partial<WellnessGoal>) => void;
  deleteGoal: (id: string) => void;
  toggleGoal: (id: string) => void;
  updateStats: (key: keyof WellnessStats, value: number) => void;
}

const WellnessContext = createContext<WellnessContextType | undefined>(undefined);

export function WellnessProvider({ children }: { children: React.ReactNode }) {
  const [goals, setGoals] = useState<WellnessGoal[]>([
    {
      id: '1',
      text: 'Meditate daily',
      completed: false,
      target: 10,
      current: 5,
      unit: 'minutes'
    },
    {
      id: '2',
      text: 'Exercise',
      completed: false,
      target: 30,
      current: 15,
      unit: 'minutes'
    },
  ]);

  const [stats, setStats] = useState<WellnessStats>({
    meditation: 75,
    exercise: 60,
    sleep: 85
  });

  const addGoal = (goal: Omit<WellnessGoal, 'id'>) => {
    setGoals(prev => [...prev, { ...goal, id: Math.random().toString() }]);
  };

  const updateGoal = (id: string, updates: Partial<WellnessGoal>) => {
    setGoals(prev => prev.map(goal => 
      goal.id === id ? { ...goal, ...updates } : goal
    ));
  };

  const deleteGoal = (id: string) => {
    setGoals(prev => prev.filter(goal => goal.id !== id));
  };

  const toggleGoal = (id: string) => {
    setGoals(prev => prev.map(goal =>
      goal.id === id ? { ...goal, completed: !goal.completed } : goal
    ));
  };

  const updateStats = (key: keyof WellnessStats, value: number) => {
    setStats(prev => ({ ...prev, [key]: value }));
  };

  return (
    <WellnessContext.Provider value={{
      goals,
      stats,
      addGoal,
      updateGoal,
      deleteGoal,
      toggleGoal,
      updateStats,
    }}>
      {children}
    </WellnessContext.Provider>
  );
}

export function useWellness() {
  const context = useContext(WellnessContext);
  if (context === undefined) {
    throw new Error('useWellness must be used within a WellnessProvider');
  }
  return context;
}