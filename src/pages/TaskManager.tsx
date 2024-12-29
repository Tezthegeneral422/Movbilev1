import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { RoleTabs } from '../components/Dashboard/RoleTabs';
import { Plus, Search, Tag } from 'lucide-react';
import { QuickAdd } from '../components/Dashboard/QuickAdd';
import { TaskFilters } from '../components/Tasks/TaskFilters';
import { TaskSortDropdown } from '../components/Tasks/TaskSortDropdown';
import type { Role, Task } from '../types';

export function TaskManager() {
  const [activeRole, setActiveRole] = useState<Role>('work');
  const [showAddTask, setShowAddTask] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPriorities, setSelectedPriorities] = useState<Priority[]>([]);
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'title'>('dueDate');
  
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Review Project Proposal',
      description: 'Review and provide feedback on the Q2 project proposal',
      role: 'work',
      priority: 'high',
      status: 'todo',
      dueDate: new Date(),
    },
    {
      id: '2',
      title: 'Team Sync',
      description: 'Weekly team sync meeting',
      role: 'work',
      priority: 'medium',
      status: 'in-progress',
      dueDate: new Date(),
    },
  ]);

  const filteredTasks = tasks.filter(task => {
    const matchesRole = task.role === activeRole;
    const matchesSearch = searchQuery === '' ||
      task.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategories = selectedCategories.length === 0 ||
      (task.categories && task.categories.some(cat => selectedCategories.includes(cat.id)));
    const matchesPriorities = selectedPriorities.length === 0 ||
      selectedPriorities.includes(task.priority);
    
    return matchesRole && matchesSearch && matchesCategories && matchesPriorities;
  });

  // Sort tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    switch (sortBy) {
      case 'dueDate':
        return (a.dueDate?.getTime() ?? 0) - (b.dueDate?.getTime() ?? 0);
      case 'priority': {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      case 'title':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });
  const tasksByStatus = {
    todo: sortedTasks.filter(t => t.status === 'todo'),
    'in-progress': sortedTasks.filter(t => t.status === 'in-progress'),
    done: sortedTasks.filter(t => t.status === 'done'),
  };

  return (
    <Layout>
      <div className="space-y-6 pb-20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-1">Task Manager</h1>
            <p className="text-gray-400">Manage and organize your tasks</p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#2A2B2E] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
              />
            </div>
            <TaskFilters
              categories={[]} // TODO: Add categories from context
              selectedCategories={selectedCategories}
              priorities={['high', 'medium', 'low']}
              selectedPriorities={selectedPriorities}
              onCategoryChange={setSelectedCategories}
              onPriorityChange={setSelectedPriorities}
              sortBy={sortBy}
              onSortChange={setSortBy}
            />
            <button
              onClick={() => setShowAddTask(true)}
              className="p-2 bg-[var(--accent-color)] rounded-xl text-black hover:opacity-90 transition-opacity"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        <RoleTabs activeRole={activeRole} onRoleChange={setActiveRole} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(['todo', 'in-progress', 'done'] as const).map((status) => (
            <div key={status} className="card">
              <h2 className="text-lg font-semibold mb-4 capitalize">
                {status.replace('-', ' ')}
                {tasksByStatus[status].length > 0 && (
                  <span className="ml-2 text-sm text-gray-400" key={`count-${status}`}>
                    ({tasksByStatus[status].length})
                  </span>
                )}
              </h2>
              <div className="space-y-3">
                {tasksByStatus[status].map((task) => (
                  <div
                    key={task.id}
                    className={`p-4 bg-black/20 rounded-xl border-l-4 ${
                      status === 'todo' ? 'border-yellow-500' :
                      status === 'in-progress' ? 'border-blue-500' :
                      'border-green-500'
                    }`}
                  >
                    <h3 className={`font-medium ${status === 'done' ? 'line-through' : ''}`}>
                      {task.title}
                    </h3>
                    {task.description && (
                      <p className={`text-sm text-gray-400 mt-1 ${status === 'done' ? 'line-through' : ''}`}>
                        {task.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {showAddTask && (
        <QuickAdd
          onAdd={(taskData) => {
            setTasks([...tasks, {
              id: Math.random().toString(),
              ...taskData,
              priority: 'medium',
              status: 'todo',
              dueDate: new Date(),
            }]);
            setShowAddTask(false);
          }}
          onClose={() => setShowAddTask(false)}
        />
      )}
    </Layout>
  );
}