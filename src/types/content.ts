// Content type enum to match database schema
export enum ContentType {
  VIDEO = 'video',
  AUDIO = 'audio',
  TEXT = 'text',
  PDF = 'pdf',
  IMAGE = 'image',
  INTERACTIVE = 'interactive',
}

// Content type union type for TypeScript
export type ContentTypeUnion = 'video' | 'audio' | 'text' | 'pdf' | 'image' | 'interactive';

// Section interface matching database schema
export interface Section {
  id: string;
  lesson_id: string;
  title: string;
  content_type: ContentTypeUnion;
  content_url: string | null;
  content_text: string | null;
  duration: number | null;
  sort_order: number;
  is_preview: boolean;
  is_free: boolean;
  content: any;
  created_at: string;
  updated_at: string;
}

// Lesson interface matching database schema
export interface Lesson {
  id: string;
  module_id: string;
  title: string;
  description: string | null;
  sort_order: number;
  is_published: boolean;
  unlock_after_days: number | null;
  created_at: string;
  updated_at: string;
}

// Module interface matching database schema
export interface Module {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  sort_order: number;
  is_published: boolean;
  unlock_after_days: number | null;
  created_at: string;
  updated_at: string;
}

// Complete course structure with nested content
export interface CourseWithContent {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  sort_order: number;
  is_published: boolean;
  unlock_after_days: number | null;
  created_at: string;
  updated_at: string;
  lessons: (Lesson & {
    sections: Section[];
  })[];
}

// Content creation/update form data
export interface SectionFormData {
  title: string;
  content_type: ContentTypeUnion;
  content_url: string;
  content_text: string;
  duration: number | null;
  is_preview: boolean;
  is_free: boolean;
  content?: any;
}

export interface LessonFormData {
  title: string;
  description: string;
  unlock_after_days: number | null;
  is_published: boolean;
}

export interface ModuleFormData {
  title: string;
  description: string;
  unlock_after_days: number | null;
  is_published: boolean;
} 