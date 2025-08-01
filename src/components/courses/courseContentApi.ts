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

// ===== MODULE FUNCTIONS =====

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

export const addOrUpdateModule = async (
  formData: Omit<Partial<Module>, 'id' | 'sort_order'> & { 
    course_id: string; 
    title: string; 
  },
  module?: Module
) => {
  let newSortOrder = 0;

  if (!module) {
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
    sort_order: module ? module.sort_order : newSortOrder,
    is_published: formData.is_published ?? false,
    unlock_after_days: formData.unlock_after_days ?? null,
  };

  if (module) {
    // Update existing content
    const { error } = await supabase
      .from('modules')
      .update(moduleData)
      .eq('id', module.id);
    if (error) throw error;
  } else {
    // Insert new content
    const { error } = await supabase
      .from('modules')
      .insert([moduleData]);
    if (error) throw error;
  }
};

// Legacy function - keeping for backward compatibility
export const addOrUpdateCourseContent = async (
  formData: Omit<Partial<CourseContent>, 'id' | 'sort_order'> & { 
    course_id: string; 
    title: string; 
  },
  content?: CourseContent
) => {
  return await addOrUpdateModule(formData, content);
};

export const deleteModule = async (moduleId: string) => {
  const { error } = await supabase
    .from('modules')
    .delete()
    .eq('id', moduleId);
  if (error) throw error;
};

// Legacy function - keeping for backward compatibility
export const deleteCourseContent = async (contentId: string) => {
  return await deleteModule(contentId);
};

export const reorderModule = async (moduleId: string, newOrder: number) => {
  const { error } = await supabase
    .from('modules')
    .update({ sort_order: newOrder })
    .eq('id', moduleId);
  if (error) throw error;
};

// Legacy function - keeping for backward compatibility
export const reorderCourseContent = async (contentId: string, newOrder: number) => {
  return await reorderModule(contentId, newOrder);
};

// ===== LESSON FUNCTIONS =====

export const fetchModuleLessons = async (moduleId: string) => {
  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('module_id', moduleId)
    .order('sort_order');

  if (error) throw error;
  return data as Lesson[];
};

export const addOrUpdateLesson = async (
  formData: Omit<Partial<Lesson>, 'id' | 'sort_order'> & { 
    module_id: string; 
    title: string; 
  },
  lesson?: Lesson
) => {
  let newSortOrder = 0;

  if (!lesson) {
    // Get the highest sort_order for new lesson
    const { data: maxOrderData, error: maxOrderError } = await supabase
      .from('lessons')
      .select('sort_order')
      .eq('module_id', formData.module_id)
      .order('sort_order', { ascending: false })
      .limit(1);

    if (maxOrderError) throw maxOrderError;
    if (Array.isArray(maxOrderData) && maxOrderData.length > 0) {
      newSortOrder = (maxOrderData[0].sort_order ?? 0) + 1;
    }
  }

  const lessonData = {
    title: formData.title,
    description: formData.description ?? null,
    module_id: formData.module_id,
    sort_order: lesson ? lesson.sort_order : newSortOrder,
    is_published: formData.is_published ?? false,
    unlock_after_days: formData.unlock_after_days ?? null,
  };

  if (lesson) {
    // Update existing lesson
    const { error } = await supabase
      .from('lessons')
      .update(lessonData)
      .eq('id', lesson.id);
    if (error) throw error;
  } else {
    // Insert new lesson
    const { error } = await supabase
      .from('lessons')
      .insert([lessonData]);
    if (error) throw error;
  }
};

export const deleteLesson = async (lessonId: string) => {
  const { error } = await supabase
    .from('lessons')
    .delete()
    .eq('id', lessonId);
  if (error) throw error;
};

export const reorderLesson = async (lessonId: string, newOrder: number) => {
  const { error } = await supabase
    .from('lessons')
    .update({ sort_order: newOrder })
    .eq('id', lessonId);
  if (error) throw error;
};

// ===== SECTION FUNCTIONS =====

export const fetchLessonSections = async (lessonId: string) => {
  const { data, error } = await supabase
    .from('sections')
    .select('*')
    .eq('lesson_id', lessonId)
    .order('sort_order');

  if (error) throw error;
  return data as Section[];
};

export const addOrUpdateSection = async (
  formData: Omit<Partial<Section>, 'id' | 'sort_order'> & { 
    lesson_id: string; 
    title: string; 
  },
  section?: Section
) => {
  let newSortOrder = 0;

  if (!section) {
    // Get the highest sort_order for new section
    const { data: maxOrderData, error: maxOrderError } = await supabase
      .from('sections')
      .select('sort_order')
      .eq('lesson_id', formData.lesson_id)
      .order('sort_order', { ascending: false })
      .limit(1);

    if (maxOrderError) throw maxOrderError;
    if (Array.isArray(maxOrderData) && maxOrderData.length > 0) {
      newSortOrder = (maxOrderData[0].sort_order ?? 0) + 1;
    }
  }

  const sectionData = {
    title: formData.title,
    content_type: formData.content_type,
    content_url: formData.content_url ?? null,
    content_text: formData.content_text ?? null,
    duration: formData.duration ?? null,
    lesson_id: formData.lesson_id,
    sort_order: section ? section.sort_order : newSortOrder,
    is_preview: formData.is_preview ?? false,
    is_free: formData.is_free ?? false,
    content: formData.content ?? {},
  };

  if (section) {
    // Update existing section
    const { error } = await supabase
      .from('sections')
      .update(sectionData)
      .eq('id', section.id);
    if (error) throw error;
  } else {
    // Insert new section
    const { error } = await supabase
      .from('sections')
      .insert([sectionData]);
    if (error) throw error;
  }
};

export const deleteSection = async (sectionId: string) => {
  const { error } = await supabase
    .from('sections')
    .delete()
    .eq('id', sectionId);
  if (error) throw error;
};

export const reorderSection = async (sectionId: string, newOrder: number) => {
  const { error } = await supabase
    .from('sections')
    .update({ sort_order: newOrder })
    .eq('id', sectionId);
  if (error) throw error;
};

// ===== COMPREHENSIVE FETCH FUNCTIONS =====

export const fetchCourseWithContent = async (courseId: string) => {
  const { data, error } = await supabase
    .from('modules')
    .select(`
      *,
      lessons (
        *,
        sections (*)
      )
    `)
    .eq('course_id', courseId)
    .order('sort_order');

  if (error) throw error;
  return data;
};

// ===== LEGACY FUNCTIONS (for backward compatibility) =====

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