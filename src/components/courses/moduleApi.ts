import { supabase } from "@/integrations/supabase/client";

export const fetchModules = async (courseId: string, lessonId?: string) => {
  let query = supabase
    .from('modules')
    .select('*')
    .eq('course_id', courseId)
    .order('sort_order');

  if (lessonId) {
    query = query.eq('lesson_id', lessonId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
};

export const addOrUpdateModule = async (
  formData: any,
  module?: any
) => {
  let newSortOrder = 0;

  if (!module) {
    // New module: calculate new sort_order = max+1
    let query = supabase
      .from('modules')
      .select('sort_order')
      .eq('course_id', formData.course_id)
      .order('sort_order', { ascending: false })
      .limit(1);

    // If lesson_id is specified, filter by lesson
    if (formData.lesson_id) {
      query = query.eq('lesson_id', formData.lesson_id);
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
    lesson_id,
    scheduled_publish_at,
    auto_publish,
    prerequisites,
  } = formData;

  // Enhanced module data object
  const moduleData = {
    title,
    description: description ?? null,
    content_type,
    content_url: content_url ?? null,
    content_text: content_text ?? null,
    duration: typeof duration === "number" ? duration : null,
    is_preview: !!is_preview,
    course_id,
    lesson_id: lesson_id ?? null,
    scheduled_publish_at: scheduled_publish_at ?? null,
    auto_publish: auto_publish ?? false,
    prerequisites: prerequisites ?? [],
    sort_order: module ? module.sort_order : newSortOrder,
  };

  if (module) {
    const { error } = await supabase
      .from('modules')
      .update(moduleData)
      .eq('id', module.id);
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from('modules')
      .insert([moduleData]);
    if (error) throw error;
  }
};

export const deleteModule = async (moduleId: string) => {
  const { error } = await supabase
    .from('modules')
    .delete()
    .eq('id', moduleId);
  if (error) throw error;
};

export const reorderModule = async (moduleId: string, newOrder: number) => {
  const { error } = await supabase
    .from('modules')
    .update({ sort_order: newOrder })
    .eq('id', moduleId);
  if (error) throw error;
};

export const duplicateModule = async (moduleId: string, targetCourseId?: string, targetLessonId?: string) => {
  // First, get the original module
  const { data: originalModule, error: fetchError } = await supabase
    .from('modules')
    .select('*')
    .eq('id', moduleId)
    .single();

  if (fetchError) throw fetchError;

  // Calculate new sort order
  const courseId = targetCourseId || originalModule.course_id;
  let query = supabase
    .from('modules')
    .select('sort_order')
    .eq('course_id', courseId)
    .order('sort_order', { ascending: false })
    .limit(1);

  if (targetLessonId) {
    query = query.eq('lesson_id', targetLessonId);
  }

  const { data: maxOrderData, error: maxOrderError } = await query;
  if (maxOrderError) throw maxOrderError;

  const newSortOrder = maxOrderData && maxOrderData.length > 0 
    ? (maxOrderData[0].sort_order ?? 0) + 1 
    : 0;

  // Create duplicate with new data
  const duplicateData = {
    ...originalModule,
    id: undefined, // Let the database generate a new ID
    title: `${originalModule.title} (Copy)`,
    course_id: courseId,
    lesson_id: targetLessonId || null,
    sort_order: newSortOrder,
    is_published: false, // Start as draft
    created_at: undefined,
    updated_at: undefined,
  };

  const { data, error } = await supabase
    .from('modules')
    .insert([duplicateData])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const bulkUpdateModuleStatus = async (moduleIds: string[], updates: any) => {
  const { error } = await supabase
    .from('modules')
    .update(updates)
    .in('id', moduleIds);

  if (error) throw error;
};