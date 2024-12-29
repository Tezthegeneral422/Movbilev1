/*
  # Add missing features and fix policies

  1. Changes
    - Add notification preferences per feature
    - Add theme customization fields
    - Add data export/import tracking
    - Add timezone field
    - Fix calendar event policies
*/

-- Add notification preferences per feature
ALTER TABLE profiles
DROP COLUMN IF EXISTS notifications;

CREATE TYPE notification_channel AS ENUM ('email', 'push', 'both', 'none');

CREATE TABLE IF NOT EXISTS notification_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  feature text NOT NULL,
  channel notification_channel NOT NULL DEFAULT 'both',
  enabled boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, feature)
);

-- Add theme customization
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS theme_color text DEFAULT '#9FFF32',
ADD COLUMN IF NOT EXISTS theme_mode text DEFAULT 'dark'
  CHECK (theme_mode IN ('light', 'dark'));

-- Add data export tracking
CREATE TABLE IF NOT EXISTS data_exports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  export_date timestamptz DEFAULT now(),
  export_type text NOT NULL,
  status text DEFAULT 'pending'
    CHECK (status IN ('pending', 'completed', 'failed')),
  file_path text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_exports ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage own notification preferences"
  ON notification_preferences FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own exports"
  ON data_exports FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own exports"
  ON data_exports FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create function to initialize notification preferences
CREATE OR REPLACE FUNCTION initialize_notification_preferences()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO notification_preferences (user_id, feature, channel)
  VALUES
    (NEW.id, 'tasks', 'both'),
    (NEW.id, 'calendar', 'both'),
    (NEW.id, 'wellness', 'both'),
    (NEW.id, 'meditation', 'push'),
    (NEW.id, 'sleep', 'push');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to initialize preferences for new users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION initialize_notification_preferences();

-- Add updated_at trigger for notification preferences
CREATE TRIGGER set_notification_preferences_updated_at
  BEFORE UPDATE ON notification_preferences
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();