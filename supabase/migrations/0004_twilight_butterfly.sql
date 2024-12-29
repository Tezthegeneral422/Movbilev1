/*
  # Add sleep tracking

  1. New Tables
    - `sleep_records`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `start_time` (timestamptz)
      - `end_time` (timestamptz)
      - `quality` (integer, 1-5)
      - `notes` (text)
      - `mood_on_wakeup` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `sleep_records` table
    - Add policies for users to manage their own sleep records
*/

CREATE TABLE IF NOT EXISTS sleep_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  quality integer CHECK (quality >= 1 AND quality <= 5),
  notes text,
  mood_on_wakeup text CHECK (mood_on_wakeup IN ('great', 'good', 'okay', 'low', 'bad')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE sleep_records ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own sleep records"
  ON sleep_records FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own sleep records"
  ON sleep_records FOR ALL
  USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER set_sleep_records_updated_at
  BEFORE UPDATE ON sleep_records
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();