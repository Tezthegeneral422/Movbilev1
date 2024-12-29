import React from 'react';

interface FilterTabsProps {
  active: 'all' | 'alone' | 'withFriends';
  onChange: (filter: 'all' | 'alone' | 'withFriends') => void;
}

export function FilterTabs({ active, onChange }: FilterTabsProps) {
  return (
    <div className="flex gap-2 p-1 bg-[#2A2B2E] rounded-full w-fit">
      <button
        onClick={() => onChange('all')}
        className={`px-4 py-2 rounded-full text-sm transition-colors ${
          active === 'all' 
            ? 'bg-[var(--accent-color)] text-black' 
            : 'text-white hover:text-[var(--accent-color)]'
        }`}
      >
        All
      </button>
      <button
        onClick={() => onChange('alone')}
        className={`px-4 py-2 rounded-full text-sm transition-colors ${
          active === 'alone'
            ? 'bg-[var(--accent-color)] text-black'
            : 'text-white hover:text-[var(--accent-color)]'
        }`}
      >
        Alone
      </button>
      <button
        onClick={() => onChange('withFriends')}
        className={`px-4 py-2 rounded-full text-sm transition-colors ${
          active === 'withFriends'
            ? 'bg-[var(--accent-color)] text-black'
            : 'text-white hover:text-[var(--accent-color)]'
        }`}
      >
        With Friends
      </button>
    </div>
  );
}