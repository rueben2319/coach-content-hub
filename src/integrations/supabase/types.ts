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
      app_notifications: {
        Row: {
          action: Database["public"]["Enums"]["app_action_type"]
          additional_info: Json | null
          changed_at: string | null
          changed_by: string | null
          entity_id: number
          entity_type: Database["public"]["Enums"]["app_entity_type"]
          id: number
          is_read: boolean | null
          new_data: Json | null
          notification_level: number | null
          old_data: Json | null
          parent_entity_id: number | null
        }
        Insert: {
          action: Database["public"]["Enums"]["app_action_type"]
          additional_info?: Json | null
          changed_at?: string | null
          changed_by?: string | null
          entity_id: number
          entity_type: Database["public"]["Enums"]["app_entity_type"]
          id?: never
          is_read?: boolean | null
          new_data?: Json | null
          notification_level?: number | null
          old_data?: Json | null
          parent_entity_id?: number | null
        }
        Update: {
          action?: Database["public"]["Enums"]["app_action_type"]
          additional_info?: Json | null
          changed_at?: string | null
          changed_by?: string | null
          entity_id?: number
          entity_type?: Database["public"]["Enums"]["app_entity_type"]
          id?: never
          is_read?: boolean | null
          new_data?: Json | null
          notification_level?: number | null
          old_data?: Json | null
          parent_entity_id?: number | null
        }
        Relationships: []
      }
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
      assignment_submissions: {
        Row: {
          assignment_id: string
          created_at: string | null
          feedback: string | null
          feedback_details: Json | null
          graded_at: string | null
          graded_by: string | null
          id: string
          max_score: number | null
          passed: boolean | null
          score: number | null
          status: string | null
          submission_files: Json | null
          submission_text: string | null
          submitted_at: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          assignment_id: string
          created_at?: string | null
          feedback?: string | null
          feedback_details?: Json | null
          graded_at?: string | null
          graded_by?: string | null
          id?: string
          max_score?: number | null
          passed?: boolean | null
          score?: number | null
          status?: string | null
          submission_files?: Json | null
          submission_text?: string | null
          submitted_at?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          assignment_id?: string
          created_at?: string | null
          feedback?: string | null
          feedback_details?: Json | null
          graded_at?: string | null
          graded_by?: string | null
          id?: string
          max_score?: number | null
          passed?: boolean | null
          score?: number | null
          status?: string | null
          submission_files?: Json | null
          submission_text?: string | null
          submitted_at?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "assignment_submissions_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "assignments"
            referencedColumns: ["id"]
          },
        ]
      }
      assignments: {
        Row: {
          allow_late_submissions: boolean | null
          allowed_file_types: string[] | null
          course_id: string
          created_at: string | null
          description: string | null
          due_at: string | null
          feedback_template: string | null
          grading_criteria: Json | null
          id: string
          instructions: string | null
          is_published: boolean | null
          late_submission_penalty: number | null
          max_file_size_mb: number | null
          max_score: number | null
          opens_at: string | null
          passing_score: number | null
          title: string
          updated_at: string | null
        }
        Insert: {
          allow_late_submissions?: boolean | null
          allowed_file_types?: string[] | null
          course_id: string
          created_at?: string | null
          description?: string | null
          due_at?: string | null
          feedback_template?: string | null
          grading_criteria?: Json | null
          id?: string
          instructions?: string | null
          is_published?: boolean | null
          late_submission_penalty?: number | null
          max_file_size_mb?: number | null
          max_score?: number | null
          opens_at?: string | null
          passing_score?: number | null
          title: string
          updated_at?: string | null
        }
        Update: {
          allow_late_submissions?: boolean | null
          allowed_file_types?: string[] | null
          course_id?: string
          created_at?: string | null
          description?: string | null
          due_at?: string | null
          feedback_template?: string | null
          grading_criteria?: Json | null
          id?: string
          instructions?: string | null
          is_published?: boolean | null
          late_submission_penalty?: number | null
          max_file_size_mb?: number | null
          max_score?: number | null
          opens_at?: string | null
          passing_score?: number | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assignments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
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
      comments: {
        Row: {
          attachments: string[] | null
          client_ip: unknown | null
          content: string
          content_type: string | null
          created_at: string | null
          created_by: string
          discussion_id: string
          id: string
          is_deleted: boolean | null
          is_edited: boolean | null
          is_solution: boolean | null
          likes_count: number | null
          mentioned_users: string[] | null
          parent_comment_id: string | null
          replies_count: number | null
          updated_at: string | null
          user_agent: string | null
        }
        Insert: {
          attachments?: string[] | null
          client_ip?: unknown | null
          content: string
          content_type?: string | null
          created_at?: string | null
          created_by: string
          discussion_id: string
          id?: string
          is_deleted?: boolean | null
          is_edited?: boolean | null
          is_solution?: boolean | null
          likes_count?: number | null
          mentioned_users?: string[] | null
          parent_comment_id?: string | null
          replies_count?: number | null
          updated_at?: string | null
          user_agent?: string | null
        }
        Update: {
          attachments?: string[] | null
          client_ip?: unknown | null
          content?: string
          content_type?: string | null
          created_at?: string | null
          created_by?: string
          discussion_id?: string
          id?: string
          is_deleted?: boolean | null
          is_edited?: boolean | null
          is_solution?: boolean | null
          likes_count?: number | null
          mentioned_users?: string[] | null
          parent_comment_id?: string | null
          replies_count?: number | null
          updated_at?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comments_discussion_id_fkey"
            columns: ["discussion_id"]
            isOneToOne: false
            referencedRelation: "discussions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
        ]
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
      course_notifications: {
        Row: {
          action: Database["public"]["Enums"]["course_action_type"]
          additional_info: Json | null
          changed_at: string | null
          changed_by: string | null
          course_id: number | null
          id: number
          new_data: Json | null
          old_data: Json | null
        }
        Insert: {
          action: Database["public"]["Enums"]["course_action_type"]
          additional_info?: Json | null
          changed_at?: string | null
          changed_by?: string | null
          course_id?: number | null
          id?: never
          new_data?: Json | null
          old_data?: Json | null
        }
        Update: {
          action?: Database["public"]["Enums"]["course_action_type"]
          additional_info?: Json | null
          changed_at?: string | null
          changed_by?: string | null
          course_id?: number | null
          id?: never
          new_data?: Json | null
          old_data?: Json | null
        }
        Relationships: []
      }
      courses: {
        Row: {
          auto_publish: boolean | null
          category_id: string | null
          coach_id: string
          created_at: string
          currency: string | null
          delivery_type: Database["public"]["Enums"]["delivery_type"]
          description: string | null
          difficulty_level: string | null
          end_date: string | null
          enrollment_deadline: string | null
          estimated_duration: number | null
          id: string
          image: string | null
          is_published: boolean | null
          max_participants: number | null
          price: number
          pricing_model: Database["public"]["Enums"]["pricing_model"]
          publish_status: string | null
          scheduled_publish_at: string | null
          short_description: string | null
          start_date: string | null
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          auto_publish?: boolean | null
          category_id?: string | null
          coach_id: string
          created_at?: string
          currency?: string | null
          delivery_type?: Database["public"]["Enums"]["delivery_type"]
          description?: string | null
          difficulty_level?: string | null
          end_date?: string | null
          enrollment_deadline?: string | null
          estimated_duration?: number | null
          id?: string
          image?: string | null
          is_published?: boolean | null
          max_participants?: number | null
          price: number
          pricing_model?: Database["public"]["Enums"]["pricing_model"]
          publish_status?: string | null
          scheduled_publish_at?: string | null
          short_description?: string | null
          start_date?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          auto_publish?: boolean | null
          category_id?: string | null
          coach_id?: string
          created_at?: string
          currency?: string | null
          delivery_type?: Database["public"]["Enums"]["delivery_type"]
          description?: string | null
          difficulty_level?: string | null
          end_date?: string | null
          enrollment_deadline?: string | null
          estimated_duration?: number | null
          id?: string
          image?: string | null
          is_published?: boolean | null
          max_participants?: number | null
          price?: number
          pricing_model?: Database["public"]["Enums"]["pricing_model"]
          publish_status?: string | null
          scheduled_publish_at?: string | null
          short_description?: string | null
          start_date?: string | null
          tags?: string[] | null
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
      discussions: {
        Row: {
          comment_count: number | null
          course_id: string
          created_at: string | null
          created_by: string
          description: string | null
          discussion_type: string | null
          id: string
          is_anonymous: boolean | null
          is_locked: boolean | null
          is_pinned: boolean | null
          is_published: boolean | null
          last_activity_at: string | null
          resource_id: string | null
          section_id: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
          view_count: number | null
        }
        Insert: {
          comment_count?: number | null
          course_id: string
          created_at?: string | null
          created_by: string
          description?: string | null
          discussion_type?: string | null
          id?: string
          is_anonymous?: boolean | null
          is_locked?: boolean | null
          is_pinned?: boolean | null
          is_published?: boolean | null
          last_activity_at?: string | null
          resource_id?: string | null
          section_id?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          view_count?: number | null
        }
        Update: {
          comment_count?: number | null
          course_id?: string
          created_at?: string | null
          created_by?: string
          description?: string | null
          discussion_type?: string | null
          id?: string
          is_anonymous?: boolean | null
          is_locked?: boolean | null
          is_pinned?: boolean | null
          is_published?: boolean | null
          last_activity_at?: string | null
          resource_id?: string | null
          section_id?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "discussions_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
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
      media_assets: {
        Row: {
          copyright_info: string | null
          course_id: string | null
          created_at: string | null
          description: string | null
          duration: unknown | null
          file_extension: string
          file_name: string
          file_size: number
          height: number | null
          id: string
          is_downloadable: boolean | null
          is_public: boolean | null
          license_type: string | null
          metadata: Json | null
          mime_type: string
          name: string
          owner_id: string
          parent_asset_id: string | null
          processing_status: string | null
          slug: string
          storage_path: string
          storage_provider: string
          type: string
          updated_at: string | null
          version: number | null
          width: number | null
        }
        Insert: {
          copyright_info?: string | null
          course_id?: string | null
          created_at?: string | null
          description?: string | null
          duration?: unknown | null
          file_extension: string
          file_name: string
          file_size: number
          height?: number | null
          id?: string
          is_downloadable?: boolean | null
          is_public?: boolean | null
          license_type?: string | null
          metadata?: Json | null
          mime_type: string
          name: string
          owner_id: string
          parent_asset_id?: string | null
          processing_status?: string | null
          slug: string
          storage_path: string
          storage_provider?: string
          type: string
          updated_at?: string | null
          version?: number | null
          width?: number | null
        }
        Update: {
          copyright_info?: string | null
          course_id?: string | null
          created_at?: string | null
          description?: string | null
          duration?: unknown | null
          file_extension?: string
          file_name?: string
          file_size?: number
          height?: number | null
          id?: string
          is_downloadable?: boolean | null
          is_public?: boolean | null
          license_type?: string | null
          metadata?: Json | null
          mime_type?: string
          name?: string
          owner_id?: string
          parent_asset_id?: string | null
          processing_status?: string | null
          slug?: string
          storage_path?: string
          storage_provider?: string
          type?: string
          updated_at?: string | null
          version?: number | null
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "media_assets_parent_asset_id_fkey"
            columns: ["parent_asset_id"]
            isOneToOne: false
            referencedRelation: "media_assets"
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
      payments: {
        Row: {
          amount: number
          card_brand: string | null
          client_id: string
          country_code: string | null
          course_id: string
          created_at: string | null
          currency: string
          discount_amount: number | null
          discount_code: string | null
          enrollment_id: string | null
          id: string
          invoice_number: string | null
          is_recurring: boolean | null
          last_four_digits: string | null
          metadata: Json | null
          original_amount: number | null
          payment_method: string | null
          provider: string
          provider_transaction_id: string | null
          status: string
          tax_amount: number | null
          tax_rate: number | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          card_brand?: string | null
          client_id: string
          country_code?: string | null
          course_id: string
          created_at?: string | null
          currency?: string
          discount_amount?: number | null
          discount_code?: string | null
          enrollment_id?: string | null
          id?: string
          invoice_number?: string | null
          is_recurring?: boolean | null
          last_four_digits?: string | null
          metadata?: Json | null
          original_amount?: number | null
          payment_method?: string | null
          provider: string
          provider_transaction_id?: string | null
          status?: string
          tax_amount?: number | null
          tax_rate?: number | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          card_brand?: string | null
          client_id?: string
          country_code?: string | null
          course_id?: string
          created_at?: string | null
          currency?: string
          discount_amount?: number | null
          discount_code?: string | null
          enrollment_id?: string | null
          id?: string
          invoice_number?: string | null
          is_recurring?: boolean | null
          last_four_digits?: string | null
          metadata?: Json | null
          original_amount?: number | null
          payment_method?: string | null
          provider?: string
          provider_transaction_id?: string | null
          status?: string
          tax_amount?: number | null
          tax_rate?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "enrollments"
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
      quiz_attempts: {
        Row: {
          answers: Json | null
          attempt_number: number | null
          completed_at: string | null
          created_at: string | null
          id: string
          max_score: number | null
          passed: boolean | null
          quiz_id: string
          review_notes: string | null
          score: number | null
          started_at: string | null
          status: string | null
          time_spent: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          answers?: Json | null
          attempt_number?: number | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          max_score?: number | null
          passed?: boolean | null
          quiz_id: string
          review_notes?: string | null
          score?: number | null
          started_at?: string | null
          status?: string | null
          time_spent?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          answers?: Json | null
          attempt_number?: number | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          max_score?: number | null
          passed?: boolean | null
          quiz_id?: string
          review_notes?: string | null
          score?: number | null
          started_at?: string | null
          status?: string | null
          time_spent?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_attempts_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      quizzes: {
        Row: {
          course_id: string
          created_at: string | null
          description: string | null
          difficulty_level: string | null
          duration_minutes: number | null
          id: string
          is_published: boolean | null
          max_attempts: number | null
          metadata: Json | null
          passing_score: number | null
          shuffle_questions: boolean | null
          title: string
          updated_at: string | null
        }
        Insert: {
          course_id: string
          created_at?: string | null
          description?: string | null
          difficulty_level?: string | null
          duration_minutes?: number | null
          id?: string
          is_published?: boolean | null
          max_attempts?: number | null
          metadata?: Json | null
          passing_score?: number | null
          shuffle_questions?: boolean | null
          title: string
          updated_at?: string | null
        }
        Update: {
          course_id?: string
          created_at?: string | null
          description?: string | null
          difficulty_level?: string | null
          duration_minutes?: number | null
          id?: string
          is_published?: boolean | null
          max_attempts?: number | null
          metadata?: Json | null
          passing_score?: number | null
          shuffle_questions?: boolean | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quizzes_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      resources: {
        Row: {
          attribution_text: string | null
          content_preview: string | null
          course_id: string
          created_at: string | null
          description: string | null
          difficulty_level: string | null
          download_count: number | null
          duration_minutes: number | null
          external_link: string | null
          file_size_bytes: number | null
          file_url: string | null
          id: string
          is_preview: boolean | null
          is_published: boolean | null
          license_type: string | null
          mime_type: string | null
          resource_type: string
          tags: string[] | null
          title: string
          updated_at: string | null
          version: string | null
          view_count: number | null
        }
        Insert: {
          attribution_text?: string | null
          content_preview?: string | null
          course_id: string
          created_at?: string | null
          description?: string | null
          difficulty_level?: string | null
          download_count?: number | null
          duration_minutes?: number | null
          external_link?: string | null
          file_size_bytes?: number | null
          file_url?: string | null
          id?: string
          is_preview?: boolean | null
          is_published?: boolean | null
          license_type?: string | null
          mime_type?: string | null
          resource_type: string
          tags?: string[] | null
          title: string
          updated_at?: string | null
          version?: string | null
          view_count?: number | null
        }
        Update: {
          attribution_text?: string | null
          content_preview?: string | null
          course_id?: string
          created_at?: string | null
          description?: string | null
          difficulty_level?: string | null
          download_count?: number | null
          duration_minutes?: number | null
          external_link?: string | null
          file_size_bytes?: number | null
          file_url?: string | null
          id?: string
          is_preview?: boolean | null
          is_published?: boolean | null
          license_type?: string | null
          mime_type?: string | null
          resource_type?: string
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          version?: string | null
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "resources_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          client_id: string
          content: string | null
          course_id: string
          created_at: string | null
          helpful_votes: number | null
          id: string
          is_anonymous: boolean | null
          is_published: boolean | null
          is_verified_purchase: boolean | null
          learning_progress: number | null
          rating: number
          review_dimensions: Json | null
          title: string | null
          unhelpful_votes: number | null
          updated_at: string | null
        }
        Insert: {
          client_id: string
          content?: string | null
          course_id: string
          created_at?: string | null
          helpful_votes?: number | null
          id?: string
          is_anonymous?: boolean | null
          is_published?: boolean | null
          is_verified_purchase?: boolean | null
          learning_progress?: number | null
          rating: number
          review_dimensions?: Json | null
          title?: string | null
          unhelpful_votes?: number | null
          updated_at?: string | null
        }
        Update: {
          client_id?: string
          content?: string | null
          course_id?: string
          created_at?: string | null
          helpful_votes?: number | null
          id?: string
          is_anonymous?: boolean | null
          is_published?: boolean | null
          is_verified_purchase?: boolean | null
          learning_progress?: number | null
          rating?: number
          review_dimensions?: Json | null
          title?: string | null
          unhelpful_votes?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
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
      subscription_plans: {
        Row: {
          access_level: string
          billing_interval: string
          created_at: string | null
          currency: string
          description: string | null
          features: Json | null
          id: string
          is_active: boolean | null
          is_public: boolean | null
          max_courses: number | null
          max_enrollments: number | null
          name: string
          price: number
          slug: string
          updated_at: string | null
        }
        Insert: {
          access_level: string
          billing_interval: string
          created_at?: string | null
          currency?: string
          description?: string | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          is_public?: boolean | null
          max_courses?: number | null
          max_enrollments?: number | null
          name: string
          price: number
          slug: string
          updated_at?: string | null
        }
        Update: {
          access_level?: string
          billing_interval?: string
          created_at?: string | null
          currency?: string
          description?: string | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          is_public?: boolean | null
          max_courses?: number | null
          max_enrollments?: number | null
          name?: string
          price?: number
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          auto_renew: boolean | null
          cancel_at_period_end: boolean | null
          cancelled_at: string | null
          client_id: string
          created_at: string | null
          currency: string
          current_period_end: string | null
          current_period_start: string | null
          id: string
          latest_payment_id: string | null
          metadata: Json | null
          next_payment_attempt: string | null
          plan_amount: number
          plan_id: string
          provider: string
          provider_subscription_id: string | null
          status: string
          trial_end: string | null
          trial_start: string | null
          updated_at: string | null
          upgraded_from_subscription_id: string | null
        }
        Insert: {
          auto_renew?: boolean | null
          cancel_at_period_end?: boolean | null
          cancelled_at?: string | null
          client_id: string
          created_at?: string | null
          currency?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          latest_payment_id?: string | null
          metadata?: Json | null
          next_payment_attempt?: string | null
          plan_amount: number
          plan_id: string
          provider: string
          provider_subscription_id?: string | null
          status?: string
          trial_end?: string | null
          trial_start?: string | null
          updated_at?: string | null
          upgraded_from_subscription_id?: string | null
        }
        Update: {
          auto_renew?: boolean | null
          cancel_at_period_end?: boolean | null
          cancelled_at?: string | null
          client_id?: string
          created_at?: string | null
          currency?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          latest_payment_id?: string | null
          metadata?: Json | null
          next_payment_attempt?: string | null
          plan_amount?: number
          plan_id?: string
          provider?: string
          provider_subscription_id?: string | null
          status?: string
          trial_end?: string | null
          trial_start?: string | null
          updated_at?: string | null
          upgraded_from_subscription_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_upgraded_from_subscription_id_fkey"
            columns: ["upgraded_from_subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
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
      user_notification_preferences: {
        Row: {
          action_types: Database["public"]["Enums"]["app_action_type"][] | null
          created_at: string | null
          entity_types: Database["public"]["Enums"]["app_entity_type"][] | null
          notification_level: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          action_types?: Database["public"]["Enums"]["app_action_type"][] | null
          created_at?: string | null
          entity_types?: Database["public"]["Enums"]["app_entity_type"][] | null
          notification_level?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          action_types?: Database["public"]["Enums"]["app_action_type"][] | null
          created_at?: string | null
          entity_types?: Database["public"]["Enums"]["app_entity_type"][] | null
          notification_level?: number | null
          updated_at?: string | null
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
      user_notifications: {
        Row: {
          action: Database["public"]["Enums"]["app_action_type"] | null
          changed_at: string | null
          changed_by: string | null
          details: Json | null
          entity_id: number | null
          entity_type: Database["public"]["Enums"]["app_entity_type"] | null
          is_read: boolean | null
          notification_id: number | null
          notification_level: number | null
          parent_entity_id: number | null
        }
        Insert: {
          action?: Database["public"]["Enums"]["app_action_type"] | null
          changed_at?: string | null
          changed_by?: string | null
          details?: Json | null
          entity_id?: number | null
          entity_type?: Database["public"]["Enums"]["app_entity_type"] | null
          is_read?: boolean | null
          notification_id?: number | null
          notification_level?: number | null
          parent_entity_id?: number | null
        }
        Update: {
          action?: Database["public"]["Enums"]["app_action_type"] | null
          changed_at?: string | null
          changed_by?: string | null
          details?: Json | null
          entity_id?: number | null
          entity_type?: Database["public"]["Enums"]["app_entity_type"] | null
          is_read?: boolean | null
          notification_id?: number | null
          notification_level?: number | null
          parent_entity_id?: number | null
        }
        Relationships: []
      }
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
      get_filtered_notifications: {
        Args: { p_user_id: string; p_limit?: number; p_offset?: number }
        Returns: {
          notification_id: number
          entity_type: Database["public"]["Enums"]["app_entity_type"]
          entity_id: number
          action: Database["public"]["Enums"]["app_action_type"]
          changed_at: string
          notification_level: number
          details: Json
        }[]
      }
      get_unread_notifications: {
        Args: { p_user_id: string; p_limit?: number; p_offset?: number }
        Returns: {
          notification_id: number
          entity_type: Database["public"]["Enums"]["app_entity_type"]
          entity_id: number
          action: Database["public"]["Enums"]["app_action_type"]
          changed_at: string
          notification_level: number
          details: Json
        }[]
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
      mark_notifications_as_read: {
        Args: {
          p_user_id: string
          p_entity_type?: Database["public"]["Enums"]["app_entity_type"]
          p_entity_id?: number
        }
        Returns: undefined
      }
      start_trial_subscription: {
        Args: { _coach_id: string }
        Returns: string
      }
      update_learning_streak: {
        Args: { _user_id: string }
        Returns: undefined
      }
      update_notification_preferences: {
        Args: {
          p_user_id: string
          p_entity_types?: Database["public"]["Enums"]["app_entity_type"][]
          p_action_types?: Database["public"]["Enums"]["app_action_type"][]
          p_notification_level?: number
        }
        Returns: undefined
      }
      validate_subscription_limits: {
        Args: { p_client_id: string; p_plan_id: string }
        Returns: undefined
      }
    }
    Enums: {
      app_action_type:
        | "INSERT"
        | "UPDATE"
        | "DELETE"
        | "PUBLISH"
        | "UNPUBLISH"
        | "ACTIVATE"
        | "DEACTIVATE"
        | "STATUS_CHANGE"
        | "METADATA_UPDATE"
        | "REORDER"
        | "CONTENT_UPDATE"
        | "PERMISSION_CHANGE"
        | "ENROLLMENT"
        | "PROGRESS_UPDATE"
        | "RATING"
        | "COMMENT_ADD"
        | "SUBSCRIPTION_CHANGE"
      app_entity_type:
        | "COURSE"
        | "MODULE"
        | "LESSON"
        | "SECTION"
        | "QUIZ"
        | "ASSIGNMENT"
        | "RESOURCE"
        | "USER_PROFILE"
        | "USER_ENROLLMENT"
        | "USER_PROGRESS"
        | "DISCUSSION"
        | "COMMENT"
        | "REVIEW"
        | "SUBSCRIPTION"
        | "PAYMENT"
        | "ACCESS_GRANT"
        | "CONTENT_BLOCK"
        | "MEDIA_ASSET"
        | "SYSTEM_CONFIG"
        | "NOTIFICATION_PREFERENCE"
      app_role: "admin" | "coach" | "client"
      content_type: "video" | "audio" | "text" | "pdf" | "image" | "interactive"
      course_action_type:
        | "INSERT"
        | "UPDATE"
        | "DELETE"
        | "PUBLISH"
        | "UNPUBLISH"
        | "STATUS_CHANGE"
        | "METADATA_UPDATE"
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
      app_action_type: [
        "INSERT",
        "UPDATE",
        "DELETE",
        "PUBLISH",
        "UNPUBLISH",
        "ACTIVATE",
        "DEACTIVATE",
        "STATUS_CHANGE",
        "METADATA_UPDATE",
        "REORDER",
        "CONTENT_UPDATE",
        "PERMISSION_CHANGE",
        "ENROLLMENT",
        "PROGRESS_UPDATE",
        "RATING",
        "COMMENT_ADD",
        "SUBSCRIPTION_CHANGE",
      ],
      app_entity_type: [
        "COURSE",
        "MODULE",
        "LESSON",
        "SECTION",
        "QUIZ",
        "ASSIGNMENT",
        "RESOURCE",
        "USER_PROFILE",
        "USER_ENROLLMENT",
        "USER_PROGRESS",
        "DISCUSSION",
        "COMMENT",
        "REVIEW",
        "SUBSCRIPTION",
        "PAYMENT",
        "ACCESS_GRANT",
        "CONTENT_BLOCK",
        "MEDIA_ASSET",
        "SYSTEM_CONFIG",
        "NOTIFICATION_PREFERENCE",
      ],
      app_role: ["admin", "coach", "client"],
      content_type: ["video", "audio", "text", "pdf", "image", "interactive"],
      course_action_type: [
        "INSERT",
        "UPDATE",
        "DELETE",
        "PUBLISH",
        "UNPUBLISH",
        "STATUS_CHANGE",
        "METADATA_UPDATE",
      ],
      delivery_type: ["self_paced", "instructor_led"],
      payment_status: ["pending", "completed", "failed", "refunded"],
      pricing_model: ["one_time", "subscription"],
      subscription_status: ["active", "inactive", "trial", "expired"],
    },
  },
} as const
