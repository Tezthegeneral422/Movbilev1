import React from 'react';
import { Camera } from 'lucide-react';
import { useProfile } from '../../contexts/ProfileContext';
import { supabase } from '../../lib/supabase';
import { useAuthContext } from '../../contexts/AuthContext';

export function ProfileHeader() {
  const { profile, updateProfile } = useProfile();
  const { user } = useAuthContext();
  const [isEditing, setIsEditing] = React.useState(false);
  const [editName, setEditName] = React.useState(profile.name);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase.auth.updateUser({
        data: { name: editName }
      });

      if (error) throw error;

      // Update local profile state
      updateProfile({ name: editName });
    } catch (err) {
      console.error('Error updating profile:', err);
      // Revert to previous name on error
      setEditName(profile.name);
    }

    setIsEditing(false);
  };

  React.useEffect(() => {
    if (user?.user_metadata?.name) {
      setEditName(user.user_metadata.name);
    }
  }, [user]);

  return (
    <div className="flex items-center gap-6">
      <div className="relative group">
        <div className="w-24 h-24 rounded-full bg-[var(--accent-color)]/20 flex items-center justify-center">
          {profile.avatar ? (
            <img
              src={profile.avatar}
              alt={profile.name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span className="text-3xl font-medium text-[var(--accent-color)]">
              {profile.name.split(' ').map(n => n[0]).join('')}
            </span>
          )}
        </div>
        <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[var(--accent-color)] text-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <Camera className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1">
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-2">
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value.trim())}
              className="bg-black/20 rounded-xl px-4 py-2 text-xl font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
              autoFocus
              required
              minLength={2}
              maxLength={50}
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="text-sm text-[var(--accent-color)]"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setEditName(profile.name);
                }}
                className="text-sm text-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold">{profile.name}</h1>
              <button
                onClick={() => setIsEditing(true)}
                className="text-sm text-gray-400 hover:text-[var(--accent-color)]"
              >
                Edit
              </button>
            </div>
            <p className="text-gray-400">{profile.email}</p>
          </div>
        )}
      </div>
    </div>
  );
}