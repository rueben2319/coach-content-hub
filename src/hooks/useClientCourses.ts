
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  difficulty_level: string;
  category_id: string;
  is_published: boolean;
  coach: {
    first_name: string;
    last_name: string;
  };
}

export const usePublishedCourses = () => {
  console.log('usePublishedCourses hook called');
  
  return useQuery({
    queryKey: ['published-courses'],
    queryFn: async () => {
      console.log('Starting to fetch published courses...');
      
      try {
        const { data, error } = await supabase
          .from('courses')
          .select(`
            id,
            title,
            description,
            price,
            difficulty_level,
            category_id,
            is_published,
            coach:profiles!coach_id (
              first_name,
              last_name
            )
          `)
          .eq('is_published', true)
          .order('created_at', { ascending: false });

        console.log('Supabase query result:');
        console.log('- data:', data);
        console.log('- error:', error);
        console.log('- data length:', data?.length);

        if (error) {
          console.error('Supabase query error:', error);
          throw error;
        }
        
        console.log('Successfully fetched courses:', data?.length || 0);
        return (data || []) as Course[];
      } catch (err) {
        console.error('Error in queryFn:', err);
        throw err;
      }
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
          difficulty_level,
          category_id,
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
