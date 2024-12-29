/*
  # Calendar Features Implementation

  1. New Tables
    - `calendar_events`
      - Core event information including title, description, start/end times
      - Support for recurring events via recurrence rules
      - Sharing and collaboration features
    - `event_attendees`
      - Tracks event participants and their response status
    - `event_reminders`
      - Configurable notifications for events

  2. Security
    - Enable RLS on all new tables
    - Policies for event access and management
    - Sharing permissions for collaborative events
*/

-- Create calendar events table
CREATE TABLE IF NOT EXISTS calendar_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  all_day boolean DEFAULT false,
  location text,
  recurrence_rule text, -- iCal RRULE format
  color text,
  is_shared boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create event attendees table
CREATE TABLE IF NOT EXISTS event_attendees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES calendar_events ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  status text NOT NULL CHECK (status IN ('pending', 'accepted', 'declined', 'tentative')),
  role text NOT NULL CHECK (role IN ('owner', 'editor', 'viewer')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(event_id, user_id)
);

-- Create event reminders table
CREATE TABLE IF NOT EXISTS event_reminders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES calendar_events ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  reminder_time timestamptz NOT NULL,
  reminder_type text NOT NULL CHECK (reminder_type IN ('email', 'push', 'both')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(event_id, user_id, reminder_time)
);

-- Enable RLS
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_reminders ENABLE ROW LEVEL SECURITY;

-- Calendar events policies
CREATE POLICY "Users can view own and shared events"
  ON calendar_events FOR SELECT
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM event_attendees
      WHERE event_attendees.event_id = id
      AND event_attendees.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage own events"
  ON calendar_events FOR ALL
  USING (user_id = auth.uid());

-- Event attendees policies
CREATE POLICY "Users can view event attendees"
  ON event_attendees FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM calendar_events
      WHERE calendar_events.id = event_id
      AND (
        calendar_events.user_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM event_attendees ea2
          WHERE ea2.event_id = calendar_events.id
          AND ea2.user_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Users can manage event attendees"
  ON event_attendees FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM calendar_events
      WHERE calendar_events.id = event_id
      AND calendar_events.user_id = auth.uid()
    )
  );

-- Event reminders policies
CREATE POLICY "Users can manage own reminders"
  ON event_reminders FOR ALL
  USING (user_id = auth.uid());

-- Create updated_at triggers
CREATE TRIGGER set_calendar_events_updated_at
  BEFORE UPDATE ON calendar_events
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();