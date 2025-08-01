import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Plus, ArrowLeft, BarChart3, Layers, Settings, FileText, BookOpen } from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import EnhancedLessonForm from './EnhancedLessonForm';
import ModuleForm from './ModuleForm';
import LessonList from './LessonList';
import SectionManager from './SectionManager';
import ContentAnalyticsDashboard from './ContentAnalyticsDashboard';
import ScheduledPublishingControls from './ScheduledPublishingControls';
import { fetchCourseModules } from './courseContentApi';

interface LessonManagerProps {
  courseId: string;
  onBack: () => void;
}

const LessonManager: React.FC<LessonManagerProps> = ({ courseId, onBack }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // URL state management
  const view = searchParams.get('view') || 'modules';
  const moduleId = searchParams.get('moduleId') || '';
  const lessonId = searchParams.get('lessonId') || '';
  const action = searchParams.get('action') || '';

  const [showLessonForm, setShowLessonForm] = useState(false);
  const [showModuleForm, setShowModuleForm] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [editingModule, setEditingModule] = useState(null);
  const [selectedModule, setSelectedModule] = useState<string>('');
  const [selectedLesson, setSelectedLesson] = useState<string>('');
  const [activeTab, setActiveTab] = useState('modules');

  const { data: modules, isLoading, refetch, error: modulesError } = useQuery({
    queryKey: ['course-modules', courseId, selectedModule],
    queryFn: async () => {
      console.log('Fetching modules for courseId:', courseId);
      const result = await fetchCourseModules(courseId);
      console.log('Modules result:', result);
      return result;
    },
    enabled: !!courseId, // Only fetch if courseId is provided
  });

  // Fetch course details for publishing controls
  const { data: courseDetails, error: courseError } = useQuery({
    queryKey: ['course-details', courseId],
    queryFn: async () => {
      const { supabase } = await import('@/integrations/supabase/client');
      console.log('Fetching course details for courseId:', courseId);
      const { data, error } = await supabase
        .from('courses')
        .select('id, title, scheduled_publish_at, auto_publish, publish_status')
        .eq('id', courseId)
        .single();
      
      if (error) {
        console.error('Error fetching course details:', error);
        throw error;
      }
      console.log('Course details:', data);
      return data;
    },
    enabled: !!courseId,
  });

  // Sync URL with component state
  useEffect(() => {
    console.log('LessonManager URL sync:', { view, moduleId, lessonId, action, courseId });
    console.log('Available modules:', modules?.map(m => ({ id: m.id, title: m.title })));
    
    // Handle different view types and map them to appropriate tabs
    let tabView = 'modules'; // default
    
    if (view === 'content' || view === 'modules') {
      tabView = 'modules';
    } else if (view === 'lessons') {
      tabView = 'lessons';
      // If we're going to lessons view but no moduleId is provided, 
      // we need to select the first available module
      if (!moduleId && modules && modules.length > 0) {
        console.log('Auto-selecting first module for lessons view:', modules[0].id);
        setSelectedModule(modules[0].id);
        // Update URL to include the moduleId
        updateURL({ moduleId: modules[0].id });
      }
    } else if (view === 'sections') {
      tabView = 'sections';
    } else if (view === 'analytics') {
      tabView = 'analytics';
    }
    
    setActiveTab(tabView);
    setSelectedModule(moduleId);
    setSelectedLesson(lessonId);
    
    // Handle actions from URL
    if (action === 'create-module') {
      setShowModuleForm(true);
      setEditingModule(null);
    } else if (action === 'edit-module' && moduleId) {
      const module = modules?.find(m => m.id === moduleId);
      if (module) {
        setEditingModule(module);
        setShowModuleForm(true);
      }
    } else if (action === 'create-lesson' && moduleId) {
      setShowLessonForm(true);
      setEditingLesson(null);
    } else if (action === 'edit-lesson' && lessonId) {
      // Find lesson in the selected module
      // This would need to be implemented based on your lesson fetching logic
      setShowLessonForm(true);
      setEditingLesson(null); // You'll need to fetch the lesson data
    } else if (action === 'manage-sections' && lessonId) {
      setActiveTab('sections');
    } else if (action === 'create-section' && lessonId) {
      setActiveTab('sections');
      // This will be handled by SectionManager
    } else if (action === 'edit-section' && lessonId) {
      setActiveTab('sections');
      // This will be handled by SectionManager
    }
  }, [view, moduleId, lessonId, action, modules, courseId]);

  // URL navigation functions
  const updateURL = (newParams: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams);
    
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    
    setSearchParams(params);
  };

  const navigateToView = (newView: string, newModuleId?: string, newLessonId?: string, newAction?: string) => {
    updateURL({
      view: newView,
      moduleId: newModuleId || null,
      lessonId: newLessonId || null,
      action: newAction || null
    });
  };

  const handleEditLesson = (lesson) => {
    setEditingLesson(lesson);
    setShowLessonForm(true);
    navigateToView('lessons', selectedModule, lesson.id, 'edit-lesson');
  };

  const handleEditModule = (module) => {
    setEditingModule(module);
    setShowModuleForm(true);
    navigateToView('modules', module.id, null, 'edit-module');
  };

  const handleLessonFormClose = () => {
    setShowLessonForm(false);
    setEditingLesson(null);
    updateURL({ action: null });
  };

  const handleModuleFormClose = () => {
    setShowModuleForm(false);
    setEditingModule(null);
    updateURL({ action: null });
  };

  const handleSuccess = () => {
    handleLessonFormClose();
    handleModuleFormClose();
    refetch();
  };

  const handleModuleSelect = (moduleId: string) => {
    setSelectedModule(moduleId);
    setSelectedLesson('');
    navigateToView('lessons', moduleId);
  };

  const handleLessonSelect = (lessonId: string) => {
    setSelectedLesson(lessonId);
    navigateToView('sections', selectedModule, lessonId, 'manage-sections');
  };

  const handleCreateModule = () => {
    setShowModuleForm(true);
    setEditingModule(null);
    navigateToView('modules', null, null, 'create-module');
  };

  const handleCreateLesson = () => {
    setShowLessonForm(true);
    setEditingLesson(null);
    navigateToView('lessons', selectedModule, null, 'create-lesson');
  };

  const handleBackToModules = () => {
    navigateToView('modules');
  };

  const handleBackToLessons = () => {
    navigateToView('lessons', selectedModule);
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="min-w-0">
          <h2 className="text-xl sm:text-2xl font-bold break-words">Course Content</h2>
          <p className="text-sm sm:text-base text-gray-600">
            Create modules and add lessons within them to build your course
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onBack} className="w-full sm:w-auto order-2 sm:order-1">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Course
          </Button>
          {!showLessonForm && !showModuleForm && activeTab === 'modules' && (
            <Button onClick={handleCreateModule} className="w-full sm:w-auto order-1 sm:order-2">
              <Plus className="h-4 w-4 mr-2" />
              Create Module
            </Button>
          )}
          {!showLessonForm && !showModuleForm && selectedModule && activeTab === 'lessons' && (
            <Button onClick={handleCreateLesson} className="w-full sm:w-auto order-1 sm:order-2">
              <Plus className="h-4 w-4 mr-2" />
              Add Lesson to Module
            </Button>
          )}
        </div>
      </div>

      {showModuleForm ? (
        <ModuleForm
          courseId={courseId}
          module={editingModule}
          onSuccess={handleSuccess}
          onCancel={handleModuleFormClose}
        />
      ) : showLessonForm ? (
        <EnhancedLessonForm
          courseId={courseId}
          moduleId={selectedModule}
          lesson={editingLesson}
          onSuccess={handleSuccess}
          onCancel={handleLessonFormClose}
        />
      ) : (
        <Tabs value={activeTab} onValueChange={(value) => {
          // Update URL to reflect the tab change with the correct view parameter
          updateURL({
            view: value, // Use the actual tab value as the view
            moduleId: value === 'modules' ? null : selectedModule,
            lessonId: value === 'sections' ? selectedLesson : null,
            action: null
          });
        }} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="modules" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Modules
            </TabsTrigger>
            <TabsTrigger value="lessons" className="flex items-center gap-2" disabled={!selectedModule}>
              <Layers className="h-4 w-4" />
              Lessons
            </TabsTrigger>
            <TabsTrigger value="sections" className="flex items-center gap-2" disabled={!selectedLesson}>
              <FileText className="h-4 w-4" />
              Sections
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="modules" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Course Modules
                </CardTitle>
                <CardDescription>
                  Modules are the main sections of your course. Create modules first, then add lessons within each module.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center p-8">
                    <div className="text-gray-500">Loading course modules...</div>
                  </div>
                ) : courseError ? (
                  <div className="flex justify-center p-8">
                    <div className="text-red-500">Error loading course: {courseError.message}</div>
                  </div>
                ) : modulesError ? (
                  <div className="flex justify-center p-8">
                    <div className="text-red-500">Error loading modules: {modulesError.message}</div>
                  </div>
                ) : (
                  <LessonList
                    courseId={courseId}
                    modules={modules || []}
                    onEdit={handleEditModule}
                    onAdd={handleCreateModule}
                    onModuleSelect={handleModuleSelect}
                    onLessonSelect={handleLessonSelect}
                    invalidateContent={refetch}
                    showModuleView={true}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="lessons" className="space-y-4">
            {!selectedModule ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <Layers className="h-12 w-12 text-gray-400" />
                    <h3 className="text-lg font-semibold mb-2">No Module Selected</h3>
                    <p className="text-gray-500 mb-4">Select a module to view its lessons</p>
                    <p className="text-sm text-gray-400 mb-4">
                      Go to the Modules tab and click on a module to view and manage its lessons.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => navigateToView('modules')}
                      className="w-full sm:w-auto"
                    >
                      <BookOpen className="h-4 w-4 mr-2" />
                      View Modules
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Layers className="h-5 w-5" />
                    Lessons in Module
                  </CardTitle>
                  <CardDescription>
                    Lessons are the individual learning units within this module.
                  </CardDescription>
                </CardHeader>
                <CardContent>
              <LessonList
                courseId={courseId}
                    modules={modules?.filter(m => m.id === selectedModule) || []}
                onEdit={handleEditLesson}
                    onAdd={handleCreateLesson}
                    onModuleSelect={handleModuleSelect}
                    onLessonSelect={handleLessonSelect}
                invalidateContent={refetch}
                    showModuleView={false}
                  />
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="sections" className="space-y-4">
            {!selectedLesson ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-gray-500 mb-4">Select a lesson to manage its sections</p>
                  <p className="text-sm text-gray-400">
                    Go to the Lessons tab and click on a lesson to view and manage its content sections.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <SectionManager
                lessonId={selectedLesson}
                onBack={handleBackToLessons}
              />
            )}
          </TabsContent>

          <TabsContent value="analytics">
            <ContentAnalyticsDashboard courseId={courseId} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default LessonManager;