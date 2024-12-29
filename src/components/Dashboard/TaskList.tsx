import React from 'react';
import { CheckCircle2, Circle, AlertCircle } from 'lucide-react';
import type { Task, Priority } from '../../types';

interface TaskListProps {
  tasks: Task[];
  onTaskComplete: (taskId: string) => void;
}

const priorityColors: Record<Priority, string> = {
  high: 'bg-red-500',
  medium: 'bg-yellow-500',
  low: 'bg-green-500',
};

export function TaskList({ tasks, onTaskComplete }: TaskListProps) {
  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <div
          key={task.id}
          className={`card flex items-center gap-3 transition-all ${
            task.status === 'done' ? 'opacity-50' : ''
          }`}
        >
          <button
            onClick={() => onTaskComplete(task.id)}
            className="text-gray-400 hover:text-[var(--accent-color)]"
          >
            {task.status === 'done' ? (
              <CheckCircle2 className="w-6 h-6 text-[var(--accent-color)]" />
            ) : (
              <Circle className="w-6 h-6" />
            )}
          </button>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span
                className={`${
                  task.status === 'done' ? 'line-through' : ''
                } truncate`}
              >
                {task.title}
              </span>
              <div
                className={`w-2 h-2 rounded-full ${priorityColors[task.priority]}`}
              />
            </div>
            {task.description && (
              <p className="text-sm text-gray-400 truncate">
                {task.description}
              </p>
            )}
          </div>

          {task.isOverdue && !task.status && (
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          )}
        </div>
      ))}
    </div>
  );
}