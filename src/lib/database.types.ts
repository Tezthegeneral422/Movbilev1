export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          name: string | null
          email: string | null
          avatar_url: string | null
          timezone: string | null
          theme: string
          notifications: Json
          preferences: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name?: string | null
          email?: string | null
          avatar_url?: string | null
          timezone?: string | null
          theme?: string
          notifications?: Json
          preferences?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string | null
          email?: string | null
          avatar_url?: string | null
          timezone?: string | null
          theme?: string
          notifications?: Json
          preferences?: Json
          created_at?: string
          updated_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          role: string
          priority: string
          status: string
          due_date: string | null
          is_overdue: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          role: string
          priority: string
          status: string
          due_date?: string | null
          is_overdue?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          role?: string
          priority?: string
          status?: string
          due_date?: string | null
          is_overdue?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      moods: {
        Row: {
          id: string
          user_id: string
          mood: string
          timestamp: string
        }
        Insert: {
          id?: string
          user_id: string
          mood: string
          timestamp?: string
        }
        Update: {
          id?: string
          user_id?: string
          mood?: string
          timestamp?: string
        }
      }
      wellness_goals: {
        Row: {
          id: string
          user_id: string
          text: string
          completed: boolean
          target: number
          current: number
          unit: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          text: string
          completed?: boolean
          target: number
          current?: number
          unit: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          text?: string
          completed?: boolean
          target?: number
          current?: number
          unit?: string
          created_at?: string
          updated_at?: string
        }
      }
      wellness_stats: {
        Row: {
          id: string
          user_id: string
          meditation: number
          exercise: number
          sleep: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          meditation?: number
          exercise?: number
          sleep?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          meditation?: number
          exercise?: number
          sleep?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}