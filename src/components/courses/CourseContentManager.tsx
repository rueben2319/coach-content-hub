import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Edit, Trash2, GripVertical, FileUp, ArrowUp, ArrowDown } from 'lucide-react';
import FileUpload from './FileUpload';
import CourseContentForm from './CourseContentForm';
import CourseContentList from './CourseContentList';
import { fetchCourseContent } from './courseContentApi';

interface CourseContent {
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

interface CourseContentManagerProps {
  courseId: string;
  onBack: () => void;
}

const CourseContentManager: React.FC<CourseContentManagerProps> = ({ courseId, onBack }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showContentForm, setShowContentForm] = useState(false);
  const [editingContent, setEditingContent] = useState(null);

  const { data: courseContent, isLoading, refetch } = useQuery({
    queryKey: ['course-content', courseId],
    queryFn: () => fetchCourseContent(courseId),
  });

  const handleEditContent = (content) => {
    setEditingContent(content);
    setShowContentForm(true);
  };

  const handleContentFormClose = () => {
    setShowContentForm(false);
    setEditingContent(null);
  };

  const handleSuccess = () => {
    handleContentFormClose();
    refetch();
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="min-w-0">
          <h2 className="text-xl sm:text-2xl font-bold break-words">Course Content</h2>
          <p className="text-sm sm:text-base text-gray-600">Manage your course lessons and materials</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onBack} className="w-full sm:w-auto order-2 sm:order-1">
            Back to Course
          </Button>
          <Button onClick={() => setShowContentForm(true)} className="w-full sm:w-auto order-1 sm:order-2">
            <Plus className="h-4 w-4 mr-2" />
            Add Content
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8">Loading course content...</div>
      ) : showContentForm ? (
        <CourseContentForm
          courseId={courseId}
          content={editingContent}
          onSuccess={handleSuccess}
          onCancel={handleContentFormClose}
        />
      ) : (
        <CourseContentList
          courseId={courseId}
          courseContent={courseContent || []}
          onEdit={handleEditContent}
          onAdd={() => setShowContentForm(true)}
          invalidateContent={refetch}
        />
      )}
    </div>
  );
};

export default CourseContentManager;
