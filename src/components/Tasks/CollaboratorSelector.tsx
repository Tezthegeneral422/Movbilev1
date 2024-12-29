import React, { useState } from 'react';
import { Users, X, Check } from 'lucide-react';
import type { CollaboratorRole } from '../../types';

interface CollaboratorSelectorProps {
  collaborators: Array<{ email: string; role: CollaboratorRole }>;
  onAdd: (email: string, role: CollaboratorRole) => void;
  onRemove: (email: string) => void;
}

export function CollaboratorSelector({
  collaborators,
  onAdd,
  onRemove,
}: CollaboratorSelectorProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<CollaboratorRole>('viewer');

  const handleAdd = () => {
    if (email) {
      onAdd(email, role);
      setEmail('');
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-black/20 rounded-xl hover:bg-black/30 transition-colors"
      >
        <Users className="w-4 h-4" />
        <span>
          {collaborators.length
            ? `${collaborators.length} collaborator${collaborators.length === 1 ? '' : 's'}`
            : 'Add collaborators'}
        </span>
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 w-80 bg-[#2A2B2E] rounded-xl p-4 shadow-lg z-10">
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-400">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="colleague@example.com"
                className="w-full mt-1 bg-black/20 rounded-lg px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="text-sm text-gray-400">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as CollaboratorRole)}
                className="w-full mt-1 bg-black/20 rounded-lg px-3 py-2 text-sm [&>option]:bg-[#2A2B2E]"
              >
                <option value="viewer">Viewer</option>
                <option value="editor">Editor</option>
                <option value="owner">Owner</option>
              </select>
            </div>

            <button
              type="button"
              onClick={handleAdd}
              className="w-full bg-[var(--accent-color)] text-black rounded-xl py-2 text-sm font-medium"
            >
              Add Collaborator
            </button>
          </div>

          {collaborators.length > 0 && (
            <div className="mt-4 space-y-2">
              <h3 className="text-sm font-medium">Current collaborators</h3>
              {collaborators.map((collaborator) => (
                <div
                  key={collaborator.email}
                  className="flex items-center justify-between bg-black/20 rounded-lg px-3 py-2"
                >
                  <div>
                    <p className="text-sm">{collaborator.email}</p>
                    <p className="text-xs text-gray-400 capitalize">
                      {collaborator.role}
                    </p>
                  </div>
                  <button
                    onClick={() => onRemove(collaborator.email)}
                    type="button"
                    className="p-1 hover:bg-black/20 rounded-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}