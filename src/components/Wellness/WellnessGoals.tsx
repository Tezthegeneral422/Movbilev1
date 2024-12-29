import React from 'react';
import { Target, Check, Plus, X, Edit2 } from 'lucide-react';
import { useWellness, type WellnessGoal } from '../../contexts/WellnessContext';

export function WellnessGoals() {
  const { goals, toggleGoal, addGoal, deleteGoal, updateGoal } = useWellness();
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [editingGoal, setEditingGoal] = React.useState<WellnessGoal | null>(null);

  const handleAddGoal = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    addGoal({
      text: formData.get('text') as string,
      completed: false,
      target: Number(formData.get('target')),
      current: 0,
      unit: formData.get('unit') as string,
    });
    
    setShowAddModal(false);
  };

  const handleUpdateGoal = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingGoal) return;

    const formData = new FormData(e.currentTarget);
    updateGoal(editingGoal.id, {
      text: formData.get('text') as string,
      target: Number(formData.get('target')),
      unit: formData.get('unit') as string,
    });
    
    setEditingGoal(null);
  };

  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
          <Target className="w-4 h-4 text-purple-500" />
        </div>
        <h2 className="text-lg font-semibold flex-1">Daily Goals</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="p-2 hover:bg-black/20 rounded-xl transition-colors"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-3">
        {goals.map((goal, index) => (
          <div
            key={goal.id}
            className={`flex items-center gap-3 p-3 rounded-xl ${
              goal.completed ? 'bg-[var(--accent-color)]/10' : 'bg-black/20'
            }`}
          >
            <button
              onClick={() => toggleGoal(goal.id)}
              className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                goal.completed
                  ? 'bg-[var(--accent-color)] text-black'
                  : 'bg-black/20'
              }`}
            >
              {goal.completed && <Check className="w-4 h-4" />}
            </button>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className={goal.completed ? 'line-through' : ''}>
                  {goal.text}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditingGoal(goal)}
                    className="p-1 hover:bg-black/20 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteGoal(goal.id)}
                    className="p-1 hover:bg-black/20 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="text-sm text-gray-400">
                Progress: {goal.current}/{goal.target} {goal.unit}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Add Goal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#2A2B2E] rounded-3xl p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Add New Goal</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-black/20 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddGoal} className="space-y-4">
              <div>
                <label className="text-sm text-gray-400">Goal Description</label>
                <input
                  name="text"
                  type="text"
                  required
                  className="w-full px-4 py-3 bg-black/20 rounded-xl mt-1 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400">Target</label>
                  <input
                    name="target"
                    type="number"
                    required
                    min="1"
                    className="w-full px-4 py-3 bg-black/20 rounded-xl mt-1 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400">Unit</label>
                  <input
                    name="unit"
                    type="text"
                    required
                    placeholder="minutes, hours, etc."
                    className="w-full px-4 py-3 bg-black/20 rounded-xl mt-1 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-[var(--accent-color)] text-black rounded-xl py-3 font-medium hover:opacity-90 transition-opacity"
              >
                Add Goal
              </button>
            </form>
          </div>
        </div>
      )}
      
      {/* Edit Goal Modal */}
      {editingGoal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#2A2B2E] rounded-3xl p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Edit Goal</h3>
              <button
                onClick={() => setEditingGoal(null)}
                className="p-2 hover:bg-black/20 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleUpdateGoal} className="space-y-4">
              <div>
                <label className="text-sm text-gray-400">Goal Description</label>
                <input
                  name="text"
                  type="text"
                  required
                  defaultValue={editingGoal.text}
                  className="w-full px-4 py-3 bg-black/20 rounded-xl mt-1 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400">Target</label>
                  <input
                    name="target"
                    type="number"
                    required
                    min="1"
                    defaultValue={editingGoal.target}
                    className="w-full px-4 py-3 bg-black/20 rounded-xl mt-1 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400">Unit</label>
                  <input
                    name="unit"
                    type="text"
                    required
                    defaultValue={editingGoal.unit}
                    className="w-full px-4 py-3 bg-black/20 rounded-xl mt-1 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-[var(--accent-color)] text-black rounded-xl py-3 font-medium hover:opacity-90 transition-opacity"
              >
                Update Goal
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}