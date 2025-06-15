
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, BookOpen, DollarSign, Users, TrendingUp } from 'lucide-react';
import CoursesList from '@/components/courses/CoursesList';
import CourseForm from '@/components/courses/CourseForm';
import CourseEditor from '@/components/courses/CourseEditor';
import CoursePreview from '@/components/courses/CoursePreview';
import CourseContentManager from '@/components/courses/CourseContentManager';

type ViewType = 'dashboard' | 'create' | 'edit' | 'preview' | 'content';

const CoachDashboard = () => {
  const { profile } = useAuth();
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');

  const handleCreateCourse = () => {
    setCurrentView('create');
  };

  const handleEditCourse = (courseId: string) => {
    setSelectedCourseId(courseId);
    setCurrentView('edit');
  };

  const handlePreviewCourse = (courseId: string) => {
    setSelectedCourseId(courseId);
    setCurrentView('preview');
  };

  const handleManageContent = (courseId: string) => {
    setSelectedCourseId(courseId);
    setCurrentView('content');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedCourseId('');
  };

  if (currentView === 'create') {
    return (
      <div className="w-full">
        <CourseForm
          onSuccess={handleBackToDashboard}
          onCancel={handleBackToDashboard}
        />
      </div>
    );
  }

  if (currentView === 'edit' && selectedCourseId) {
    return (
      <div className="w-full">
        <CourseEditor
          courseId={selectedCourseId}
          onSuccess={handleBackToDashboard}
          onCancel={handleBackToDashboard}
          onPreview={() => setCurrentView('preview')}
        />
      </div>
    );
  }

  if (currentView === 'preview' && selectedCourseId) {
    return (
      <div className="w-full">
        <CoursePreview
          courseId={selectedCourseId}
          onBack={handleBackToDashboard}
        />
      </div>
    );
  }

  if (currentView === 'content' && selectedCourseId) {
    return (
      <div className="w-full">
        <CourseContentManager
          courseId={selectedCourseId}
          onBack={handleBackToDashboard}
        />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="container mx-auto py-4 md:py-6 px-4 space-y-4 md:space-y-6 max-w-7xl">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold break-words">
              Welcome back, {profile?.first_name}!
            </h1>
            <p className="text-gray-600 text-sm md:text-base">Manage your courses and track your success</p>
          </div>
          <Button onClick={handleCreateCourse} className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Create Course
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Total Courses</CardTitle>
              <BookOpen className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="pb-2">
              <div className="text-lg sm:text-xl md:text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                +0 from last month
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Total Students</CardTitle>
              <Users className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="pb-2">
              <div className="text-lg sm:text-xl md:text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                +0 from last month
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="pb-2">
              <div className="text-lg sm:text-xl md:text-2xl font-bold">$0</div>
              <p className="text-xs text-muted-foreground">
                +$0 from last month
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Growth Rate</CardTitle>
              <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="pb-2">
              <div className="text-lg sm:text-xl md:text-2xl font-bold">0%</div>
              <p className="text-xs text-muted-foreground">
                +0% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Courses Section */}
        <CoursesList
          onCreateNew={handleCreateCourse}
          onEditCourse={(course) => handleEditCourse(course.id)}
          onPreviewCourse={(course) => handlePreviewCourse(course.id)}
          onManageContent={(course) => handleManageContent(course.id)}
        />
      </div>
    </div>
  );
};

export default CoachDashboard;
