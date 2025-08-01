export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      assessment_results: {
        Row: {
          answers: Json | null
          assessment_type: string
          attempts: number | null
          content_id: string
          feedback: string | null
          id: string
          max_score: number
          passed: boolean
          score: number
          submitted_at: string
          time_spent: number | null
          user_id: string
        }
        Insert: {
          answers?: Json | null
          assessment_type: string
          attempts?: number | null
          content_id: string
          feedback?: string | null
          id?: string
          max_score: number
          passed: boolean
          score: number
          submitted_at?: string
          time_spent?: number | null
          user_id: string
        }
        Update: {
          answers?: Json | null
          assessment_type?: string
          attempts?: number | null
          content_id?: string
          feedback?: string | null
          id?: string
          max_score?: number
          passed?: boolean
          score?: number
          submitted_at?: string
          time_spent?: number | null
          user_id?: string
        }
        Relationships: []
      }
      billing_history: {
        Row: {
          admin_id: string | null
          amount: number
          billing_period_end: string
          billing_period_start: string
          coach_id: string | null
          created_at: string
          currency: string
          id: string
          invoice_sent: boolean | null
          invoice_url: string | null
          last_retry_at: string | null
          paid_at: string | null
          paychangu_reference: string | null
          receipt_sent: boolean | null
          retry_count: number | null
          status: string
          subscription_id: string | null
        }
        Insert: {
          admin_id?: string | null
          amount: number
          billing_period_end: string
          billing_period_start: string
          coach_id?: string | null
          created_at?: string
          currency?: string
          id?: string
          invoice_sent?: boolean | null
          invoice_url?: string | null
          last_retry_at?: string | null
          paid_at?: string | null
          paychangu_reference?: string | null
          receipt_sent?: boolean | null
          retry_count?: number | null
          status: string
          subscription_id?: string | null
        }
        Update: {
          admin_id?: string | null
          amount?: number
          billing_period_end?: string
          billing_period_start?: string
          coach_id?: string | null
          created_at?: string
          currency?: string
          id?: string
          invoice_sent?: boolean | null
          invoice_url?: string | null
          last_retry_at?: string | null
          paid_at?: string | null
          paychangu_reference?: string | null
          receipt_sent?: boolean | null
          retry_count?: number | null
          status?: string
          subscription_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "billing_history_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "coach_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      bulk_enrollments: {
        Row: {
          client_id: string
          course_ids: Json
          created_at: string
          currency: string
          expires_at: string | null
          id: string
          paychangu_reference: string | null
          payment_status: Database["public"]["Enums"]["payment_status"]
          total_amount: number
        }
        Insert: {
          client_id: string
          course_ids?: Json
          created_at?: string
          currency?: string
          expires_at?: string | null
          id?: string
          paychangu_reference?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"]
          total_amount: number
        }
        Update: {
          client_id?: string
          course_ids?: Json
          created_at?: string
          currency?: string
          expires_at?: string | null
          id?: string
          paychangu_reference?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"]
          total_amount?: number
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          icon: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          icon?: string | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          icon?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      certificates: {
        Row: {
          certificate_data: Json | null
          certificate_url: string | null
          created_at: string
          enrollment_id: string
          id: string
          issued_at: string
          template_id: string | null
          verification_code: string | null
        }
        Insert: {
          certificate_data?: Json | null
          certificate_url?: string | null
          created_at?: string
          enrollment_id: string
          id?: string
          issued_at?: string
          template_id?: string | null
          verification_code?: string | null
        }
        Update: {
          certificate_data?: Json | null
          certificate_url?: string | null
          created_at?: string
          enrollment_id?: string
          id?: string
          issued_at?: string
          template_id?: string | null
          verification_code?: string | null
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
          auto_renew: boolean | null
          billing_cycle: string
          canceled_at: string | null
          cancellation_reason: string | null
          coach_id: string
          created_at: string
          currency: string
          expires_at: string | null
          id: string
          is_trial: boolean | null
          next_billing_date: string | null
          paychangu_subscription_id: string | null
          price: number
          started_at: string
          status: Database["public"]["Enums"]["subscription_status"]
          tier: string
          trial_ends_at: string | null
          updated_at: string
        }
        Insert: {
          auto_renew?: boolean | null
          billing_cycle?: string
          canceled_at?: string | null
          cancellation_reason?: string | null
          coach_id: string
          created_at?: string
          currency?: string
          expires_at?: string | null
          id?: string
          is_trial?: boolean | null
          next_billing_date?: string | null
          paychangu_subscription_id?: string | null
          price: number
          started_at?: string
          status?: Database["public"]["Enums"]["subscription_status"]
          tier?: string
          trial_ends_at?: string | null
          updated_at?: string
        }
        Update: {
          auto_renew?: boolean | null
          billing_cycle?: string
          canceled_at?: string | null
          cancellation_reason?: string | null
          coach_id?: string
          created_at?: string
          currency?: string
          expires_at?: string | null
          id?: string
          is_trial?: boolean | null
          next_billing_date?: string | null
          paychangu_subscription_id?: string | null
          price?: number
          started_at?: string
          status?: Database["public"]["Enums"]["subscription_status"]
          tier?: string
          trial_ends_at?: string | null
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
      coaching_insights: {
        Row: {
          action_items: Json | null
          client_id: string
          coach_id: string
          created_at: string
          description: string
          expires_at: string | null
          id: string
          insight_type: string
          is_read: boolean | null
          priority: string | null
          title: string
        }
        Insert: {
          action_items?: Json | null
          client_id: string
          coach_id: string
          created_at?: string
          description: string
          expires_at?: string | null
          id?: string
          insight_type: string
          is_read?: boolean | null
          priority?: string | null
          title: string
        }
        Update: {
          action_items?: Json | null
          client_id?: string
          coach_id?: string
          created_at?: string
          description?: string
          expires_at?: string | null
          id?: string
          insight_type?: string
          is_read?: boolean | null
          priority?: string | null
          title?: string
        }
        Relationships: []
      }
      content_analytics: {
        Row: {
          completion_percentage: number | null
          content_id: string
          created_at: string
          id: string
          interactions_count: number | null
          last_viewed_at: string | null
          session_data: Json | null
          user_id: string
          view_duration: number | null
        }
        Insert: {
          completion_percentage?: number | null
          content_id: string
          created_at?: string
          id?: string
          interactions_count?: number | null
          last_viewed_at?: string | null
          session_data?: Json | null
          user_id: string
          view_duration?: number | null
        }
        Update: {
          completion_percentage?: number | null
          content_id?: string
          created_at?: string
          id?: string
          interactions_count?: number | null
          last_viewed_at?: string | null
          session_data?: Json | null
          user_id?: string
          view_duration?: number | null
        }
        Relationships: []
      }
      content_templates: {
        Row: {
          content_type: string
          created_at: string
          created_by: string
          description: string | null
          id: string
          is_public: boolean | null
          name: string
          template_data: Json
          updated_at: string
        }
        Insert: {
          content_type: string
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          name: string
          template_data: Json
          updated_at?: string
        }
        Update: {
          content_type?: string
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          name?: string
          template_data?: Json
          updated_at?: string
        }
        Relationships: []
      }
      content_versions: {
        Row: {
          change_notes: string | null
          content_id: string
          content_text: string | null
          content_url: string | null
          created_at: string
          created_by: string
          description: string | null
          id: string
          is_published: boolean | null
          title: string
          version_number: number
        }
        Insert: {
          change_notes?: string | null
          content_id: string
          content_text?: string | null
          content_url?: string | null
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          is_published?: boolean | null
          title: string
          version_number: number
        }
        Update: {
          change_notes?: string | null
          content_id?: string
          content_text?: string | null
          content_url?: string | null
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          is_published?: boolean | null
          title?: string
          version_number?: number
        }
        Relationships: []
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
      course_downloads: {
        Row: {
          content_id: string
          created_at: string
          download_count: number | null
          download_url: string
          expires_at: string | null
          id: string
          max_downloads: number | null
          user_id: string
        }
        Insert: {
          content_id: string
          created_at?: string
          download_count?: number | null
          download_url: string
          expires_at?: string | null
          id?: string
          max_downloads?: number | null
          user_id: string
        }
        Update: {
          content_id?: string
          created_at?: string
          download_count?: number | null
          download_url?: string
          expires_at?: string | null
          id?: string
          max_downloads?: number | null
          user_id?: string
        }
        Relationships: []
      }
      course_notes: {
        Row: {
          content_id: string | null
          course_id: string
          created_at: string
          id: string
          note_text: string
          note_title: string | null
          timestamp_seconds: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          content_id?: string | null
          course_id: string
          created_at?: string
          id?: string
          note_text: string
          note_title?: string | null
          timestamp_seconds?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          content_id?: string | null
          course_id?: string
          created_at?: string
          id?: string
          note_text?: string
          note_title?: string | null
          timestamp_seconds?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      courses: {
        Row: {
          auto_publish: boolean | null
          category: string | null
          category_id: string | null
          coach_id: string
          created_at: string
          currency: string
          delivery_type: Database["public"]["Enums"]["delivery_type"]
          description: string | null
          difficulty_level: string | null
          end_date: string | null
          enrollment_deadline: string | null
          estimated_duration: number | null
          id: string
          is_published: boolean | null
          max_participants: number | null
          price: number
          pricing_model: Database["public"]["Enums"]["pricing_model"]
          publish_status: string | null
          scheduled_publish_at: string | null
          short_description: string | null
          start_date: string | null
          subscription_price: number | null
          tags: string[] | null
          thumbnail_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          auto_publish?: boolean | null
          category?: string | null
          category_id?: string | null
          coach_id: string
          created_at?: string
          currency?: string
          delivery_type?: Database["public"]["Enums"]["delivery_type"]
          description?: string | null
          difficulty_level?: string | null
          end_date?: string | null
          enrollment_deadline?: string | null
          estimated_duration?: number | null
          id?: string
          is_published?: boolean | null
          max_participants?: number | null
          price: number
          pricing_model?: Database["public"]["Enums"]["pricing_model"]
          publish_status?: string | null
          scheduled_publish_at?: string | null
          short_description?: string | null
          start_date?: string | null
          subscription_price?: number | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          auto_publish?: boolean | null
          category?: string | null
          category_id?: string | null
          coach_id?: string
          created_at?: string
          currency?: string
          delivery_type?: Database["public"]["Enums"]["delivery_type"]
          description?: string | null
          difficulty_level?: string | null
          end_date?: string | null
          enrollment_deadline?: string | null
          estimated_duration?: number | null
          id?: string
          is_published?: boolean | null
          max_participants?: number | null
          price?: number
          pricing_model?: Database["public"]["Enums"]["pricing_model"]
          publish_status?: string | null
          scheduled_publish_at?: string | null
          short_description?: string | null
          start_date?: string | null
          subscription_price?: number | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "courses_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
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
      learning_analytics: {
        Row: {
          average_session_duration: number | null
          content_consumed: number | null
          courses_completed: number | null
          courses_started: number | null
          created_at: string
          engagement_score: number | null
          id: string
          period_end: string
          period_start: string
          skills_gained: Json | null
          strong_areas: Json | null
          total_study_time: number | null
          user_id: string
          weak_areas: Json | null
        }
        Insert: {
          average_session_duration?: number | null
          content_consumed?: number | null
          courses_completed?: number | null
          courses_started?: number | null
          created_at?: string
          engagement_score?: number | null
          id?: string
          period_end: string
          period_start: string
          skills_gained?: Json | null
          strong_areas?: Json | null
          total_study_time?: number | null
          user_id: string
          weak_areas?: Json | null
        }
        Update: {
          average_session_duration?: number | null
          content_consumed?: number | null
          courses_completed?: number | null
          courses_started?: number | null
          created_at?: string
          engagement_score?: number | null
          id?: string
          period_end?: string
          period_start?: string
          skills_gained?: Json | null
          strong_areas?: Json | null
          total_study_time?: number | null
          user_id?: string
          weak_areas?: Json | null
        }
        Relationships: []
      }
      learning_milestones: {
        Row: {
          achieved_at: string
          chapter_id: string | null
          content_id: string | null
          id: string
          learning_path_id: string
          metadata: Json | null
          milestone_type: string
          score: number | null
          time_spent: number | null
        }
        Insert: {
          achieved_at?: string
          chapter_id?: string | null
          content_id?: string | null
          id?: string
          learning_path_id: string
          metadata?: Json | null
          milestone_type: string
          score?: number | null
          time_spent?: number | null
        }
        Update: {
          achieved_at?: string
          chapter_id?: string | null
          content_id?: string | null
          id?: string
          learning_path_id?: string
          metadata?: Json | null
          milestone_type?: string
          score?: number | null
          time_spent?: number | null
        }
        Relationships: []
      }
      learning_streaks: {
        Row: {
          created_at: string
          current_streak: number | null
          id: string
          last_activity_date: string
          longest_streak: number | null
          streak_type: string
          total_activities: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_streak?: number | null
          id?: string
          last_activity_date: string
          longest_streak?: number | null
          streak_type: string
          total_activities?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_streak?: number | null
          id?: string
          last_activity_date?: string
          longest_streak?: number | null
          streak_type?: string
          total_activities?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      lessons: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_published: boolean | null
          module_id: string
          sort_order: number
          title: string
          unlock_after_days: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_published?: boolean | null
          module_id: string
          sort_order?: number
          title: string
          unlock_after_days?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_published?: boolean | null
          module_id?: string
          sort_order?: number
          title?: string
          unlock_after_days?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lessons_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      modules: {
        Row: {
          course_id: string
          created_at: string
          description: string | null
          id: string
          is_published: boolean | null
          sort_order: number
          title: string
          unlock_after_days: number | null
          updated_at: string
        }
        Insert: {
          course_id: string
          created_at?: string
          description?: string | null
          id?: string
          is_published?: boolean | null
          sort_order?: number
          title: string
          unlock_after_days?: number | null
          updated_at?: string
        }
        Update: {
          course_id?: string
          created_at?: string
          description?: string | null
          id?: string
          is_published?: boolean | null
          sort_order?: number
          title?: string
          unlock_after_days?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "modules_course_id_fkey"
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
          paychangu_enabled: boolean | null
          paychangu_public_key: string | null
          paychangu_secret_key: string | null
          payment_settings: Json | null
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
          paychangu_enabled?: boolean | null
          paychangu_public_key?: string | null
          paychangu_secret_key?: string | null
          payment_settings?: Json | null
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
          paychangu_enabled?: boolean | null
          paychangu_public_key?: string | null
          paychangu_secret_key?: string | null
          payment_settings?: Json | null
          profile_completed?: boolean | null
          role?: Database["public"]["Enums"]["app_role"]
          specialties?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      publishing_workflows: {
        Row: {
          approval_notes: string | null
          approved_at: string | null
          approved_by: string | null
          content_id: string | null
          course_id: string | null
          id: string
          rejection_reason: string | null
          status: string
          submitted_at: string
          submitted_by: string
          workflow_type: string
        }
        Insert: {
          approval_notes?: string | null
          approved_at?: string | null
          approved_by?: string | null
          content_id?: string | null
          course_id?: string | null
          id?: string
          rejection_reason?: string | null
          status?: string
          submitted_at?: string
          submitted_by: string
          workflow_type: string
        }
        Update: {
          approval_notes?: string | null
          approved_at?: string | null
          approved_by?: string | null
          content_id?: string | null
          course_id?: string | null
          id?: string
          rejection_reason?: string | null
          status?: string
          submitted_at?: string
          submitted_by?: string
          workflow_type?: string
        }
        Relationships: []
      }
      sections: {
        Row: {
          content: Json | null
          content_text: string | null
          content_type: Database["public"]["Enums"]["content_type"]
          content_url: string | null
          created_at: string
          duration: number | null
          id: string
          is_free: boolean | null
          is_preview: boolean | null
          lesson_id: string
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          content?: Json | null
          content_text?: string | null
          content_type: Database["public"]["Enums"]["content_type"]
          content_url?: string | null
          created_at?: string
          duration?: number | null
          id?: string
          is_free?: boolean | null
          is_preview?: boolean | null
          lesson_id: string
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          content?: Json | null
          content_text?: string | null
          content_type?: Database["public"]["Enums"]["content_type"]
          content_url?: string | null
          created_at?: string
          duration?: number | null
          id?: string
          is_free?: boolean | null
          is_preview?: boolean | null
          lesson_id?: string
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sections_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      study_sessions: {
        Row: {
          activities: Json | null
          break_count: number | null
          content_id: string | null
          course_id: string | null
          duration: number | null
          ended_at: string | null
          focus_score: number | null
          id: string
          session_quality: string | null
          started_at: string
          user_id: string
        }
        Insert: {
          activities?: Json | null
          break_count?: number | null
          content_id?: string | null
          course_id?: string | null
          duration?: number | null
          ended_at?: string | null
          focus_score?: number | null
          id?: string
          session_quality?: string | null
          started_at?: string
          user_id: string
        }
        Update: {
          activities?: Json | null
          break_count?: number | null
          content_id?: string | null
          course_id?: string | null
          duration?: number | null
          ended_at?: string | null
          focus_score?: number | null
          id?: string
          session_quality?: string | null
          started_at?: string
          user_id?: string
        }
        Relationships: []
      }
      subcategories: {
        Row: {
          category_id: string
          created_at: string
          id: string
          name: string
          slug: string
        }
        Insert: {
          category_id: string
          created_at?: string
          id?: string
          name: string
          slug: string
        }
        Update: {
          category_id?: string
          created_at?: string
          id?: string
          name?: string
          slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "subcategories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_changes: {
        Row: {
          change_type: string
          created_at: string
          effective_date: string
          from_price: number | null
          from_tier: string | null
          id: string
          metadata: Json | null
          prorated_amount: number | null
          subscription_id: string | null
          to_price: number | null
          to_tier: string | null
        }
        Insert: {
          change_type: string
          created_at?: string
          effective_date: string
          from_price?: number | null
          from_tier?: string | null
          id?: string
          metadata?: Json | null
          prorated_amount?: number | null
          subscription_id?: string | null
          to_price?: number | null
          to_tier?: string | null
        }
        Update: {
          change_type?: string
          created_at?: string
          effective_date?: string
          from_price?: number | null
          from_tier?: string | null
          id?: string
          metadata?: Json | null
          prorated_amount?: number | null
          subscription_id?: string | null
          to_price?: number | null
          to_tier?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscription_changes_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "coach_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_notifications: {
        Row: {
          email_sent: boolean | null
          id: string
          metadata: Json | null
          notification_type: string
          sent_at: string
          subscription_id: string | null
        }
        Insert: {
          email_sent?: boolean | null
          id?: string
          metadata?: Json | null
          notification_type: string
          sent_at?: string
          subscription_id?: string | null
        }
        Update: {
          email_sent?: boolean | null
          id?: string
          metadata?: Json | null
          notification_type?: string
          sent_at?: string
          subscription_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscription_notifications_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "coach_subscriptions"
            referencedColumns: ["id"]
          },
        ]
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
      user_learning_paths: {
        Row: {
          actual_completion_date: string | null
          course_id: string
          created_at: string
          estimated_completion_date: string | null
          goals: Json | null
          id: string
          learning_pace: string | null
          notes: string | null
          started_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          actual_completion_date?: string | null
          course_id: string
          created_at?: string
          estimated_completion_date?: string | null
          goals?: Json | null
          id?: string
          learning_pace?: string | null
          notes?: string | null
          started_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          actual_completion_date?: string | null
          course_id?: string
          created_at?: string
          estimated_completion_date?: string | null
          goals?: Json | null
          id?: string
          learning_pace?: string | null
          notes?: string | null
          started_at?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_progress: {
        Row: {
          completed_at: string | null
          is_completed: boolean | null
          section_id: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          is_completed?: boolean | null
          section_id: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          is_completed?: boolean | null
          section_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "sections"
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
      auto_publish_scheduled_content: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      calculate_learning_analytics: {
        Args: { _user_id: string; _start_date: string; _end_date: string }
        Returns: undefined
      }
      expire_trials: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      is_coach_subscribed: {
        Args: { _user_id: string }
        Returns: boolean
      }
      start_trial_subscription: {
        Args: { _coach_id: string }
        Returns: string
      }
      update_learning_streak: {
        Args: { _user_id: string }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "coach" | "client"
      content_type: "video" | "audio" | "text" | "pdf" | "image" | "interactive"
      delivery_type: "self_paced" | "instructor_led"
      payment_status: "pending" | "completed" | "failed" | "refunded"
      pricing_model: "one_time" | "subscription"
      subscription_status: "active" | "inactive" | "trial" | "expired"
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
    Enums: {
      app_role: ["admin", "coach", "client"],
      content_type: ["video", "audio", "text", "pdf", "image", "interactive"],
      delivery_type: ["self_paced", "instructor_led"],
      payment_status: ["pending", "completed", "failed", "refunded"],
      pricing_model: ["one_time", "subscription"],
      subscription_status: ["active", "inactive", "trial", "expired"],
    },
  },
} as const
