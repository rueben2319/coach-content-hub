
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Plus, ArrowLeft, BarChart3, Layers, Settings } from 'lucide-react';
import EnhancedCourseContentForm from './EnhancedCourseContentForm';
import CourseContentList from './CourseContentList';
import ChapterManager from './ChapterManager';
import ContentAnalyticsDashboard from './ContentAnalyticsDashboard';
import ScheduledPublishingControls from './ScheduledPublishingControls';
import { fetchCourseContent } from './courseContentApi';

interface CourseContentManagerProps {
  courseId: string;
  onBack: () => void;
}

const CourseContentManager: React.FC<CourseContentManagerProps> = ({ courseId, onBack }) => {
  const { toast } = useToast();
  const [showContentForm, setShowContentForm] = useState(false);
  const [editingContent, setEditingContent] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState<string>('');
  const [activeTab, setActiveTab] = useState('content');

  const { data: courseContent, isLoading, refetch } = useQuery({
    queryKey: ['course-content', courseId, selectedChapter],
    queryFn: () => fetchCourseContent(courseId, selectedChapter || undefined),
  });

  // Fetch course details for publishing controls
  const { data: courseDetails } = useQuery({
    queryKey: ['course-details', courseId],
    queryFn: async () => {
      const { supabase } = await import('@/integrations/supabase/client');
      const { data, error } = await supabase
        .from('courses')
        .select('scheduled_publish_at, auto_publish, publish_status')
        .eq('id', courseId)
        .single();
      
      if (error) throw error;
      return data;
    },
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

  const handleChapterSelect = (chapterId: string) => {
    setSelectedChapter(chapterId);
    setActiveTab('content'); // Switch to content tab when chapter is selected
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="min-w-0">
          <h2 className="text-xl sm:text-2xl font-bold break-words">Advanced Course Content</h2>
          <p className="text-sm sm:text-base text-gray-600">
            Create, organize, and manage your course content with advanced features
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onBack} className="w-full sm:w-auto order-2 sm:order-1">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Course
          </Button>
          {!showContentForm && (
            <Button onClick={() => setShowContentForm(true)} className="w-full sm:w-auto order-1 sm:order-2">
              <Plus className="h-4 w-4 mr-2" />
              Add Content
            </Button>
          )}
        </div>
      </div>

      {showContentForm ? (
        <EnhancedCourseContentForm
          courseId={courseId}
          content={editingContent}
          onSuccess={handleSuccess}
          onCancel={handleContentFormClose}
        />
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="content" className="flex items-center gap-2">
              <Layers className="h-4 w-4" />
              Content
            </TabsTrigger>
            <TabsTrigger value="chapters" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Chapters
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="publishing" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Publishing
            </TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-4">
            {selectedChapter && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Showing content for selected chapter
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedChapter('')}
                    >
                      Show All Content
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {isLoading ? (
              <div className="flex justify-center p-8">
                <div className="text-gray-500">Loading course content...</div>
              </div>
            ) : (
              <CourseContentList
                courseId={courseId}
                courseContent={courseContent || []}
                onEdit={handleEditContent}
                onAdd={() => setShowContentForm(true)}
                invalidateContent={refetch}
              />
            )}
          </TabsContent>

          <TabsContent value="chapters">
            <ChapterManager
              courseId={courseId}
              onContentSelect={handleChapterSelect}
            />
          </TabsContent>

          <TabsContent value="analytics">
            <ContentAnalyticsDashboard courseId={courseId} />
          </TabsContent>

          <TabsContent value="publishing">
            <div className="space-y-6">
              <ScheduledPublishingControls
                courseId={courseId}
                currentSchedule={courseDetails}
                onScheduleUpdate={() => {
                  // Refresh course details
                  refetch();
                }}
              />
              
              <Card>
                <CardHeader>
                  <CardTitle>Bulk Operations</CardTitle>
                  <CardDescription>
                    Manage multiple content items at once
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Button variant="outline" className="w-full">
                      Publish All Content
                    </Button>
                    <Button variant="outline" className="w-full">
                      Schedule All
                    </Button>
                    <Button variant="outline" className="w-full">
                      Export Content
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default CourseContentManager;
