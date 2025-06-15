
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, BookOpen, DollarSign, Users, TrendingUp } from 'lucide-react';
import CoursesList from '@/components/courses/CoursesList';
import CourseForm from '@/components/courses/CourseForm';

const CoachDashboard = () => {
  const { profile } = useAuth();
  const [showCourseForm, setShowCourseForm] = useState(false);

  if (showCourseForm) {
    return (
      <div className="container mx-auto py-4 md:py-6 px-4">
        <CourseForm
          onSuccess={() => setShowCourseForm(false)}
          onCancel={() => setShowCourseForm(false)}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-4 md:py-6 px-4 space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">
            Welcome back, {profile?.first_name}!
          </h1>
          <p className="text-gray-600 text-sm md:text-base">Manage your courses and track your success</p>
        </div>
        <Button onClick={() => setShowCourseForm(true)} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Create Course
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              +0 from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              +0 from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">$0</div>
            <p className="text-xs text-muted-foreground">
              +$0 from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">0%</div>
            <p className="text-xs text-muted-foreground">
              +0% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Courses Section */}
      <CoursesList
        onCreateNew={() => setShowCourseForm(true)}
        onEditCourse={(course) => {
          console.log('Edit course:', course);
          // TODO: Implement course editing
        }}
      />
    </div>
  );
};

export default CoachDashboard;
