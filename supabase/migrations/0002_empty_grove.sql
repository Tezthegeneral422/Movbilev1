/*
  # Task Management Improvements

  1. New Tables
    - Task categories
    - Task tags (junction table)
    - Task collaborators
  2. Additional Task Fields
    - Recurrence
    - Deadline
    - Collaboration support
  3. Security
    - RLS policies for all tables
*/

-- Create task categories table
CREATE TABLE IF NOT EXISTS task_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  color text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create task tags junction table
CREATE TABLE IF NOT EXISTS task_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid REFERENCES tasks ON DELETE CASCADE NOT NULL,
  category_id uuid REFERENCES task_categories ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create task collaborators table
CREATE TABLE IF NOT EXISTS task_collaborators (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid REFERENCES tasks ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  role text NOT NULL CHECK (role IN ('viewer', 'editor', 'owner')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(task_id, user_id)
);

-- Add new columns to tasks table
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS recurrence jsonb;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS deadline timestamptz;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS reminder_before interval;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS owner_id uuid REFERENCES auth.users ON DELETE CASCADE;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS is_shared boolean DEFAULT false;

-- Enable RLS
ALTER TABLE task_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_collaborators ENABLE ROW LEVEL SECURITY;

-- Drop existing task policies if they exist
DROP POLICY IF EXISTS "Users can view own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can update own tasks" ON tasks;

-- Categories policies
CREATE POLICY "Users can view own categories"
  ON task_categories FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own categories"
  ON task_categories FOR ALL
  USING (auth.uid() = user_id);

-- Tags policies
CREATE POLICY "Users can view task tags"
  ON task_tags FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM tasks
      WHERE tasks.id = task_tags.task_id
      AND (
        tasks.user_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM task_collaborators
          WHERE task_collaborators.task_id = tasks.id
          AND task_collaborators.user_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Users can manage task tags"
  ON task_tags FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM tasks
      WHERE tasks.id = task_tags.task_id
      AND (
        tasks.user_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM task_collaborators
          WHERE task_collaborators.task_id = tasks.id
          AND task_collaborators.user_id = auth.uid()
          AND task_collaborators.role IN ('editor', 'owner')
        )
      )
    )
  );

-- Collaborators policies
CREATE POLICY "Users can view task collaborators"
  ON task_collaborators FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM tasks
      WHERE tasks.id = task_collaborators.task_id
      AND (
        tasks.user_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM task_collaborators tc2
          WHERE tc2.task_id = tasks.id
          AND tc2.user_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Users can manage task collaborators"
  ON task_collaborators FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM tasks
      WHERE tasks.id = task_collaborators.task_id
      AND tasks.user_id = auth.uid()
    )
  );

-- Create new task policies
CREATE POLICY "Users can view own and shared tasks"
  ON tasks FOR SELECT
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM task_collaborators
      WHERE task_collaborators.task_id = id
      AND task_collaborators.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own and editable tasks"
  ON tasks FOR UPDATE
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM task_collaborators
      WHERE task_collaborators.task_id = id
      AND task_collaborators.user_id = auth.uid()
      AND task_collaborators.role IN ('editor', 'owner')
    )
  );

-- Create triggers for updated_at
CREATE TRIGGER set_task_categories_updated_at
  BEFORE UPDATE ON task_categories
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();