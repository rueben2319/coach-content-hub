import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Plus, ArrowLeft, BarChart3, Layers, Settings } from 'lucide-react';
import EnhancedLessonForm from './EnhancedLessonForm';
import LessonList from './LessonList';
import ContentAnalyticsDashboard from './ContentAnalyticsDashboard';
import ScheduledPublishingControls from './ScheduledPublishingControls';
import { fetchCourseModules } from './courseContentApi';

interface LessonManagerProps {
  courseId: string;
  onBack: () => void;
}

const LessonManager: React.FC<LessonManagerProps> = ({ courseId, onBack }) => {
  const { toast } = useToast();
  const [showLessonForm, setShowLessonForm] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [selectedModule, setSelectedModule] = useState<string>('');
  const [activeTab, setActiveTab] = useState('lessons');

  const { data: modules, isLoading, refetch } = useQuery({
    queryKey: ['course-modules', courseId, selectedModule],
    queryFn: () => fetchCourseModules(courseId),
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

  const handleEditLesson = (lesson) => {
    setEditingLesson(lesson);
    setShowLessonForm(true);
  };

  const handleLessonFormClose = () => {
    setShowLessonForm(false);
    setEditingLesson(null);
  };

  const handleSuccess = () => {
    handleLessonFormClose();
    refetch();
  };

  const handleModuleSelect = (moduleId: string) => {
    setSelectedModule(moduleId);
    setActiveTab('lessons'); // Switch to lessons tab when module is selected
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="min-w-0">
          <h2 className="text-xl sm:text-2xl font-bold break-words">Course Lessons</h2>
          <p className="text-sm sm:text-base text-gray-600">
            Create, organize, and manage your course lessons and content
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onBack} className="w-full sm:w-auto order-2 sm:order-1">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Course
          </Button>
          {!showLessonForm && (
            <Button onClick={() => setShowLessonForm(true)} className="w-full sm:w-auto order-1 sm:order-2">
              <Plus className="h-4 w-4 mr-2" />
              Add Lesson
            </Button>
          )}
        </div>
      </div>

      {showLessonForm ? (
        <EnhancedLessonForm
          courseId={courseId}
          lesson={editingLesson}
          onSuccess={handleSuccess}
          onCancel={handleLessonFormClose}
        />
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="lessons" className="flex items-center gap-2">
              <Layers className="h-4 w-4" />
              Lessons
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

          <TabsContent value="lessons" className="space-y-4">
            {selectedModule && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Showing lessons for selected module
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedModule('')}
                    >
                      Show All Lessons
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {isLoading ? (
              <div className="flex justify-center p-8">
                <div className="text-gray-500">Loading course lessons...</div>
              </div>
            ) : (
              <LessonList
                courseId={courseId}
                modules={modules || []}
                onEdit={handleEditLesson}
                onAdd={() => setShowLessonForm(true)}
                invalidateContent={refetch}
              />
            )}
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
                    Manage multiple lessons at once
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Button variant="outline" className="w-full">
                      Publish All Lessons
                    </Button>
                    <Button variant="outline" className="w-full">
                      Schedule All
                    </Button>
                    <Button variant="outline" className="w-full">
                      Export Lessons
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

export default LessonManager;