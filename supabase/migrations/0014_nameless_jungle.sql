/*
  # Fix Calendar Event Policies

  1. Changes
    - Fix infinite recursion in event_attendees policy
    - Optimize calendar event policies
    - Add missing indexes for performance
    - Add proper cascading for event cleanup

  2. Security
    - Ensure proper access control for shared events
    - Prevent unauthorized access to private events
*/

-- Drop problematic policies
DROP POLICY IF EXISTS "Users can view event attendees" ON event_attendees;
DROP POLICY IF EXISTS "Users can manage event attendees" ON event_attendees;

-- Create optimized policies for event_attendees
CREATE POLICY "Users can view event attendees"
  ON event_attendees FOR SELECT
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM calendar_events ce
      WHERE ce.id = event_id
      AND (
        ce.user_id = auth.uid() OR
        ce.is_shared = true
      )
    )
  );

CREATE POLICY "Users can manage event attendees"
  ON event_attendees FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM calendar_events ce
      WHERE ce.id = event_id
      AND ce.user_id = auth.uid()
    )
  );

-- Add missing indexes
CREATE INDEX IF NOT EXISTS idx_calendar_events_user_id ON calendar_events(user_id);
CREATE INDEX IF NOT EXISTS idx_calendar_events_start_time ON calendar_events(start_time);
CREATE INDEX IF NOT EXISTS idx_event_attendees_composite ON event_attendees(event_id, user_id);

-- Add cascade delete for cleanup
ALTER TABLE event_attendees
  DROP CONSTRAINT IF EXISTS event_attendees_event_id_fkey,
  ADD CONSTRAINT event_attendees_event_id_fkey
    FOREIGN KEY (event_id)
    REFERENCES calendar_events(id)
    ON DELETE CASCADE;

ALTER TABLE event_reminders
  DROP CONSTRAINT IF EXISTS event_reminders_event_id_fkey,
  ADD CONSTRAINT event_reminders_event_id_fkey
    FOREIGN KEY (event_id)
    REFERENCES calendar_events(id)
    ON DELETE CASCADE;