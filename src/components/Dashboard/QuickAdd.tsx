import React, { useState } from 'react';
import { Plus, X, Users, Calendar } from 'lucide-react';
import type { Role } from '../../types';
import { CollaboratorSelector } from '../Tasks/CollaboratorSelector';
import type { CollaboratorRole } from '../../types';

interface QuickAddProps {
  onAdd: (task: {
    title: string;
    description: string;
    role: Role;
    dueDate: Date;
    collaborators?: Array<{ email: string; role: CollaboratorRole }>;
  }) => void;
  onClose: () => void;
  selectedDate: Date;
}

export function QuickAdd({ onAdd, onClose, selectedDate }: QuickAddProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [role, setRole] = useState<Role>('work');
  const [collaborators, setCollaborators] = useState<Array<{ email: string; role: CollaboratorRole }>>([]);
  const [dueDate, setDueDate] = useState(selectedDate);

  React.useEffect(() => {
    document.body.classList.add('modal-open');
    return () => document.body.classList.remove('modal-open');
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd({
        title,
        description,
        role,
        dueDate,
        collaborators: collaborators.length > 0 ? collaborators : undefined,
      });
      setCollaborators([]);
      setTitle('');
      setDescription('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-[#2A2B2E] rounded-3xl p-6 max-w-md w-full mx-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Add New Task</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-black/20 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              className="w-full px-4 py-3 bg-black/20 rounded-2xl mb-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
              autoFocus
            />

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a brief description (optional)"
              className="w-full px-4 py-3 bg-black/20 rounded-2xl mb-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] min-h-[80px] resize-none"
            />
            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-2">Due Date</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  value={dueDate.toISOString().split('T')[0]}
                  onChange={(e) => setDueDate(new Date(e.target.value))}
                  className="w-full pl-12 pr-4 py-3 bg-black/20 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
                />
              </div>
            </div>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
              className="w-full px-4 py-3 bg-black/20 rounded-2xl mb-4 text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] [&>option]:bg-[#2A2B2E]"
            >
              <option value="work">Work</option>
              <option value="family">Family</option>
              <option value="personal">Personal</option>
            </select>

            <div className="mb-4">
              <CollaboratorSelector
                collaborators={collaborators}
                onAdd={(email, role) => setCollaborators([...collaborators, { email, role }])}
                onRemove={(email) => setCollaborators(collaborators.filter(c => c.email !== email))}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[var(--accent-color)] text-black rounded-2xl py-4 font-medium hover:opacity-90 transition-opacity"
            >
              Add Task
            </button>
          </form>
      </div>
    </div>
  );
}