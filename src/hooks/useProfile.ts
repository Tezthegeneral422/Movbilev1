import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthContext } from '../contexts/AuthContext';
import type { UserProfile } from '../contexts/ProfileContext';

export function useProfile() {
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (fetchError) {
        // If profile doesn't exist, create it
        if (fetchError.code === 'PGRST116') {
          const { error: createError } = await supabase
            .from('profiles')
            .insert({
              id: user?.id,
              name: user?.user_metadata?.name || user?.email?.split('@')[0] || 'User',
              email: user?.email,
              timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
              theme_mode: 'dark',
              theme_color: '#c8e45c',
              preferences: {
                calendar: {
                  defaultView: 'month',
                  startOfWeek: 'monday'
                },
                language: 'en'
              }
            })
            .select()
            .single();

          if (createError) throw createError;
          return fetchProfile();
        }
        throw fetchError;
      }

      if (data) {
        setProfile(data);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user?.id);

      if (error) throw error;

      setProfile(prev => prev ? { ...prev, ...updates } : null);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    profile,
    loading,
    error,
    updateProfile,
  };
}