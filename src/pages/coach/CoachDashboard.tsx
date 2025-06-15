
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, BookOpen, DollarSign, Users, TrendingUp, CreditCard, AlertTriangle, Package } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import CoursesList from '@/components/courses/CoursesList';
import CourseForm from '@/components/courses/CourseForm';
import CourseEditor from '@/components/courses/CourseEditor';
import CoursePreview from '@/components/courses/CoursePreview';
import CourseContentManager from '@/components/courses/CourseContentManager';
import CourseBundleManager from '@/components/courses/CourseBundleManager';
import SubscriptionPage from './SubscriptionPage';
import TrialStatusCard from '@/components/subscription/TrialStatusCard';
import { useCoachSubscription, useSubscriptionUsage } from '@/hooks/useSubscription';
import { useStartTrial } from '@/hooks/useSubscriptionManagement';
import { getTierById } from '@/config/subscriptionTiers';
import CourseCreationWizard from '@/components/courses/CourseCreationWizard';

type ViewType = 'dashboard' | 'create' | 'edit' | 'preview' | 'content' | 'subscription' | 'bundles';

const CoachDashboard = () => {
  const { profile } = useAuth();
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [showWizard, setShowWizard] = useState(false);
  
  const { data: subscription } = useCoachSubscription();
  const { data: usage } = useSubscriptionUsage();
  const startTrial = useStartTrial();

  const currentTier = subscription ? getTierById(subscription.tier) : null;
  const hasActiveSubscription = subscription?.status === 'active' || subscription?.status === 'trial';

  const handleCreateCourse = () => {
    // Check if user has an active subscription
    if (!hasActiveSubscription) {
      setCurrentView('subscription');
      return;
    }

    // Check if user can create more courses
    if (currentTier && currentTier.features.maxCourses !== -1 && usage) {
      if (usage.coursesCreated >= currentTier.features.maxCourses) {
        setCurrentView('subscription');
        return;
      }
    }
    setShowWizard(true);
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

  const handleStartTrial = () => {
    startTrial.mutate();
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: 'Active', variant: 'default' as const },
      trial: { label: 'Trial', variant: 'secondary' as const },
      expired: { label: 'Expired', variant: 'destructive' as const },
      inactive: { label: 'Inactive', variant: 'destructive' as const },
    };
    
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.inactive;
  };

  const isAtLimit = (used: number, limit: number) => {
    return limit !== -1 && used >= limit;
  };

  if (currentView === 'subscription') {
    return <SubscriptionPage />;
  }

  if (currentView === 'bundles') {
    return <CourseBundleManager />;
  }

  if (showWizard) {
    return (
      <div className="w-full">
        <CourseCreationWizard
          onSuccess={() => { setShowWizard(false); handleBackToDashboard(); }}
          onCancel={() => setShowWizard(false)}
        />
      </div>
    );
  }

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
          <div className="flex flex-col sm:flex-row gap-2">
            <Button onClick={() => setCurrentView('subscription')} variant="outline" className="w-full sm:w-auto">
              <CreditCard className="h-4 w-4 mr-2" />
              Subscription
            </Button>
            <Button onClick={() => setCurrentView('bundles')} variant="outline" className="w-full sm:w-auto">
              <Package className="h-4 w-4 mr-2" />
              Bundles
            </Button>
            <Button onClick={handleCreateCourse} className="w-full sm:w-auto" disabled={!hasActiveSubscription}>
              <Plus className="h-4 w-4 mr-2" />
              Create Course
            </Button>
          </div>
        </div>

        {/* Trial or Subscription Status */}
        {!subscription ? (
          <TrialStatusCard 
            subscription={subscription} 
            onUpgrade={() => setCurrentView('subscription')} 
          />
        ) : !hasActiveSubscription ? (
          <Card className="mb-4 border-orange-200 bg-orange-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                <div>
                  <div className="font-semibold text-orange-800">
                    {subscription.status === 'expired' ? 'Trial Expired' : 'No Active Subscription'}
                  </div>
                  <p className="text-sm text-orange-700">
                    {subscription.status === 'expired' 
                      ? 'Your trial has ended. Subscribe to continue creating courses and managing students.'
                      : 'Subscribe to a plan to start creating courses and managing students.'
                    }
                  </p>
                </div>
                <Button onClick={() => setCurrentView('subscription')} className="ml-auto">
                  {subscription.status === 'expired' ? 'Subscribe Now' : 'View Plans'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : subscription.is_trial ? (
          <TrialStatusCard 
            subscription={subscription} 
            onUpgrade={() => setCurrentView('subscription')} 
          />
        ) : (
          <Card className="mb-4">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{currentTier?.name || subscription.tier} Plan</span>
                      <Badge {...getStatusBadge(subscription.status)}>
                        {getStatusBadge(subscription.status).label}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{subscription.currency} {subscription.price}/{subscription.billing_cycle}</p>
                  </div>
                </div>
                
                {/* Usage warnings */}
                {currentTier && usage && (
                  <div className="flex flex-wrap gap-2">
                    {isAtLimit(usage.coursesCreated, currentTier.features.maxCourses) && (
                      <Badge variant="destructive" className="text-xs">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Course limit reached
                      </Badge>
                    )}
                    {isAtLimit(usage.studentsEnrolled, currentTier.features.maxStudents) && (
                      <Badge variant="destructive" className="text-xs">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Student limit reached
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Total Courses</CardTitle>
              <BookOpen className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="pb-2">
              <div className="text-lg sm:text-xl md:text-2xl font-bold">
                {usage?.coursesCreated || 0}
                {currentTier && hasActiveSubscription && currentTier.features.maxCourses !== -1 && (
                  <span className="text-sm text-gray-500 ml-1">
                    / {currentTier.features.maxCourses}
                  </span>
                )}
              </div>
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
              <div className="text-lg sm:text-xl md:text-2xl font-bold">
                {usage?.studentsEnrolled || 0}
                {currentTier && hasActiveSubscription && currentTier.features.maxStudents !== -1 && (
                  <span className="text-sm text-gray-500 ml-1">
                    / {currentTier.features.maxStudents}
                  </span>
                )}
              </div>
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
              <div className="text-lg sm:text-xl md:text-2xl font-bold">MWK 0</div>
              <p className="text-xs text-muted-foreground">
                +MWK 0 from last month
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
