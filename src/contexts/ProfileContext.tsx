import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuthContext } from './AuthContext';
import { supabase } from '../lib/supabase';

export interface UserProfile {
  name: string;
  email: string;
  avatar_url: string | null;
  timezone: string;
  theme_mode: 'light' | 'dark';
  theme_color: string;
  preferences: {
    calendar: {
      defaultView: 'month' | 'week' | 'day';
      startOfWeek: 'monday' | 'sunday';
    };
    language: string;
  };
}

interface ProfileContextType {
  profile: UserProfile;
  loading: boolean;
  error: Error | null;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  updatePreference: <K extends keyof UserProfile['preferences']>(
    category: K,
    updates: Partial<UserProfile['preferences'][K]>
  ) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const defaultProfile: UserProfile = {
  name: 'User',
  email: '',
  avatar_url: null,
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  theme_mode: 'dark',
  theme_color: '#c8e45c',
  preferences: {
    calendar: {
      defaultView: 'month',
      startOfWeek: 'monday',
    },
    language: 'en',
  },
};

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const [profile, setProfile] = useState<UserProfile>(() => ({
    ...defaultProfile,
    name: user?.user_metadata?.name || defaultProfile.name,
    email: user?.email || defaultProfile.email
  }));

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (data) {
        setProfile({
          ...defaultProfile,
          ...data,
          name: data.name || user?.user_metadata?.name || defaultProfile.name,
          email: data.email || user?.email || defaultProfile.email,
        });
        return;
      }

      // If no profile exists, create one
      const { error: createError } = await supabase
        .from('profiles')
        .insert({
          id: user?.id,
          name: user?.user_metadata?.name || user?.email?.split('@')[0] || defaultProfile.name,
          email: user?.email,
          timezone: defaultProfile.timezone,
          theme: defaultProfile.theme,
          notifications: defaultProfile.notifications,
          preferences: defaultProfile.preferences,
        });

      if (createError) throw createError;

    } catch (err) {
      setError(err as Error);
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      setLoading(true);
      setError(null);

      const { error: updateError } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user?.id);

      if (updateError) throw updateError;
      setProfile(prev => ({ ...prev, ...updates }));
    } catch (err) {
      setError(err as Error);
      console.error('Error updating profile:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updatePreference = async <K extends keyof UserProfile['preferences']>(
    category: K,
    updates: Partial<UserProfile['preferences'][K]>
  ) => {
    const newPreferences = {
      ...profile.preferences,
      [category]: {
        ...profile.preferences[category],
        ...updates,
      },
    };
    
    await updateProfile({ preferences: newPreferences });
  };

  return (
    <ProfileContext.Provider value={{
      profile,
      loading,
      error,
      updateProfile,
      updatePreference,
    }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}