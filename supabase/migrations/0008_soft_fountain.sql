/*
  # Add Profile Creation Trigger
  
  1. Changes
    - Add trigger to automatically create profile record on user signup
    - Add function to handle profile initialization
    - Add default values for profile settings
*/

-- Create function to handle profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    name,
    email,
    timezone,
    theme,
    notifications,
    preferences
  ) VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    COALESCE(new.raw_user_meta_data->>'timezone', 'UTC'),
    'dark',
    '{"email": true, "push": true, "weekly": false}'::jsonb,
    '{"calendar": {"defaultView": "month", "startOfWeek": "monday"}, "language": "en"}'::jsonb
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Add RLS policy for profile creation
CREATE POLICY "Service role can create profiles"
  ON public.profiles
  FOR INSERT
  TO service_role
  WITH CHECK (true);