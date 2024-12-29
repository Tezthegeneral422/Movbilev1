import React, { createContext, useContext, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Task, TaskCategory, TaskRecurrence, CollaboratorRole } from '../types';

interface TaskContextType {
  tasks: Task[];
  categories: TaskCategory[];
  loading: boolean;
  error: Error | null;
  addTask: (task: Omit<Task, 'id'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  addCategory: (category: Omit<TaskCategory, 'id'>) => Promise<void>;
  updateCategory: (id: string, updates: Partial<TaskCategory>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  addCollaborator: (taskId: string, email: string, role: CollaboratorRole) => Promise<void>;
  removeCollaborator: (taskId: string, userId: string) => Promise<void>;
  setTaskRecurrence: (taskId: string, recurrence: TaskRecurrence) => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<TaskCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch tasks and categories
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [tasksResponse, categoriesResponse] = await Promise.all([
        supabase
          .from('tasks')
          .select(`
            *,
            task_tags (
              task_categories (*)
            ),
            task_collaborators (
              profiles (*)
            )
          `),
        supabase
          .from('task_categories')
          .select('*')
      ]);

      if (tasksResponse.error) throw tasksResponse.error;
      if (categoriesResponse.error) throw categoriesResponse.error;

      setTasks(tasksResponse.data || []);
      setCategories(categoriesResponse.data || []);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initialize data
  React.useEffect(() => {
    fetchData();

    // Subscribe to realtime changes
    const tasksSubscription = supabase
      .channel('tasks_channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, fetchData)
      .subscribe();

    return () => {
      tasksSubscription.unsubscribe();
    };
  }, [fetchData]);

  const addTask = async (task: Omit<Task, 'id'>) => {
    const { error } = await supabase.from('tasks').insert(task);
    if (error) throw error;
    await fetchData();
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    const { error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id);
    if (error) throw error;
    await fetchData();
  };

  const deleteTask = async (id: string) => {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);
    if (error) throw error;
    await fetchData();
  };

  const addCategory = async (category: Omit<TaskCategory, 'id'>) => {
    const { error } = await supabase
      .from('task_categories')
      .insert(category);
    if (error) throw error;
    await fetchData();
  };

  const updateCategory = async (id: string, updates: Partial<TaskCategory>) => {
    const { error } = await supabase
      .from('task_categories')
      .update(updates)
      .eq('id', id);
    if (error) throw error;
    await fetchData();
  };

  const deleteCategory = async (id: string) => {
    const { error } = await supabase
      .from('task_categories')
      .delete()
      .eq('id', id);
    if (error) throw error;
    await fetchData();
  };

  const addCollaborator = async (taskId: string, email: string, role: CollaboratorRole) => {
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single();

    if (userError) throw userError;
    if (!userData) throw new Error('User not found');

    const { error } = await supabase
      .from('task_collaborators')
      .insert({
        task_id: taskId,
        user_id: userData.id,
        role
      });

    if (error) throw error;
    await fetchData();
  };

  const removeCollaborator = async (taskId: string, userId: string) => {
    const { error } = await supabase
      .from('task_collaborators')
      .delete()
      .match({ task_id: taskId, user_id: userId });

    if (error) throw error;
    await fetchData();
  };

  const setTaskRecurrence = async (taskId: string, recurrence: TaskRecurrence) => {
    const { error } = await supabase
      .from('tasks')
      .update({ recurrence })
      .eq('id', taskId);

    if (error) throw error;
    await fetchData();
  };

  return (
    <TaskContext.Provider value={{
      tasks,
      categories,
      loading,
      error,
      addTask,
      updateTask,
      deleteTask,
      addCategory,
      updateCategory,
      deleteCategory,
      addCollaborator,
      removeCollaborator,
      setTaskRecurrence,
    }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTask() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
}