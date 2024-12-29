/*
  # Fix Profile Schema and Initialization

  1. Changes
    - Drop and recreate profiles table with correct structure
    - Add proper indexes for performance
    - Update profile creation trigger
    - Add RLS policies

  2. Security
    - Enable RLS
    - Add policies for user access
*/

-- Recreate profiles table with correct structure
DROP TABLE IF EXISTS profiles CASCADE;

CREATE TABLE profiles (
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

-- Create updated profile handler
CREATE OR REPLACE FUNCTION handle_new_user()
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

-- Recreate trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_updated ON profiles(updated_at DESC);

-- Create function to handle profile updates
CREATE OR REPLACE FUNCTION handle_profile_update()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Create trigger for automatic updated_at
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION handle_profile_update();