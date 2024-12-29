/*
  # Fix calendar event policies

  1. Changes
    - Fix infinite recursion in event attendees policy
    - Simplify policy logic for better performance
    - Add index for faster lookups
*/

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Users can view event attendees" ON event_attendees;

-- Create new optimized policy
CREATE POLICY "Users can view event attendees"
  ON event_attendees FOR SELECT
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM calendar_events
      WHERE calendar_events.id = event_attendees.event_id
      AND calendar_events.user_id = auth.uid()
    )
  );

-- Add index to improve performance
CREATE INDEX IF NOT EXISTS idx_event_attendees_event_user
  ON event_attendees (event_id, user_id);