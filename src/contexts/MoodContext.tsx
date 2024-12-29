import React, { createContext, useContext, useState } from 'react';

type Mood = 'great' | 'good' | 'okay' | 'low' | 'bad';

interface MoodEntry {
  mood: Mood;
  timestamp: Date;
}

interface MoodContextType {
  moods: MoodEntry[];
  addMood: (mood: Mood) => void;
  getLatestMood: () => MoodEntry | undefined;
}

const MoodContext = createContext<MoodContextType | undefined>(undefined);

export function MoodProvider({ children }: { children: React.ReactNode }) {
  const [moods, setMoods] = useState<MoodEntry[]>([]);

  const addMood = (mood: Mood) => {
    setMoods(prev => [...prev, { mood, timestamp: new Date() }]);
  };

  const getLatestMood = () => {
    return moods[moods.length - 1];
  };

  return (
    <MoodContext.Provider value={{ moods, addMood, getLatestMood }}>
      {children}
    </MoodContext.Provider>
  );
}

export function useMood() {
  const context = useContext(MoodContext);
  if (context === undefined) {
    throw new Error('useMood must be used within a MoodProvider');
  }
  return context;
}