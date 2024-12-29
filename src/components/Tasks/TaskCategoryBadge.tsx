import React from 'react';
import type { TaskCategory } from '../../types';

interface TaskCategoryBadgeProps {
  category: TaskCategory;
}

export function TaskCategoryBadge({ category }: TaskCategoryBadgeProps) {
  return (
    <span
      className="inline-flex items-center px-2 py-1 rounded-full text-xs"
      style={{
        backgroundColor: `${category.color}20`,
        color: category.color,
      }}
    >
      {category.name}
    </span>
  );
}