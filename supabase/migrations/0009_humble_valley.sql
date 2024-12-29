/*
  # Fix Profile Creation Trigger
  
  1. Changes
    - Add error handling to profile creation trigger
    - Add missing columns to profile creation
    - Ensure profile creation is atomic
*/

-- Drop existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create improved function to handle profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
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
    theme,
    notifications,
    preferences,
    created_at,
    updated_at
  ) VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'timezone', 'UTC'),
    'dark',
    jsonb_build_object(
      'email', true,
      'push', true,
      'weekly', false
    ),
    jsonb_build_object(
      'calendar', jsonb_build_object(
        'defaultView', 'month',
        'startOfWeek', 'monday'
      ),
      'language', 'en'
    ),
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- Create new trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Ensure service role can create profiles
DROP POLICY IF EXISTS "Service role can create profiles" ON public.profiles;
CREATE POLICY "Service role can create profiles"
  ON public.profiles
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Add index for faster profile lookups
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(id);