import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { DailyOverview } from './components/Dashboard/DailyOverview';
import { TaskSection } from './components/Dashboard/TaskSection';
import { WellnessSection } from './components/Dashboard/WellnessSection';
import { MoodCheck } from './components/Dashboard/MoodCheck';
import { QuickAdd } from './components/Dashboard/QuickAdd';
import { MoodProvider } from './contexts/MoodContext';
import { AddActivityModal } from './components/Dashboard/AddActivityModal';
import { useAuthContext } from './contexts/AuthContext';
import type { Role, Task, Activity } from './types';

function App() {
  const { user } = useAuthContext();
  const [activeRole, setActiveRole] = useState<Role>('work');
  const [showAddTask, setShowAddTask] = useState(false);
  const [showMeditationModal, setShowMeditationModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Team Meeting',
      description: 'Weekly sync with the design team',
      role: 'work',
      priority: 'high',
      status: 'todo',
      dueDate: new Date(),
      isOverdue: true,
    },
    {
      id: '2',
      title: 'Grocery Shopping',
      role: 'family',
      priority: 'medium',
      status: 'todo',
      dueDate: new Date(),
    },
    {
      id: '3',
      title: 'Workout Session',
      role: 'personal',
      priority: 'low',
      status: 'done',
      dueDate: new Date(),
    },
  ]);
  
  const handleTaskComplete = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId
        ? { ...task, status: task.status === 'done' ? 'todo' : 'done' }
        : task
    ));
  };

  // Roll over incomplete tasks to the next day
  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    setTasks(prevTasks => 
      prevTasks.map(task => {
        if (!task.dueDate) {
          return { ...task, dueDate: today };
        }
        
        const taskDate = new Date(task.dueDate);
        taskDate.setHours(0, 0, 0, 0);
        
        if (taskDate < today && task.status !== 'done') {
          return { ...task, dueDate: today };
        }
        
        return task;
      })
    );
  }, []);
  const handleAddTask = () => {
    setShowAddTask(true);
  };

  const handleAddActivity = (newActivity: Omit<Activity, 'color'>) => {
    console.log('New activity:', newActivity);
    // Here you would typically save the activity to your backend
  };

  const handleMeditationStart = () => {
    setShowMeditationModal(true);
  };

  return (
    <MoodProvider>
    <Layout>
      <div className="space-y-8">
        <DailyOverview userName={user?.user_metadata?.name || 'User'} weatherTemp={75} tasks={tasks} />

        <TaskSection
          tasks={tasks}
          activeRole={activeRole}
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          onRoleChange={setActiveRole}
          onTaskComplete={handleTaskComplete}
          onAddClick={handleAddTask}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
          <MoodCheck />
          </div>
          <div className="md:col-span-2">
            <WellnessSection onMeditationStart={handleMeditationStart} />
          </div>
        </div>
      </div>
      
      {showAddTask && (
        <QuickAdd
          selectedDate={selectedDate}
          onAdd={(taskData) => {
            setTasks([...tasks, {
              id: Math.random().toString(),
              ...taskData,
              description: taskData.description || '',
              priority: 'medium',
              status: 'todo'
            }]);
            setShowAddTask(false);
          }}
          onClose={() => setShowAddTask(false)}
        />
      )}

      {showMeditationModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#2A2B2E] rounded-3xl p-8 max-w-md w-full mx-4">
            <h2 className="text-xl font-semibold mb-4">5-Minute Breathing Exercise</h2>
            <p className="text-gray-400 mb-6">
              Find a comfortable position and follow the breathing pattern:
              Inhale for 4 seconds, hold for 4 seconds, exhale for 4 seconds.
            </p>
            <button
              onClick={() => setShowMeditationModal(false)}
              className="w-full bg-[var(--accent-color)] text-black rounded-2xl py-4 font-medium hover:opacity-90 transition-opacity"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </Layout>
    </MoodProvider>
  );
}

export default App;