/*
  # Initial Schema Setup

  1. New Tables
    - `profiles`
      - User profile information and preferences
    - `tasks`
      - User tasks and their metadata
    - `moods`
      - User mood tracking entries
    - `wellness_goals`
      - User wellness goals and progress
    - `wellness_stats`
      - User wellness statistics

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  name text,
  email text,
  avatar_url text,
  timezone text,
  theme text DEFAULT 'dark',
  notifications jsonb DEFAULT '{"email": true, "push": true, "weekly": false}'::jsonb,
  preferences jsonb DEFAULT '{"calendar": {"defaultView": "month", "startOfWeek": "monday"}, "language": "en"}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  role text NOT NULL,
  priority text NOT NULL,
  status text NOT NULL,
  due_date timestamptz,
  is_overdue boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create moods table
CREATE TABLE IF NOT EXISTS moods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  mood text NOT NULL,
  timestamp timestamptz DEFAULT now()
);

-- Create wellness_goals table
CREATE TABLE IF NOT EXISTS wellness_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  text text NOT NULL,
  completed boolean DEFAULT false,
  target integer NOT NULL,
  current integer DEFAULT 0,
  unit text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create wellness_stats table
CREATE TABLE IF NOT EXISTS wellness_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  meditation integer DEFAULT 0,
  exercise integer DEFAULT 0,
  sleep integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT unique_user_stats UNIQUE (user_id)
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE moods ENABLE ROW LEVEL SECURITY;
ALTER TABLE wellness_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE wellness_stats ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
-- Profiles
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Tasks
CREATE POLICY "Users can view own tasks"
  ON tasks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own tasks"
  ON tasks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tasks"
  ON tasks FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own tasks"
  ON tasks FOR DELETE
  USING (auth.uid() = user_id);

-- Moods
CREATE POLICY "Users can view own moods"
  ON moods FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own moods"
  ON moods FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Wellness Goals
CREATE POLICY "Users can view own wellness goals"
  ON wellness_goals FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own wellness goals"
  ON wellness_goals FOR ALL
  USING (auth.uid() = user_id);

-- Wellness Stats
CREATE POLICY "Users can view own wellness stats"
  ON wellness_stats FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own wellness stats"
  ON wellness_stats FOR ALL
  USING (auth.uid() = user_id);

-- Create function to handle profile updates
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER set_tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER set_wellness_goals_updated_at
  BEFORE UPDATE ON wellness_goals
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER set_wellness_stats_updated_at
  BEFORE UPDATE ON wellness_stats
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();