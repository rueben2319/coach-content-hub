
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  estimated_duration: number;
  difficulty_level: string;
  category: string;
  thumbnail_url: string;
  is_published: boolean;
  coach: {
    first_name: string;
    last_name: string;
  };
}

export const usePublishedCourses = () => {
  return useQuery({
    queryKey: ['published-courses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select(`
          id,
          title,
          description,
          price,
          currency,
          estimated_duration,
          difficulty_level,
          category,
          thumbnail_url,
          is_published,
          coach:profiles!coach_id (
            first_name,
            last_name
          )
        `)
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as Course[];
    },
  });
};

export const useCourse = (courseId: string) => {
  return useQuery({
    queryKey: ['course', courseId],
    queryFn: async () => {
      if (!courseId) throw new Error('Course ID is required');

      const { data, error } = await supabase
        .from('courses')
        .select(`
          id,
          title,
          description,
          price,
          currency,
          estimated_duration,
          difficulty_level,
          category,
          thumbnail_url,
          is_published,
          coach:profiles!coach_id (
            first_name,
            last_name
          )
        `)
        .eq('id', courseId)
        .single();

      if (error) throw error;
      return data as Course;
    },
    enabled: !!courseId,
  });
};
