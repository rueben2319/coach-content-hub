
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ContentVersion {
  id: string;
  content_id: string;
  version_number: number;
  title: string;
  content_text?: string;
  content_url?: string;
  description?: string;
  created_by: string;
  created_at: string;
  is_published: boolean;
  change_notes?: string;
}

export const useContentVersions = (contentId: string) => {
  return useQuery({
    queryKey: ['content-versions', contentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content_versions')
        .select('*')
        .eq('content_id', contentId)
        .order('version_number', { ascending: false });
      
      if (error) throw error;
      return data as ContentVersion[];
    },
    enabled: !!contentId,
  });
};

export const useCreateContentVersion = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (versionData: Omit<ContentVersion, 'id' | 'created_at' | 'version_number'>) => {
      // Get the next version number
      const { data: versions, error: versionError } = await supabase
        .from('content_versions')
        .select('version_number')
        .eq('content_id', versionData.content_id)
        .order('version_number', { ascending: false })
        .limit(1);

      if (versionError) throw versionError;

      const nextVersion = versions && versions.length > 0 ? versions[0].version_number + 1 : 1;

      const { data, error } = await supabase
        .from('content_versions')
        .insert([{ ...versionData, version_number: nextVersion }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({ title: 'Version created successfully!' });
      queryClient.invalidateQueries({ queryKey: ['content-versions'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Error creating version',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};
