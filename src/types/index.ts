export type Role = 'work' | 'family' | 'personal';
export type Priority = 'high' | 'medium' | 'low';
export type TaskStatus = 'todo' | 'in-progress' | 'done';
export type CollaboratorRole = 'viewer' | 'editor' | 'owner';

export interface TaskCategory {
  id: string;
  name: string;
  color: string;
}

export interface TaskRecurrence {
  frequency: 'daily' | 'weekly' | 'monthly';
  interval: number;
  endDate?: Date;
  daysOfWeek?: number[];
}

export interface TaskCollaborator {
  id: string;
  userId: string;
  role: CollaboratorRole;
  name: string;
  email: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  role: Role;
  priority: Priority;
  status: TaskStatus;
  dueDate?: Date;
  isOverdue?: boolean;
  deadline?: Date;
  reminderBefore?: number;
  recurrence?: TaskRecurrence;
  categories?: TaskCategory[];
  collaborators?: TaskCollaborator[];
  isShared?: boolean;
  ownerId?: string;
}

export interface Activity {
  type: 'running' | 'gym' | 'meditation' | 'yoga';
  time: string;
  participants: string[];
  color: string;
}