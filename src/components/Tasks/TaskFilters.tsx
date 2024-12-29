import React from 'react';
import { Filter, SortAsc, Tag } from 'lucide-react';
import type { Priority, TaskCategory } from '../../types';

interface TaskFiltersProps {
  categories: TaskCategory[];
  selectedCategories: string[];
  priorities: Priority[];
  selectedPriorities: Priority[];
  onCategoryChange: (categoryIds: string[]) => void;
  onPriorityChange: (priorities: Priority[]) => void;
  sortBy: 'dueDate' | 'priority' | 'title';
  onSortChange: (sort: 'dueDate' | 'priority' | 'title') => void;
}

export function TaskFilters({
  categories,
  selectedCategories,
  priorities,
  selectedPriorities,
  onCategoryChange,
  onPriorityChange,
  sortBy,
  onSortChange,
}: TaskFiltersProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-[#2A2B2E] rounded-xl hover:bg-black/20 transition-colors"
      >
        <Filter className="w-4 h-4" />
        <span>Filters</span>
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 w-64 bg-[#2A2B2E] rounded-xl p-4 shadow-lg z-10">
          <div className="space-y-4">
            {/* Categories */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Tag className="w-4 h-4" />
                <h3 className="font-medium">Categories</h3>
              </div>
              <div className="space-y-2">
                {categories.map((category) => (
                  <label key={category.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category.id)}
                      onChange={(e) => {
                        const newCategories = e.target.checked
                          ? [...selectedCategories, category.id]
                          : selectedCategories.filter(id => id !== category.id);
                        onCategoryChange(newCategories);
                      }}
                      className="rounded bg-black/20"
                    />
                    <span className="text-sm">{category.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Priorities */}
            <div>
              <h3 className="font-medium mb-2">Priority</h3>
              <div className="space-y-2">
                {priorities.map((priority) => (
                  <label key={priority} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedPriorities.includes(priority)}
                      onChange={(e) => {
                        const newPriorities = e.target.checked
                          ? [...selectedPriorities, priority]
                          : selectedPriorities.filter(p => p !== priority);
                        onPriorityChange(newPriorities);
                      }}
                      className="rounded bg-black/20"
                    />
                    <span className="text-sm capitalize">{priority}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <SortAsc className="w-4 h-4" />
                <h3 className="font-medium">Sort By</h3>
              </div>
              <select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value as typeof sortBy)}
                className="w-full bg-black/20 rounded-lg px-3 py-2 text-sm [&>option]:bg-[#2A2B2E]"
              >
                <option value="dueDate">Due Date</option>
                <option value="priority">Priority</option>
                <option value="title">Title</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}