/*
  # Fix Profile System

  1. Update Profile Schema
    - Simplify structure
    - Add required fields
    - Fix constraints
  
  2. Improve RLS Policies
    - Fix policy ordering
    - Add missing policies
    - Improve security
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Service role can create profiles" ON profiles;

-- Recreate profiles table with correct structure
CREATE TABLE IF NOT EXISTS profiles_new (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  name text NOT NULL,
  email text,
  avatar_url text,
  timezone text NOT NULL DEFAULT 'UTC',
  theme_mode text NOT NULL DEFAULT 'dark' CHECK (theme_mode IN ('light', 'dark')),
  theme_color text NOT NULL DEFAULT '#c8e45c',
  preferences jsonb NOT NULL DEFAULT '{
    "calendar": {
      "defaultView": "month",
      "startOfWeek": "monday"
    },
    "language": "en"
  }'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Migrate data if old table exists
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'profiles') THEN
    INSERT INTO profiles_new (id, name, email, avatar_url, timezone, theme_mode, theme_color, preferences, created_at, updated_at)
    SELECT id, name, email, avatar_url, timezone, 'dark', '#c8e45c', preferences, created_at, updated_at
    FROM profiles
    ON CONFLICT (id) DO NOTHING;
    
    DROP TABLE profiles;
  END IF;
END $$;

-- Rename new table to profiles
ALTER TABLE IF EXISTS profiles_new RENAME TO profiles;

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create improved policies
CREATE POLICY "Profiles are viewable by users who created them"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create function to handle profile updates
CREATE OR REPLACE FUNCTION handle_auth_user_created()
RETURNS trigger
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    name,
    email,
    timezone,
    theme_mode,
    theme_color,
    preferences
  ) VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'timezone', 'UTC'),
    'dark',
    '#c8e45c',
    jsonb_build_object(
      'calendar', jsonb_build_object(
        'defaultView', 'month',
        'startOfWeek', 'monday'
      ),
      'language', 'en'
    )
  )
  ON CONFLICT (id) DO UPDATE
  SET
    name = EXCLUDED.name,
    email = EXCLUDED.email,
    updated_at = now();
  
  RETURN NEW;
END;
$$;