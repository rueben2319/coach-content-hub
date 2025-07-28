import { supabase } from "@/integrations/supabase/client";

export const fetchModules = async (courseId: string, lessonId?: string) => {
  let query = supabase
    .from('modules' as any)
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

export const addOrUpdateModule = async (formData: any, module?: any) => {
  let newSortOrder = 0;

  if (!module) {
    const { data: maxOrderData, error: maxOrderError } = await supabase
      .from('modules' as any)
      .select('sort_order')
      .eq('course_id', formData.course_id)
      .order('sort_order', { ascending: false })
      .limit(1);

    if (maxOrderError) throw maxOrderError;
    if (Array.isArray(maxOrderData) && maxOrderData.length > 0) {
      newSortOrder = ((maxOrderData[0] as any).sort_order ?? 0) + 1;
    }
  }

  const moduleData = {
    title: formData.title,
    description: formData.description ?? null,
    content_type: formData.content_type,
    content_url: formData.content_url ?? null,
    content_text: formData.content_text ?? null,
    duration: typeof formData.duration === "number" ? formData.duration : null,
    is_preview: !!formData.is_preview,
    course_id: formData.course_id,
    lesson_id: formData.lesson_id ?? null,
    sort_order: module ? module.sort_order : newSortOrder,
  };

  if (module) {
    const { error } = await supabase
      .from('modules' as any)
      .update(moduleData)
      .eq('id', module.id);
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from('modules' as any)
      .insert([moduleData]);
    if (error) throw error;
  }
};

export const deleteModule = async (moduleId: string) => {
  const { error } = await supabase
    .from('modules' as any)
    .delete()
    .eq('id', moduleId);
  if (error) throw error;
};