
import { supabase } from "@/integrations/supabase/client";

export interface CourseContent {
  id: string;
  title: string;
  description: string | null;
  content_type: 'video' | 'audio' | 'text' | 'pdf' | 'image' | 'interactive';
  content_url: string | null;
  content_text: string | null;
  duration: number | null;
  sort_order: number;
  is_preview: boolean;
  chapter_id?: string | null;
  scheduled_publish_at?: string | null;
  auto_publish?: boolean;
  version_id?: string | null;
  prerequisites?: string[];
}

export const fetchCourseContent = async (courseId: string, chapterId?: string) => {
  let query = supabase
    .from('course_content')
    .select('*')
    .eq('course_id', courseId)
    .order('sort_order');

  if (chapterId) {
    query = query.eq('chapter_id', chapterId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as CourseContent[];
};

export const addOrUpdateCourseContent = async (
  formData: Omit<Partial<CourseContent>, 'id' | 'sort_order'> & { 
    course_id: string; 
    title: string; 
    content_type: CourseContent['content_type'];
  },
  content?: CourseContent
) => {
  let newSortOrder = 0;

  if (!content) {
    // New content: calculate new sort_order = max+1
    let query = supabase
      .from('course_content')
      .select('sort_order')
      .eq('course_id', formData.course_id)
      .order('sort_order', { ascending: false })
      .limit(1);

    // If chapter_id is specified, filter by chapter
    if (formData.chapter_id) {
      query = query.eq('chapter_id', formData.chapter_id);
    }

    const { data: maxOrderData, error: maxOrderError } = await query;

    if (maxOrderError) throw maxOrderError;
    if (Array.isArray(maxOrderData) && maxOrderData.length > 0) {
      newSortOrder = (maxOrderData[0].sort_order ?? 0) + 1;
    }
  }

  const {
    title,
    description,
    content_type,
    content_url,
    content_text,
    duration,
    is_preview,
    course_id,
    chapter_id,
    scheduled_publish_at,
    auto_publish,
    prerequisites,
  } = formData;

  // Enhanced content data object
  const contentData = {
    title,
    description: description ?? null,
    content_type,
    content_url: content_url ?? null,
    content_text: content_text ?? null,
    duration: typeof duration === "number" ? duration : null,
    is_preview: !!is_preview,
    course_id,
    chapter_id: chapter_id ?? null,
    scheduled_publish_at: scheduled_publish_at ?? null,
    auto_publish: auto_publish ?? false,
    prerequisites: prerequisites ?? [],
    sort_order: content ? content.sort_order : newSortOrder,
  };

  if (content) {
    const { error } = await supabase
      .from('course_content')
      .update(contentData)
      .eq('id', content.id);
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from('course_content')
      .insert([contentData]);
    if (error) throw error;
  }
};

export const deleteCourseContent = async (contentId: string) => {
  const { error } = await supabase
    .from('course_content')
    .delete()
    .eq('id', contentId);
  if (error) throw error;
};

export const reorderCourseContent = async (contentId: string, newOrder: number) => {
  const { error } = await supabase
    .from('course_content')
    .update({ sort_order: newOrder })
    .eq('id', contentId);
  if (error) throw error;
};

export const duplicateContent = async (contentId: string, targetCourseId?: string, targetChapterId?: string) => {
  // First, get the original content
  const { data: originalContent, error: fetchError } = await supabase
    .from('course_content')
    .select('*')
    .eq('id', contentId)
    .single();

  if (fetchError) throw fetchError;

  // Calculate new sort order
  const courseId = targetCourseId || originalContent.course_id;
  let query = supabase
    .from('course_content')
    .select('sort_order')
    .eq('course_id', courseId)
    .order('sort_order', { ascending: false })
    .limit(1);

  if (targetChapterId) {
    query = query.eq('chapter_id', targetChapterId);
  }

  const { data: maxOrderData, error: maxOrderError } = await query;
  if (maxOrderError) throw maxOrderError;

  const newSortOrder = maxOrderData && maxOrderData.length > 0 
    ? (maxOrderData[0].sort_order ?? 0) + 1 
    : 0;

  // Create duplicate with new data
  const duplicateData = {
    ...originalContent,
    id: undefined, // Let the database generate a new ID
    title: `${originalContent.title} (Copy)`,
    course_id: courseId,
    chapter_id: targetChapterId || originalContent.chapter_id,
    sort_order: newSortOrder,
    is_published: false, // Start as draft
    created_at: undefined,
    updated_at: undefined,
  };

  const { data, error } = await supabase
    .from('course_content')
    .insert([duplicateData])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const bulkUpdateContentStatus = async (contentIds: string[], updates: Partial<CourseContent>) => {
  const { error } = await supabase
    .from('course_content')
    .update(updates)
    .in('id', contentIds);

  if (error) throw error;
};
