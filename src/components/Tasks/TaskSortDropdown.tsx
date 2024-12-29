import React from 'react';
import { ArrowUpDown } from 'lucide-react';

interface TaskSortDropdownProps {
  value: 'dueDate' | 'priority' | 'title';
  onChange: (value: 'dueDate' | 'priority' | 'title') => void;
}

export function TaskSortDropdown({ value, onChange }: TaskSortDropdownProps) {
  return (
    <div className="flex items-center gap-2">
      <ArrowUpDown className="w-4 h-4 text-gray-400" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as typeof value)}
        className="bg-transparent text-sm focus:outline-none"
      >
        <option value="dueDate">Due Date</option>
        <option value="priority">Priority</option>
        <option value="title">Title</option>
      </select>
    </div>
  );
}