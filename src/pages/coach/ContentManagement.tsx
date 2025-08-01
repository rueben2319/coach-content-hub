
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, BookOpen, Package, Plus, Edit, Eye, Settings, Grid, List, MoreVertical, Play, X, Trash2 } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import CourseBundleManager from '@/components/courses/CourseBundleManager';
import CourseEditor from '@/components/courses/CourseEditor';
import CoursePreview from '@/components/courses/CoursePreview';
import CourseContentManager from '@/components/courses/CourseContentManager';
import CourseCreationWizard from '@/components/courses/CourseCreationWizard';
import LessonManager from '@/components/courses/LessonManager';

type ViewType = 'overview' | 'courses' | 'bundles' | 'create-course' | 'edit-course' | 'preview-course' | 'manage-content' | 'wizard' | 'content' | 'lessons' | 'modules' | 'sections' | 'analytics';

const LEVEL_COLORS: Record<string, string> = {
  BEGINNER: 'bg-green-500',
  INTERMEDIATE: 'bg-green-600',
  ADVANCED: 'bg-green-700',
};

const PLACEHOLDER_IMG = 'https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=400&q=80';

const ContentManagement = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, profile } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // URL state management
  const view = searchParams.get('view') || 'overview';
  const courseId = searchParams.get('courseId') || '';
  const action = searchParams.get('action') || '';
  
  const [currentView, setCurrentView] = useState<ViewType>('overview');
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [search, setSearch] = useState('');
  const [academy, setAcademy] = useState('All');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [courseToDelete, setCourseToDelete] = useState<any>(null);

  // Sync URL with component state
  useEffect(() => {
    setCurrentView(view as ViewType);
    setSelectedCourseId(courseId);
  }, [view, courseId]);

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

  const navigateToView = (newView: string, newCourseId?: string, newAction?: string) => {
    updateURL({
      view: newView,
      courseId: newCourseId || null,
      action: newAction || null
    });
  };

  // Fetch coach's courses
  const { data: courses = [], isLoading, error } = useQuery({
    queryKey: ['coach-courses', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      try {
        const { data, error } = await supabase
          .from('courses')
          .select(`
            id,
            title,
            description,
            difficulty_level,
            is_published,
            created_at
          `)
          .eq('coach_id', user.id)
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error('Supabase error details:', {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code
          });
          throw error;
        }
        
        return data || [];
      } catch (err) {
        console.error('Exception in course fetching:', err);
        throw err;
      }
    },
    enabled: !!user?.id,
  });

  // Delete course mutation
  const deleteCourseMutation = useMutation({
    mutationFn: async (courseId: string) => {
      // First, check if there are any enrollments for this course
      const { data: enrollments, error: enrollmentError } = await supabase
        .from('enrollments')
        .select('id')
        .eq('course_id', courseId);

      if (enrollmentError) throw enrollmentError;

      if (enrollments && enrollments.length > 0) {
        throw new Error('Cannot delete course: There are active enrollments. Please contact support to handle this.');
      }

      // Get all modules for this course
      const { data: modules, error: moduleError } = await supabase
        .from('modules')
        .select('id')
        .eq('course_id', courseId);

      if (moduleError) throw moduleError;

      // For each module, delete its lessons and sections
      if (modules && modules.length > 0) {
        for (const module of modules) {
          // Get lessons for this module
          const { data: lessons, error: lessonError } = await supabase
            .from('lessons')
            .select('id')
            .eq('module_id', module.id);

          if (lessonError) throw lessonError;

          // For each lesson, delete its sections
          if (lessons && lessons.length > 0) {
            for (const lesson of lessons) {
              // Delete sections for this lesson
              const { error: sectionError } = await supabase
                .from('sections')
                .delete()
                .eq('lesson_id', lesson.id);

              if (sectionError) throw sectionError;
            }

            // Delete lessons for this module
            const { error: deleteLessonsError } = await supabase
              .from('lessons')
              .delete()
              .eq('module_id', module.id);

            if (deleteLessonsError) throw deleteLessonsError;
          }
        }

        // Delete modules
        const { error: deleteModulesError } = await supabase
          .from('modules')
          .delete()
          .eq('course_id', courseId);

        if (deleteModulesError) throw deleteModulesError;
      }

      // Now delete the course
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseId)
        .eq('coach_id', user?.id); // Ensure user can only delete their own courses

      if (error) throw error;
      return courseId;
    },
    onSuccess: (courseId) => {
      // Invalidate and refetch courses
      queryClient.invalidateQueries({ queryKey: ['coach-courses', user?.id] });
      
      // Close the confirmation dialog
      setCourseToDelete(null);
      
      toast({
        title: "Course deleted",
        description: "The course has been successfully deleted.",
        variant: "default",
      });
    },
    onError: (error: any) => {
      console.error('Error deleting course:', error);
      setCourseToDelete(null);
      
      let errorMessage = "Failed to delete the course. Please try again.";
      
      if (error.message) {
        errorMessage = error.message;
      } else if (error.code === '23503') {
        errorMessage = "Cannot delete course: It has related data (enrollments, modules, etc.). Please remove all related content first.";
      } else if (error.code === '23505') {
        errorMessage = "Cannot delete course: It's referenced by other records.";
      }
      
      toast({
        title: "Error deleting course",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  // Filtered courses
  const filtered = courses.filter((course: any) => {
    const matchesSearch = search === '' || course.title.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  // Handle URL parameters for direct navigation
  useEffect(() => {
    const urlView = searchParams.get('view');
    const urlCourseId = searchParams.get('courseId');
    
    if (urlView && urlView !== currentView) {
      setCurrentView(urlView as ViewType);
    }
    
    if (urlCourseId && urlCourseId !== selectedCourseId) {
      setSelectedCourseId(urlCourseId);
    }
  }, [searchParams, currentView, selectedCourseId]);

  const handleViewChange = (newView: ViewType) => {
    setCurrentView(newView);
    navigateToView(newView, selectedCourseId);
  };

  const handleCourseSelect = (courseId: string) => {
    setSelectedCourseId(courseId);
    navigateToView('content', courseId);
  };

  const handleBackToOverview = () => {
    navigateToView('overview');
  };

  const handleCreateCourse = () => {
    navigateToView('create-course');
  };

  const handleEditCourse = (courseId: string) => {
    navigateToView('edit-course', courseId);
  };

  const handlePreviewCourse = (courseId: string) => {
    navigateToView('preview-course', courseId);
  };

  const handleManageContent = (courseId: string) => {
    navigateToView('content', courseId);
  };

  const handleDeleteCourse = (course: any) => {
    setCourseToDelete(course);
  };

  const handleDeleteConfirm = () => {
    if (courseToDelete) {
      deleteCourseMutation.mutate(courseToDelete.id);
    }
  };

  const handleDeleteCancel = () => {
    setCourseToDelete(null);
  };

  const handleBackToCourses = () => {
    navigateToView('courses');
  };

  // Render different views based on currentView
  if ((currentView === 'content' || currentView === 'lessons' || currentView === 'modules' || currentView === 'sections' || currentView === 'analytics') && selectedCourseId) {
    console.log('Rendering LessonManager with courseId:', selectedCourseId, 'view:', currentView);
    return (
      <LessonManager
        courseId={selectedCourseId}
        onBack={handleBackToCourses}
      />
    );
  }

  if (currentView === 'create-course') {
    return (
      <div className="p-4 sm:p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={handleBackToOverview}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Content Management
          </Button>
        </div>
        <CourseCreationWizard onSuccess={handleBackToCourses} onCancel={handleBackToOverview} />
      </div>
    );
  }

  if (currentView === 'edit-course' && selectedCourseId) {
    return (
      <div className="p-4 sm:p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={handleBackToCourses}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Courses
          </Button>
        </div>
        <CourseEditor courseId={selectedCourseId} onSuccess={handleBackToCourses} onCancel={handleBackToCourses} onPreview={() => handlePreviewCourse(selectedCourseId)} />
      </div>
    );
  }

  if (currentView === 'preview-course' && selectedCourseId) {
    return (
      <div className="p-4 sm:p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={handleBackToCourses}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Courses
          </Button>
        </div>
        <CoursePreview courseId={selectedCourseId} onBack={handleBackToCourses} />
      </div>
    );
  }

  // Main content management overview
  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Content Management</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Manage your courses, modules, lessons, and content
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleCreateCourse}>
            <Plus className="h-4 w-4 mr-2" />
            Create Course
          </Button>
        </div>
      </div>

      <Tabs value={currentView} onValueChange={(value) => handleViewChange(value as ViewType)} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="bundles">Bundles</TabsTrigger>
          </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Total Courses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{courses.length}</p>
                <p className="text-sm text-gray-500">Published courses</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Course Bundles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">0</p>
                <p className="text-sm text-gray-500">Active bundles</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Total Views
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">0</p>
                <p className="text-sm text-gray-500">Content views</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Courses</CardTitle>
              <CardDescription>Your most recently created courses</CardDescription>
            </CardHeader>
            <CardContent>
              {courses.slice(0, 3).map((course: any) => (
                <div key={course.id} className="flex items-center justify-between py-3 border-b last:border-b-0">
                  <div>
                    <h3 className="font-medium">{course.title}</h3>
                    <p className="text-sm text-gray-500">{course.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleManageContent(course.id)}>
                      Manage Content
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleEditCourse(course.id)}>
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="courses" className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
              <Input
              placeholder="Search courses..."
                value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1"
            />
            <div className="flex gap-2">
                <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
                </Button>
                <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

          {isLoading ? (
            <div className="text-center py-8">Loading courses...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">Error loading courses: {error.message}</div>
          ) : filtered.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-gray-500 mb-4">No courses found</p>
                <Button onClick={handleCreateCourse}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Course
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
              {filtered.map((course: any) => (
                <Card key={course.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold mb-2">{course.title}</h3>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{course.description}</p>
                        <div className="flex items-center gap-2 mb-3">
                          <Badge variant={course.is_published ? "default" : "secondary"}>
                            {course.is_published ? 'Published' : 'Draft'}
                          </Badge>
                          {course.difficulty_level && (
                            <Badge variant="outline" className={LEVEL_COLORS[course.difficulty_level.toUpperCase()]}>
                              {course.difficulty_level}
                            </Badge>
                          )}
                        </div>
                      </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleManageContent(course.id)}>
                            <BookOpen className="h-4 w-4 mr-2" />
                            Manage Content
                              </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditCourse(course.id)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Course
                              </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handlePreviewCourse(course.id)}>
                            <Eye className="h-4 w-4 mr-2" />
                            Preview
                              </DropdownMenuItem>
                          <DropdownMenuSeparator />
                              <DropdownMenuItem 
                            onClick={() => handleDeleteCourse(course)}
                            className="text-red-600 focus:text-red-600 focus:bg-red-50"
                              >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Course
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleManageContent(course.id)}
                      >
                        Manage Content
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditCourse(course.id)}
                      >
                        Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              </div>
            )}
          </TabsContent>

        <TabsContent value="bundles" className="space-y-6">
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500 mb-4">Course bundles coming soon</p>
              <p className="text-sm text-gray-400">Create bundles of multiple courses for better organization and pricing.</p>
            </CardContent>
          </Card>
          </TabsContent>
        </Tabs>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!courseToDelete} onOpenChange={handleDeleteCancel}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Course</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{courseToDelete?.title}"? This action cannot be undone and will permanently remove the course, all its modules, lessons, and sections.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDeleteConfirm}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete Course
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
    </div>
  );
};

export default ContentManagement;
