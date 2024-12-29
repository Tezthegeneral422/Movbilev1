import React from 'react';
import { RoleTabs } from './RoleTabs';
import { TaskList } from './TaskList';
import { DateSelector } from '../Tasks/DateSelector';
import { Plus } from 'lucide-react';
import type { Role, Task } from '../../types';

interface TaskSectionProps {
  tasks: Task[];
  activeRole: Role;
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  onRoleChange: (role: Role) => void;
  onTaskComplete: (taskId: string) => void;
  onAddClick: () => void;
}

export function TaskSection({
  tasks,
  activeRole,
  selectedDate,
  onDateChange,
  onRoleChange,
  onTaskComplete,
  onAddClick,
}: TaskSectionProps) {
  const filteredTasks = tasks.filter((task) => {
    if (!task.dueDate) return false;
    
    const taskDate = new Date(task.dueDate);
    return task.role === activeRole && 
           taskDate.getDate() === selectedDate.getDate() &&
           taskDate.getMonth() === selectedDate.getMonth() &&
           taskDate.getFullYear() === selectedDate.getFullYear();
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-semibold">Tasks</h2>
        <DateSelector
          selectedDate={selectedDate}
          onDateChange={onDateChange}
        />
        <button
          onClick={onAddClick}
          className="w-8 h-8 bg-[var(--accent-color)] rounded-full text-black hover:opacity-90 transition-opacity flex items-center justify-center"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <RoleTabs activeRole={activeRole} onRoleChange={onRoleChange} />

      {filteredTasks.length === 0 ? (
        <p className="text-gray-400 text-center py-8">
          No tasks yet. Add some using the plus button!
        </p>
      ) : (
        <TaskList tasks={filteredTasks} onTaskComplete={onTaskComplete} />
      )}
    </div>
  );
}