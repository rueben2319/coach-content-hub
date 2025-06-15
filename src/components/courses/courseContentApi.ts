
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
}

export const fetchCourseContent = async (courseId: string) => {
  const { data, error } = await supabase
    .from('course_content')
    .select('*')
    .eq('course_id', courseId)
    .order('sort_order');
  if (error) throw error;
  return data as CourseContent[];
};

export const addOrUpdateCourseContent = async (
  formData: Partial<CourseContent> & { course_id: string }, 
  content?: CourseContent
) => {
  let newSortOrder = 0;
  if (!content) {
    const { data: maxOrderData, error: maxOrderError } = await supabase
      .from('course_content')
      .select('sort_order')
      .eq('course_id', formData.course_id)
      .order('sort_order', { ascending: false })
      .limit(1);

    if (maxOrderError) throw maxOrderError;
    if (Array.isArray(maxOrderData) && maxOrderData.length > 0) {
      newSortOrder = (maxOrderData[0].sort_order ?? 0) + 1;
    }
  }

  const contentData = {
    ...formData,
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
