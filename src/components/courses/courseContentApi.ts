import { supabase } from "@/integrations/supabase/client";

// Updated interface to match the new database schema
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

export interface Section {
  id: string;
  lesson_id: string;
  title: string;
  content_type: 'video' | 'audio' | 'text' | 'pdf' | 'image' | 'interactive';
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

// Legacy interface for backward compatibility - gradually being phased out
export interface CourseContent extends Module {
  content_type?: 'video' | 'audio' | 'text' | 'pdf' | 'image' | 'interactive';
  content_url?: string | null;
  content_text?: string | null;
  duration?: number | null;
  is_preview?: boolean;
  chapter_id?: string | null;
  scheduled_publish_at?: string | null;
  auto_publish?: boolean;
  prerequisites?: string[];
}

export const fetchCourseModules = async (courseId: string) => {
  const { data, error } = await supabase
    .from('modules')
    .select('*')
    .eq('course_id', courseId)
    .order('sort_order');

  if (error) throw error;
  return data as Module[];
};

// Legacy function - keeping for backward compatibility
export const fetchCourseContent = async (courseId: string) => {
  return await fetchCourseModules(courseId);
};

export const addOrUpdateCourseContent = async (
  formData: Omit<Partial<CourseContent>, 'id' | 'sort_order'> & { 
    course_id: string; 
    title: string; 
  },
  content?: CourseContent
) => {
  let newSortOrder = 0;

  if (!content) {
    // Get the highest sort_order for new content
    const { data: maxOrderData, error: maxOrderError } = await supabase
      .from('modules')
      .select('sort_order')
      .eq('course_id', formData.course_id)
      .order('sort_order', { ascending: false })
      .limit(1);

    if (maxOrderError) throw maxOrderError;
    if (Array.isArray(maxOrderData) && maxOrderData.length > 0) {
      newSortOrder = (maxOrderData[0].sort_order ?? 0) + 1;
    }
  }

  const moduleData = {
    title: formData.title,
    description: formData.description ?? null,
    course_id: formData.course_id,
    sort_order: content ? content.sort_order : newSortOrder,
    is_published: formData.is_published ?? false,
    unlock_after_days: formData.unlock_after_days ?? null,
  };

  if (content) {
    // Update existing content
    const { error } = await supabase
      .from('modules')
      .update(moduleData)
      .eq('id', content.id);
    if (error) throw error;
  } else {
    // Insert new content
    const { error } = await supabase
      .from('modules')
      .insert([moduleData]);
    if (error) throw error;
  }
};

export const deleteCourseContent = async (contentId: string) => {
  const { error } = await supabase
    .from('modules')
    .delete()
    .eq('id', contentId);
  if (error) throw error;
};

export const reorderCourseContent = async (contentId: string, newOrder: number) => {
  const { error } = await supabase
    .from('modules')
    .update({ sort_order: newOrder })
    .eq('id', contentId);
  if (error) throw error;
};

export const duplicateContent = async (
  contentId: string, 
  targetCourseId?: string
): Promise<CourseContent> => {
  // Get the original content
  const { data: originalContent, error: fetchError } = await supabase
    .from('modules')
    .select('*')
    .eq('id', contentId)
    .single();

  if (fetchError) throw fetchError;

  const courseId = targetCourseId || originalContent.course_id;

  // Get the highest sort_order for the target course
  const { data: maxOrderData, error: maxOrderError } = await supabase
    .from('modules')
    .select('sort_order')
    .eq('course_id', courseId)
    .order('sort_order', { ascending: false })
    .limit(1);

  if (maxOrderError) throw maxOrderError;

  const newSortOrder = Array.isArray(maxOrderData) && maxOrderData.length > 0
    ? (maxOrderData[0].sort_order ?? 0) + 1
    : 0;

  // Create duplicate with new title and sort order
  const duplicateData = {
    ...originalContent,
    id: undefined, // Let the database generate a new ID
    title: `${originalContent.title} (Copy)`,
    course_id: courseId,
    sort_order: newSortOrder,
    created_at: undefined,
    updated_at: undefined,
  };

  const { data, error } = await supabase
    .from('modules')
    .insert([duplicateData])
    .select()
    .single();

  if (error) throw error;
  return data as CourseContent;
};

export const bulkUpdateContentStatus = async (
  contentIds: string[], 
  updates: Partial<CourseContent>
) => {
  const { error } = await supabase
    .from('modules')
    .update(updates)
    .in('id', contentIds);
  
  if (error) throw error;
};