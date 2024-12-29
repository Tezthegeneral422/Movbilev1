import React from 'react';
import { Briefcase, Home, Heart } from 'lucide-react';
import type { Role } from '../../types';

interface RoleTabsProps {
  activeRole: Role;
  onRoleChange: (role: Role) => void;
}

export function RoleTabs({ activeRole, onRoleChange }: RoleTabsProps) {
  const tabs: Array<{ role: Role; label: string; icon: React.ReactNode }> = [
    { role: 'work', label: 'Work', icon: <Briefcase className="w-4 h-4" /> },
    { role: 'family', label: 'Family', icon: <Home className="w-4 h-4" /> },
    { role: 'personal', label: 'Personal', icon: <Heart className="w-4 h-4" /> },
  ];

  return (
    <div className="flex space-x-2 p-1 overflow-x-auto -mx-4 md:mx-0 px-4 md:px-1">
      {tabs.map(({ role, label, icon }) => (
        <button
          key={role}
          onClick={() => onRoleChange(role)}
          className={`
            flex items-center space-x-2 rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors
            ${
              activeRole === role
                ? 'bg-[var(--accent-color)] text-black'
                : 'text-white hover:text-[var(--accent-color)]'
            }
          `}
        >
          {icon}
          <span className="text-xs">{label}</span>
        </button>
      ))}
    </div>
  );
}