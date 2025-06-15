
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Plus, ArrowLeft } from 'lucide-react';
import EnhancedCourseContentForm from './EnhancedCourseContentForm';
import CourseContentList from './CourseContentList';
import { fetchCourseContent } from './courseContentApi';

interface CourseContentManagerProps {
  courseId: string;
  onBack: () => void;
}

const CourseContentManager: React.FC<CourseContentManagerProps> = ({ courseId, onBack }) => {
  const { toast } = useToast();
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
          <h2 className="text-xl sm:text-2xl font-bold break-words">Enhanced Course Content</h2>
          <p className="text-sm sm:text-base text-gray-600">Create engaging lessons with our enhanced content builder</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onBack} className="w-full sm:w-auto order-2 sm:order-1">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Course
          </Button>
          <Button onClick={() => setShowContentForm(true)} className="w-full sm:w-auto order-1 sm:order-2">
            <Plus className="h-4 w-4 mr-2" />
            Add Content
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8">
          <div className="text-gray-500">Loading course content...</div>
        </div>
      ) : showContentForm ? (
        <EnhancedCourseContentForm
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
