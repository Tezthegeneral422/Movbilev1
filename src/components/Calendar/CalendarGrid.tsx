import React, { useState } from 'react';
import { Task, CalendarEvent } from '../../types';
import { useMood } from '../../contexts/MoodContext';
import { useCalendar } from '../../hooks/useCalendar';
import { Plus, MoreHorizontal } from 'lucide-react';
import { EventForm } from './EventForm';

interface CalendarGridProps {
  currentDate: Date;
  tasks: Task[];
}

interface EventWithPosition {
  event: CalendarEvent;
  height: number;
  top: number;
  left: number;
  width: number;
}

export function CalendarGrid({ currentDate, tasks }: CalendarGridProps) {
  const { moods } = useMood();
  const { events, addEvent } = useCalendar();
  const [showEventForm, setShowEventForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    return { daysInMonth, startingDay };
  };

  const { daysInMonth, startingDay } = getDaysInMonth(currentDate);
  const today = new Date();

  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      return taskDate.getDate() === date.getDate() &&
             taskDate.getMonth() === date.getMonth() &&
             taskDate.getFullYear() === date.getFullYear();
    });
  };

  const getMoodForDate = (date: Date) => {
    const moodsForDay = moods.filter(m => {
      const moodDate = new Date(m.timestamp);
      return moodDate.getDate() === date.getDate() &&
             moodDate.getMonth() === date.getMonth() &&
             moodDate.getFullYear() === date.getFullYear();
    });
    return moodsForDay[moodsForDay.length - 1]?.mood;
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.startTime);
      return eventDate.getDate() === date.getDate() &&
             eventDate.getMonth() === date.getMonth() &&
             eventDate.getFullYear() === date.getFullYear();
    });
  };

  const calculateEventPosition = (event: CalendarEvent, dayEvents: CalendarEvent[]): EventWithPosition => {
    const overlappingEvents = dayEvents.filter(e => {
      const eventStart = new Date(event.startTime);
      const eventEnd = new Date(event.endTime);
      const eStart = new Date(e.startTime);
      const eEnd = new Date(e.endTime);
      return eventStart < eEnd && eventEnd > eStart;
    });

    const position = overlappingEvents.indexOf(event);
    const total = overlappingEvents.length;

    return {
      event,
      height: 24,
      top: position * 28 + 24,
      left: 0,
      width: 100 / total,
    };
  };

  const getMoodColor = (mood?: string) => {
    switch (mood) {
      case 'great': return 'bg-[var(--accent-color)]/20';
      case 'good': return 'bg-green-500/20';
      case 'okay': return 'bg-yellow-500/20';
      case 'low': return 'bg-red-500/20';
      case 'bad': return 'bg-red-700/20';
      default: return '';
    }
  };

  return (
    <div className="card">
      <div className="grid grid-cols-7 gap-px mb-4">
        {days.map((day) => (
          <div key={day} className="p-4 text-sm font-medium text-center">
            {day}
          </div>
        ))}
      </div>
      
      {showEventForm && (
        <EventForm
          onSubmit={async (eventData) => {
            if (selectedDate) {
              const startTime = new Date(selectedDate);
              startTime.setHours(new Date(eventData.startTime).getHours());
              startTime.setMinutes(new Date(eventData.startTime).getMinutes());
              
              const endTime = new Date(selectedDate);
              endTime.setHours(new Date(eventData.endTime).getHours());
              endTime.setMinutes(new Date(eventData.endTime).getMinutes());
              
              await addEvent({
                ...eventData,
                startTime,
                endTime,
              });
            }
            setShowEventForm(false);
            setSelectedDate(null);
          }}
          onClose={() => {
            setShowEventForm(false);
            setSelectedDate(null);
          }}
        />
      )}
      

      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: 42 }).map((_, index) => {
          const dayNumber = index - startingDay + 1;
          const isCurrentMonth = dayNumber > 0 && dayNumber <= daysInMonth;
          const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), dayNumber);
          const isToday = isCurrentMonth && 
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
          
          const tasksForDay = isCurrentMonth ? getTasksForDate(date) : [];
          const eventsForDay = isCurrentMonth ? getEventsForDate(date) : [];
          const mood = isCurrentMonth ? getMoodForDate(date) : undefined;
          const moodColor = getMoodColor(mood);

          return (
            <div
              key={index}
              onClick={() => {
                if (isCurrentMonth) {
                  setSelectedDate(date);
                  setShowEventForm(true);
                }
              }}
              className={`min-h-[100px] p-2 rounded-xl transition-colors ${
                isCurrentMonth 
                  ? `${moodColor || 'hover:bg-black/20'}` 
                  : 'opacity-25'
              } ${isToday ? 'ring-2 ring-[var(--accent-color)]' : ''} cursor-pointer relative`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium">{isCurrentMonth ? dayNumber : ''}</span>
                {mood && (
                  <div className={`w-2 h-2 rounded-full ${getMoodColor(mood)?.replace('/20', '')}`} />
                )}
              </div>
              
              {/* Events */}
              <div className="space-y-1 mt-2">
                {eventsForDay.slice(0, 3).map((event, i) => {
                  const position = calculateEventPosition(event, eventsForDay);
                  return (
                    <div
                      key={event.id}
                      className="text-xs p-1 rounded bg-[var(--accent-color)]/20 truncate"
                      style={{
                        position: 'absolute',
                        top: `${position.top}px`,
                        left: `${position.left}%`,
                        width: `${position.width}%`,
                        height: `${position.height}px`,
                        backgroundColor: event.color ? `${event.color}20` : undefined,
                      }}
                    >
                      {event.title}
                    </div>
                  );
                })}
                {eventsForDay.length > 3 && (
                  <div className="text-xs text-gray-400 pl-1 mt-20">
                    <MoreHorizontal className="w-4 h-4" />
                  </div>
                )}
              </div>

              {tasksForDay.length > 0 && (
                <div className="mt-1 space-y-1">
                  {tasksForDay.map((task) => (
                    <div
                      key={task.id}
                      className={`text-xs p-1.5 rounded ${
                        task.status === 'done' 
                          ? 'bg-green-500/20 line-through' 
                          : task.priority === 'high'
                          ? 'bg-red-500/20'
                          : 'bg-black/20'
                      } truncate`}
                      title={task.title}
                    >
                      {task.title}
                    </div>
                  ))}
                  {tasksForDay.length > 2 && (
                    <div className="text-xs text-gray-400 pl-1">
                      +{tasksForDay.length - 2} more
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex items-center gap-4 text-sm text-gray-400">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/20" />
          <span>High Priority</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500/20" />
          <span>Completed</span>
        </div>
      </div>
    </div>
  );
}