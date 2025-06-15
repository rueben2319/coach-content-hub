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
      certificates: {
        Row: {
          certificate_url: string | null
          created_at: string
          enrollment_id: string
          id: string
          issued_at: string
        }
        Insert: {
          certificate_url?: string | null
          created_at?: string
          enrollment_id: string
          id?: string
          issued_at?: string
        }
        Update: {
          certificate_url?: string | null
          created_at?: string
          enrollment_id?: string
          id?: string
          issued_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "certificates_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "enrollments"
            referencedColumns: ["id"]
          },
        ]
      }
      coach_subscriptions: {
        Row: {
          billing_cycle: string
          coach_id: string
          created_at: string
          currency: string
          expires_at: string | null
          id: string
          paychangu_subscription_id: string | null
          price: number
          started_at: string
          status: Database["public"]["Enums"]["subscription_status"]
          tier: string
          updated_at: string
        }
        Insert: {
          billing_cycle?: string
          coach_id: string
          created_at?: string
          currency?: string
          expires_at?: string | null
          id?: string
          paychangu_subscription_id?: string | null
          price: number
          started_at?: string
          status?: Database["public"]["Enums"]["subscription_status"]
          tier?: string
          updated_at?: string
        }
        Update: {
          billing_cycle?: string
          coach_id?: string
          created_at?: string
          currency?: string
          expires_at?: string | null
          id?: string
          paychangu_subscription_id?: string | null
          price?: number
          started_at?: string
          status?: Database["public"]["Enums"]["subscription_status"]
          tier?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "coach_subscriptions_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      course_bundle_items: {
        Row: {
          bundle_id: string
          course_id: string
          created_at: string
          id: string
        }
        Insert: {
          bundle_id: string
          course_id: string
          created_at?: string
          id?: string
        }
        Update: {
          bundle_id?: string
          course_id?: string
          created_at?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_bundle_items_bundle_id_fkey"
            columns: ["bundle_id"]
            isOneToOne: false
            referencedRelation: "course_bundles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_bundle_items_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_bundles: {
        Row: {
          coach_id: string
          created_at: string
          currency: string
          description: string | null
          id: string
          is_published: boolean | null
          price: number
          pricing_model: Database["public"]["Enums"]["pricing_model"]
          subscription_price: number | null
          thumbnail_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          coach_id: string
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          is_published?: boolean | null
          price: number
          pricing_model?: Database["public"]["Enums"]["pricing_model"]
          subscription_price?: number | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          coach_id?: string
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          is_published?: boolean | null
          price?: number
          pricing_model?: Database["public"]["Enums"]["pricing_model"]
          subscription_price?: number | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_bundles_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      course_content: {
        Row: {
          content_text: string | null
          content_type: Database["public"]["Enums"]["content_type"]
          content_url: string | null
          course_id: string
          created_at: string
          description: string | null
          duration: number | null
          file_size: number | null
          id: string
          is_preview: boolean | null
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          content_text?: string | null
          content_type: Database["public"]["Enums"]["content_type"]
          content_url?: string | null
          course_id: string
          created_at?: string
          description?: string | null
          duration?: number | null
          file_size?: number | null
          id?: string
          is_preview?: boolean | null
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          content_text?: string | null
          content_type?: Database["public"]["Enums"]["content_type"]
          content_url?: string | null
          course_id?: string
          created_at?: string
          description?: string | null
          duration?: number | null
          file_size?: number | null
          id?: string
          is_preview?: boolean | null
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_content_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_progress: {
        Row: {
          completed: boolean | null
          completed_at: string | null
          content_id: string
          created_at: string
          enrollment_id: string
          id: string
          last_accessed: string | null
          progress_percentage: number | null
          time_spent: number | null
          updated_at: string
        }
        Insert: {
          completed?: boolean | null
          completed_at?: string | null
          content_id: string
          created_at?: string
          enrollment_id: string
          id?: string
          last_accessed?: string | null
          progress_percentage?: number | null
          time_spent?: number | null
          updated_at?: string
        }
        Update: {
          completed?: boolean | null
          completed_at?: string | null
          content_id?: string
          created_at?: string
          enrollment_id?: string
          id?: string
          last_accessed?: string | null
          progress_percentage?: number | null
          time_spent?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_progress_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "course_content"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_progress_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "enrollments"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          category: string | null
          coach_id: string
          created_at: string
          currency: string
          description: string | null
          difficulty_level: string | null
          estimated_duration: number | null
          id: string
          is_published: boolean | null
          price: number
          pricing_model: Database["public"]["Enums"]["pricing_model"]
          short_description: string | null
          subscription_price: number | null
          tags: string[] | null
          thumbnail_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          coach_id: string
          created_at?: string
          currency?: string
          description?: string | null
          difficulty_level?: string | null
          estimated_duration?: number | null
          id?: string
          is_published?: boolean | null
          price: number
          pricing_model?: Database["public"]["Enums"]["pricing_model"]
          short_description?: string | null
          subscription_price?: number | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          coach_id?: string
          created_at?: string
          currency?: string
          description?: string | null
          difficulty_level?: string | null
          estimated_duration?: number | null
          id?: string
          is_published?: boolean | null
          price?: number
          pricing_model?: Database["public"]["Enums"]["pricing_model"]
          short_description?: string | null
          subscription_price?: number | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "courses_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      enrollments: {
        Row: {
          amount: number
          bundle_id: string | null
          client_id: string
          course_id: string | null
          created_at: string
          currency: string
          enrolled_at: string
          expires_at: string | null
          id: string
          paychangu_reference: string | null
          payment_status: Database["public"]["Enums"]["payment_status"]
        }
        Insert: {
          amount: number
          bundle_id?: string | null
          client_id: string
          course_id?: string | null
          created_at?: string
          currency?: string
          enrolled_at?: string
          expires_at?: string | null
          id?: string
          paychangu_reference?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"]
        }
        Update: {
          amount?: number
          bundle_id?: string | null
          client_id?: string
          course_id?: string | null
          created_at?: string
          currency?: string
          enrolled_at?: string
          expires_at?: string | null
          id?: string
          paychangu_reference?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"]
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_bundle_id_fkey"
            columns: ["bundle_id"]
            isOneToOne: false
            referencedRelation: "course_bundles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          email: string
          experience_years: number | null
          first_name: string | null
          id: string
          is_public: boolean | null
          last_name: string | null
          location: string | null
          profile_completed: boolean | null
          role: Database["public"]["Enums"]["app_role"]
          specialties: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email: string
          experience_years?: number | null
          first_name?: string | null
          id?: string
          is_public?: boolean | null
          last_name?: string | null
          location?: string | null
          profile_completed?: boolean | null
          role?: Database["public"]["Enums"]["app_role"]
          specialties?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string
          experience_years?: number | null
          first_name?: string | null
          id?: string
          is_public?: boolean | null
          last_name?: string | null
          location?: string | null
          profile_completed?: boolean | null
          role?: Database["public"]["Enums"]["app_role"]
          specialties?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          created_at: string
          currency: string
          enrollment_id: string | null
          id: string
          paychangu_reference: string
          paychangu_transaction_id: string | null
          payment_method: string | null
          status: Database["public"]["Enums"]["payment_status"]
          subscription_id: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          enrollment_id?: string | null
          id?: string
          paychangu_reference: string
          paychangu_transaction_id?: string | null
          payment_method?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          subscription_id?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          enrollment_id?: string | null
          id?: string
          paychangu_reference?: string
          paychangu_transaction_id?: string | null
          payment_method?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          subscription_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "enrollments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "coach_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "coach" | "client"
      content_type: "video" | "audio" | "text" | "pdf" | "image" | "interactive"
      payment_status: "pending" | "completed" | "failed" | "refunded"
      pricing_model: "one_time" | "subscription"
      subscription_status: "active" | "inactive" | "trial" | "expired"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "coach", "client"],
      content_type: ["video", "audio", "text", "pdf", "image", "interactive"],
      payment_status: ["pending", "completed", "failed", "refunded"],
      pricing_model: ["one_time", "subscription"],
      subscription_status: ["active", "inactive", "trial", "expired"],
    },
  },
} as const
