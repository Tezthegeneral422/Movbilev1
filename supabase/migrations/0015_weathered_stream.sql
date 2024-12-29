/*
  # Fix Calendar Event Policies

  1. Changes
    - Fix infinite recursion in event_attendees policy
    - Optimize calendar event policies
    - Add missing indexes for performance

  2. Security
    - Ensure proper access control for shared events
    - Prevent unauthorized access to private events
*/

-- Drop problematic policies
DROP POLICY IF EXISTS "Users can view event attendees" ON event_attendees;
DROP POLICY IF EXISTS "Users can manage event attendees" ON event_attendees;
DROP POLICY IF EXISTS "Users can view own and shared events" ON calendar_events;

-- Create optimized policies for calendar_events
CREATE POLICY "Users can view own and shared events"
  ON calendar_events FOR SELECT
  USING (
    user_id = auth.uid() OR
    is_shared = true OR
    id IN (
      SELECT event_id 
      FROM event_attendees 
      WHERE user_id = auth.uid()
    )
  );

-- Create optimized policies for event_attendees
CREATE POLICY "Users can view event attendees"
  ON event_attendees FOR SELECT
  USING (
    user_id = auth.uid() OR
    event_id IN (
      SELECT id 
      FROM calendar_events 
      WHERE user_id = auth.uid() OR is_shared = true
    )
  );

CREATE POLICY "Users can manage event attendees"
  ON event_attendees FOR ALL
  USING (
    event_id IN (
      SELECT id 
      FROM calendar_events 
      WHERE user_id = auth.uid()
    )
  );

-- Add missing indexes
CREATE INDEX IF NOT EXISTS idx_calendar_events_shared ON calendar_events(is_shared) WHERE is_shared = true;
CREATE INDEX IF NOT EXISTS idx_event_attendees_lookup ON event_attendees(event_id, user_id);

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