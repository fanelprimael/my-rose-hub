export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      classes: {
        Row: {
          capacity: number
          created_at: string
          id: string
          level: string
          name: string
          student_count: number
          teacher: string
          updated_at: string
        }
        Insert: {
          capacity?: number
          created_at?: string
          id?: string
          level: string
          name: string
          student_count?: number
          teacher: string
          updated_at?: string
        }
        Update: {
          capacity?: number
          created_at?: string
          id?: string
          level?: string
          name?: string
          student_count?: number
          teacher?: string
          updated_at?: string
        }
        Relationships: []
      }
      grades: {
        Row: {
          class_name: string
          coefficient: number
          created_at: string
          date: string
          grade: number
          id: string
          student_id: string
          student_name: string
          subject_id: string | null
          subject_name: string
          type: string
          updated_at: string
        }
        Insert: {
          class_name: string
          coefficient?: number
          created_at?: string
          date: string
          grade: number
          id?: string
          student_id: string
          student_name: string
          subject_id?: string | null
          subject_name: string
          type?: string
          updated_at?: string
        }
        Update: {
          class_name?: string
          coefficient?: number
          created_at?: string
          date?: string
          grade?: number
          id?: string
          student_id?: string
          student_name?: string
          subject_id?: string | null
          subject_name?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      payment_types: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          class_name: string
          created_at: string
          date: string
          due_date: string | null
          id: string
          status: string
          student_id: string
          student_name: string
          type: string
          updated_at: string
        }
        Insert: {
          amount: number
          class_name: string
          created_at?: string
          date: string
          due_date?: string | null
          id?: string
          status?: string
          student_id: string
          student_name: string
          type: string
          updated_at?: string
        }
        Update: {
          amount?: number
          class_name?: string
          created_at?: string
          date?: string
          due_date?: string | null
          id?: string
          status?: string
          student_id?: string
          student_name?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      school_settings: {
        Row: {
          address: string | null
          created_at: string
          currency: string
          email: string | null
          email_notifications: boolean
          id: string
          maintenance_mode: boolean
          name: string
          phone: string | null
          school_year: string
          type: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          currency?: string
          email?: string | null
          email_notifications?: boolean
          id?: string
          maintenance_mode?: boolean
          name: string
          phone?: string | null
          school_year: string
          type: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          currency?: string
          email?: string | null
          email_notifications?: boolean
          id?: string
          maintenance_mode?: boolean
          name?: string
          phone?: string | null
          school_year?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      students: {
        Row: {
          address: string
          age: number | null
          class: string
          created_at: string
          date_of_birth: string
          first_name: string
          gender: string | null
          id: string
          last_name: string
          parent_email: string
          parent_name: string
          parent_phone: string
          status: string
          updated_at: string
        }
        Insert: {
          address: string
          age?: number | null
          class: string
          created_at?: string
          date_of_birth: string
          first_name: string
          gender?: string | null
          id?: string
          last_name: string
          parent_email: string
          parent_name: string
          parent_phone: string
          status?: string
          updated_at?: string
        }
        Update: {
          address?: string
          age?: number | null
          class?: string
          created_at?: string
          date_of_birth?: string
          first_name?: string
          gender?: string | null
          id?: string
          last_name?: string
          parent_email?: string
          parent_name?: string
          parent_phone?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      subjects: {
        Row: {
          category: string
          coefficient: number
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          category: string
          coefficient?: number
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          category?: string
          coefficient?: number
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      teachers: {
        Row: {
          classes: string[]
          created_at: string
          email: string
          first_name: string
          hire_date: string | null
          id: string
          last_name: string
          phone: string
          status: string
          subjects: string[]
          updated_at: string
        }
        Insert: {
          classes?: string[]
          created_at?: string
          email: string
          first_name: string
          hire_date?: string | null
          id?: string
          last_name: string
          phone: string
          status?: string
          subjects?: string[]
          updated_at?: string
        }
        Update: {
          classes?: string[]
          created_at?: string
          email?: string
          first_name?: string
          hire_date?: string | null
          id?: string
          last_name?: string
          phone?: string
          status?: string
          subjects?: string[]
          updated_at?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string
          email: string
          id: string
          permissions: Json
          role: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          permissions?: Json
          role: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          permissions?: Json
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
