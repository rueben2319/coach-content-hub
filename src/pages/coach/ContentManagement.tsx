
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, BookOpen, Package, Plus, Edit, Eye, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CourseBundleManager from '@/components/courses/CourseBundleManager';
import CoursesList from '@/components/courses/CoursesList';
import CourseForm from '@/components/courses/CourseForm';
import CourseEditor from '@/components/courses/CourseEditor';
import CoursePreview from '@/components/courses/CoursePreview';
import CourseContentManager from '@/components/courses/CourseContentManager';
import CourseCreationWizard from '@/components/courses/CourseCreationWizard';

type ViewType = 'overview' | 'courses' | 'bundles' | 'create-course' | 'edit-course' | 'preview-course' | 'manage-content' | 'wizard';

const ContentManagement = () => {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState<ViewType>('overview');
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');

  const handleBackToDashboard = () => {
    navigate('/coach');
  };

  const handleBackToOverview = () => {
    setCurrentView('overview');
    setSelectedCourseId('');
  };

  const handleCreateCourse = () => {
    setCurrentView('wizard');
  };

  const handleEditCourse = (courseId: string) => {
    setSelectedCourseId(courseId);
    setCurrentView('edit-course');
  };

  const handlePreviewCourse = (courseId: string) => {
    setSelectedCourseId(courseId);
    setCurrentView('preview-course');
  };

  const handleManageContent = (courseId: string) => {
    setSelectedCourseId(courseId);
    setCurrentView('manage-content');
  };

  // Render different views based on current state
  if (currentView === 'wizard') {
    return (
      <CourseCreationWizard
        onSuccess={handleBackToOverview}
        onCancel={handleBackToOverview}
      />
    );
  }

  if (currentView === 'create-course') {
    return (
      <CourseForm
        onSuccess={handleBackToOverview}
        onCancel={handleBackToOverview}
      />
    );
  }

  if (currentView === 'edit-course' && selectedCourseId) {
    return (
      <CourseEditor
        courseId={selectedCourseId}
        onSuccess={handleBackToOverview}
        onCancel={handleBackToOverview}
        onPreview={() => setCurrentView('preview-course')}
      />
    );
  }

  if (currentView === 'preview-course' && selectedCourseId) {
    return (
      <CoursePreview
        courseId={selectedCourseId}
        onBack={handleBackToOverview}
      />
    );
  }

  if (currentView === 'manage-content' && selectedCourseId) {
    return (
      <CourseContentManager
        courseId={selectedCourseId}
        onBack={handleBackToOverview}
      />
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="flex flex-col gap-4">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 break-words">Content Management</h1>
          <p className="text-slate-600 text-sm sm:text-base mt-1 break-words">
            Manage your courses, content, and bundles all in one place
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full">
          <Button onClick={handleBackToDashboard} variant="outline" className="w-full sm:w-auto order-2 sm:order-1">
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span className="truncate">Back to Dashboard</span>
          </Button>
          <Button onClick={handleCreateCourse} className="w-full sm:w-auto order-1 sm:order-2">
            <Plus className="h-4 w-4 mr-2" />
            <span className="truncate">Create Course</span>
          </Button>
        </div>
      </div>

      {currentView === 'overview' && (
        <Tabs defaultValue="courses" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="courses" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Courses
            </TabsTrigger>
            <TabsTrigger value="bundles" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Bundles
            </TabsTrigger>
          </TabsList>

          <TabsContent value="courses" className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
              <Card className="cursor-pointer hover:shadow-md transition-shadow touch-manipulation" onClick={handleCreateCourse}>
                <CardContent className="p-3 sm:p-4 text-center">
                  <Plus className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 text-blue-600" />
                  <h3 className="font-semibold text-sm sm:text-base break-words">Create Course</h3>
                  <p className="text-xs sm:text-sm text-gray-600 break-words">Start a new course</p>
                </CardContent>
              </Card>
              
              <Card className="cursor-pointer hover:shadow-md transition-shadow touch-manipulation">
                <CardContent className="p-3 sm:p-4 text-center">
                  <Edit className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 text-green-600" />
                  <h3 className="font-semibold text-sm sm:text-base break-words">Edit Content</h3>
                  <p className="text-xs sm:text-sm text-gray-600 break-words">Modify existing content</p>
                </CardContent>
              </Card>
              
              <Card className="cursor-pointer hover:shadow-md transition-shadow touch-manipulation">
                <CardContent className="p-3 sm:p-4 text-center">
                  <Eye className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 text-purple-600" />
                  <h3 className="font-semibold text-sm sm:text-base break-words">Preview</h3>
                  <p className="text-xs sm:text-sm text-gray-600 break-words">See how courses look</p>
                </CardContent>
              </Card>
              
              <Card className="cursor-pointer hover:shadow-md transition-shadow touch-manipulation">
                <CardContent className="p-3 sm:p-4 text-center">
                  <Settings className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 text-orange-600" />
                  <h3 className="font-semibold text-sm sm:text-base break-words">Manage</h3>
                  <p className="text-xs sm:text-sm text-gray-600 break-words">Advanced management</p>
                </CardContent>
              </Card>
            </div>

            <CoursesList
              onCreateNew={handleCreateCourse}
              onEditCourse={(course) => handleEditCourse(course.id)}
              onPreviewCourse={(course) => handlePreviewCourse(course.id)}
              onManageContent={(course) => handleManageContent(course.id)}
            />
          </TabsContent>

          <TabsContent value="bundles">
            <CourseBundleManager />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default ContentManagement;
