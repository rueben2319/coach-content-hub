
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface ContentTemplate {
  id: string;
  name: string;
  description?: string;
  template_data: any;
  content_type: string;
  created_by: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export const useContentTemplates = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['content-templates', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content_templates')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as ContentTemplate[];
    },
    enabled: !!user?.id,
  });
};

export const useCreateContentTemplate = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (templateData: Omit<ContentTemplate, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('content_templates')
        .insert([templateData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({ title: 'Template created successfully!' });
      queryClient.invalidateQueries({ queryKey: ['content-templates'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Error creating template',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};
