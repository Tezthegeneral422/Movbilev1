/*
  # Fix Profile System Issues
  
  1. Improve Profile Structure
    - Fix column types and constraints
    - Add better defaults
    - Ensure data consistency
  
  2. Enhance RLS Policies
    - Fix policy ordering
    - Add missing policies
    - Improve security
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Profiles are viewable by users who created them" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- Recreate profiles table with improved structure
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
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Migrate data if old table exists
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'profiles') THEN
    INSERT INTO profiles_new (
      id, name, email, avatar_url, timezone, 
      theme_mode, theme_color, preferences, 
      created_at, updated_at
    )
    SELECT 
      id,
      COALESCE(name, 'User'),
      email,
      avatar_url,
      COALESCE(timezone, 'UTC'),
      'dark',
      '#c8e45c',
      COALESCE(preferences, '{
        "calendar": {
          "defaultView": "month",
          "startOfWeek": "monday"
        },
        "language": "en"
      }'::jsonb),
      COALESCE(created_at, now()),
      COALESCE(updated_at, now())
    FROM profiles
    ON CONFLICT (id) DO NOTHING;
    
    DROP TABLE profiles CASCADE;
  END IF;
END $$;

-- Rename new table to profiles
ALTER TABLE IF EXISTS profiles_new RENAME TO profiles;

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create improved policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create function to handle profile updates
CREATE OR REPLACE FUNCTION handle_profile_update()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER set_profile_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION handle_profile_update();

-- Create function to handle new user creation
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