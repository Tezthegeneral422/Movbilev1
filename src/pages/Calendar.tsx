import React from 'react';
import { Layout } from '../components/Layout';
import { CalendarHeader } from '../components/Calendar/CalendarHeader';
import { CalendarGrid } from '../components/Calendar/CalendarGrid';
import type { Task } from '../types';

export function Calendar() {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [tasks] = React.useState<Task[]>([
    {
      id: '1',
      title: 'Team Meeting',
      description: 'Weekly sync with the design team',
      role: 'work',
      priority: 'high',
      status: 'todo',
      dueDate: new Date(),
    },
    {
      id: '2',
      title: 'Grocery Shopping',
      description: 'Buy weekly groceries',
      role: 'family',
      priority: 'medium',
      status: 'todo',
      dueDate: new Date(Date.now() + 86400000), // Tomorrow
    },
  ]);

  const handlePrevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1));
  };

  return (
    <Layout>
      <div className="space-y-6">
        <CalendarHeader
          currentDate={currentDate}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
        />
        <CalendarGrid currentDate={currentDate} tasks={tasks} />
      </div>
    </Layout>
  );
}