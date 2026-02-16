export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          display_name: string | null
          avatar_url: string | null
          created_at: string
        }
        Insert: {
          id: string
          username: string
          display_name?: string | null
          avatar_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          username?: string
          display_name?: string | null
          avatar_url?: string | null
          created_at?: string
        }
        Relationships: []
      }
      muscle_groups: {
        Row: {
          id: string
          name: string
          slug: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      exercises: {
        Row: {
          id: string
          name: string
          slug: string
          description: string
          difficulty: number
          muscle_group_id: string
          secondary_muscles: string[]
          instructions: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description: string
          difficulty: number
          muscle_group_id: string
          secondary_muscles?: string[]
          instructions: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string
          difficulty?: number
          muscle_group_id?: string
          secondary_muscles?: string[]
          instructions?: string
        }
        Relationships: [
          {
            foreignKeyName: "exercises_muscle_group_id_fkey"
            columns: ["muscle_group_id"]
            isOneToOne: false
            referencedRelation: "muscle_groups"
            referencedColumns: ["id"]
          }
        ]
      }
      weekly_goals: {
        Row: {
          id: string
          user_id: string
          exercise_id: string
          week_start: string
          target_reps: number
        }
        Insert: {
          id?: string
          user_id: string
          exercise_id: string
          week_start: string
          target_reps: number
        }
        Update: {
          id?: string
          user_id?: string
          exercise_id?: string
          week_start?: string
          target_reps?: number
        }
        Relationships: [
          {
            foreignKeyName: "weekly_goals_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "weekly_goals_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      daily_logs: {
        Row: {
          id: string
          user_id: string
          exercise_id: string
          log_date: string
          reps: number
          sets: number
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          exercise_id: string
          log_date: string
          reps: number
          sets: number
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          exercise_id?: string
          log_date?: string
          reps?: number
          sets?: number
          notes?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "daily_logs_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "daily_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      friendships: {
        Row: {
          id: string
          requester_id: string
          addressee_id: string
          status: 'pending' | 'accepted' | 'rejected' | 'blocked'
          created_at: string
        }
        Insert: {
          id?: string
          requester_id: string
          addressee_id: string
          status?: 'pending' | 'accepted' | 'rejected' | 'blocked'
          created_at?: string
        }
        Update: {
          id?: string
          requester_id?: string
          addressee_id?: string
          status?: 'pending' | 'accepted' | 'rejected' | 'blocked'
          created_at?: string
        }
        Relationships: []
      }
      activity_feed: {
        Row: {
          id: string
          user_id: string
          activity_type: string
          payload: Json
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          activity_type: string
          payload?: Json
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          activity_type?: string
          payload?: Json
          created_at?: string
        }
        Relationships: []
      }
      cardio_runs: {
        Row: {
          id: string
          user_id: string
          status: 'active' | 'paused' | 'completed'
          started_at: string
          finished_at: string | null
          total_distance_m: number
          total_duration_s: number
          avg_pace: number | null
          route_geojson: Json | null
        }
        Insert: {
          id?: string
          user_id: string
          status?: 'active' | 'paused' | 'completed'
          started_at?: string
          finished_at?: string | null
          total_distance_m?: number
          total_duration_s?: number
          avg_pace?: number | null
          route_geojson?: Json | null
        }
        Update: {
          id?: string
          user_id?: string
          status?: 'active' | 'paused' | 'completed'
          started_at?: string
          finished_at?: string | null
          total_distance_m?: number
          total_duration_s?: number
          avg_pace?: number | null
          route_geojson?: Json | null
        }
        Relationships: []
      }
      run_waypoints: {
        Row: {
          id: string
          run_id: string
          lat: number
          lng: number
          altitude: number | null
          accuracy: number | null
          timestamp: string
          elapsed_s: number
          segment_distance_m: number
        }
        Insert: {
          id?: string
          run_id: string
          lat: number
          lng: number
          altitude?: number | null
          accuracy?: number | null
          timestamp: string
          elapsed_s: number
          segment_distance_m: number
        }
        Update: {
          id?: string
          run_id?: string
          lat?: number
          lng?: number
          altitude?: number | null
          accuracy?: number | null
          timestamp?: string
          elapsed_s?: number
          segment_distance_m?: number
        }
        Relationships: [
          {
            foreignKeyName: "run_waypoints_run_id_fkey"
            columns: ["run_id"]
            isOneToOne: false
            referencedRelation: "cardio_runs"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      weekly_leaderboard: {
        Row: {
          user_id: string
          username: string
          display_name: string | null
          avatar_url: string | null
          exercise_id: string
          exercise_name: string
          week_start: string
          total_reps: number
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, 'public'>]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] &
        PublicSchema['Views'])
    ? (PublicSchema['Tables'] &
        PublicSchema['Views'])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema['Enums']
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
    ? PublicSchema['Enums'][PublicEnumNameOrOptions]
    : never
