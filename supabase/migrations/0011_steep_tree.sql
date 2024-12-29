/*
  # Fix Profile System

  1. Update Policies
    - Add policy for service role to create profiles
    - Fix user policies for better security
  
  2. Add Trigger Function
    - Improve profile creation for new users
    - Handle metadata updates
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Service role can create profiles" ON profiles;

-- Create improved policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Service role can create profiles"
  ON profiles FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Improve profile handler function
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
    COALESCE(
      NEW.raw_user_meta_data->>'name',
      split_part(NEW.email, '@', 1)
    ),
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'timezone',
      'UTC'
    ),
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