import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  allDay: boolean;
  location?: string;
  color?: string;
  isShared: boolean;
}

export function useCalendar() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchEvents();
    
    const subscription = supabase
      .channel('calendar_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'calendar_events' 
      }, fetchEvents)
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('calendar_events')
        .select(`
          *,
          event_attendees (
            user_id,
            status,
            role
          ),
          event_reminders (
            reminder_time,
            reminder_type
          )
        `);

      if (error) throw error;

      setEvents(data?.map(event => ({
        ...event,
        startTime: new Date(event.start_time),
        endTime: new Date(event.end_time),
      })) || []);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const addEvent = async (event: Omit<CalendarEvent, 'id' | 'isShared'>) => {
    const { error } = await supabase
      .from('calendar_events')
      .insert({
        title: event.title,
        description: event.description,
        start_time: event.startTime.toISOString(),
        end_time: event.endTime.toISOString(),
        all_day: event.allDay,
        location: event.location,
        color: event.color,
      });

    if (error) throw error;
    await fetchEvents();
  };

  const updateEvent = async (id: string, updates: Partial<CalendarEvent>) => {
    const { error } = await supabase
      .from('calendar_events')
      .update({
        title: updates.title,
        description: updates.description,
        start_time: updates.startTime?.toISOString(),
        end_time: updates.endTime?.toISOString(),
        all_day: updates.allDay,
        location: updates.location,
        color: updates.color,
      })
      .eq('id', id);

    if (error) throw error;
    await fetchEvents();
  };

  const deleteEvent = async (id: string) => {
    const { error } = await supabase
      .from('calendar_events')
      .delete()
      .eq('id', id);

    if (error) throw error;
    await fetchEvents();
  };

  return {
    events,
    loading,
    error,
    addEvent,
    updateEvent,
    deleteEvent,
  };
}