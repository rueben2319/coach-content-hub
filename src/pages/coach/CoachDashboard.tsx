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
import { DesktopStatsGrid } from '@/components/dashboard/DesktopStatsGrid';
import { DesktopContainer, DesktopGrid, DesktopSection } from '@/components/layout/DesktopLayoutUtils';

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

  // Prepare stats data for the enhanced grid
  const statsData = [
    {
      title: 'Total Courses',
      value: usage?.coursesCreated || 0,
      subtitle: '+0 from last month',
      icon: BookOpen,
      color: 'blue' as const,
      limit: currentTier && hasActiveSubscription ? {
        current: usage?.coursesCreated || 0,
        max: currentTier.features.maxCourses
      } : undefined,
      change: {
        value: 0,
        type: 'neutral' as const,
        period: 'vs last month'
      }
    },
    {
      title: 'Total Students',
      value: usage?.studentsEnrolled || 0,
      subtitle: '+0 from last month',
      icon: Users,
      color: 'green' as const,
      limit: currentTier && hasActiveSubscription ? {
        current: usage?.studentsEnrolled || 0,
        max: currentTier.features.maxStudents
      } : undefined,
      change: {
        value: 0,
        type: 'neutral' as const,
        period: 'vs last month'
      }
    },
    {
      title: 'Total Revenue',
      value: 'MWK 0',
      subtitle: '+MWK 0 from last month',
      icon: DollarSign,
      color: 'purple' as const,
      change: {
        value: 0,
        type: 'neutral' as const,
        period: 'vs last month'
      }
    },
    {
      title: 'Growth Rate',
      value: '0%',
      subtitle: '+0% from last month',
      icon: TrendingUp,
      color: 'orange' as const,
      change: {
        value: 0,
        type: 'neutral' as const,
        period: 'vs last month'
      }
    }
  ];

  return (
    <DesktopContainer>
      <DesktopSection
        title={`Welcome back, ${profile?.first_name}!`}
        subtitle="Manage your courses and track your success"
      >
        {/* Header Actions */}
        <div className="desktop-flex-between mb-8">
          <div></div>
          <div className="flex gap-4">
            <Button onClick={() => setCurrentView('subscription')} variant="outline" className="desktop-button-secondary">
              <CreditCard className="h-4 w-4 mr-2" />
              Subscription
            </Button>
            <Button onClick={() => setCurrentView('bundles')} variant="outline" className="desktop-button-secondary">
              <Package className="h-4 w-4 mr-2" />
              Bundles
            </Button>
            <Button onClick={handleCreateCourse} className="desktop-button-primary" disabled={!hasActiveSubscription}>
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
          <Card className="mb-8 border-orange-200 bg-gradient-to-r from-orange-50 to-red-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-100 rounded-xl">
                  <AlertTriangle className="h-6 w-6 text-orange-600" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-orange-800 text-lg">
                    {subscription.status === 'expired' ? 'Trial Expired' : 'No Active Subscription'}
                  </div>
                  <p className="text-orange-700 mt-1">
                    {subscription.status === 'expired' 
                      ? 'Your trial has ended. Subscribe to continue creating courses and managing students.'
                      : 'Subscribe to a plan to start creating courses and managing students.'
                    }
                  </p>
                </div>
                <Button onClick={() => setCurrentView('subscription')} className="desktop-button-primary">
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
          <Card className="mb-8 bg-gradient-to-r from-green-50 to-blue-50">
            <CardContent className="p-6">
              <div className="desktop-flex-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <CreditCard className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-lg">{currentTier?.name || subscription.tier} Plan</span>
                      <Badge variant="default" className="bg-green-600">
                        Active
                      </Badge>
                    </div>
                    <p className="text-gray-600">{subscription.currency} {subscription.price}/{subscription.billing_cycle}</p>
                  </div>
                </div>
                
                {/* Usage warnings */}
                {currentTier && usage && (
                  <div className="flex flex-wrap gap-2">
                    {isAtLimit(usage.coursesCreated, currentTier.features.maxCourses) && (
                      <Badge variant="destructive" className="text-sm">
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        Course limit reached
                      </Badge>
                    )}
                    {isAtLimit(usage.studentsEnrolled, currentTier.features.maxStudents) && (
                      <Badge variant="destructive" className="text-sm">
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        Student limit reached
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Enhanced Stats Grid */}
        <DesktopStatsGrid stats={statsData} className="mb-8" />

        {/* Courses Section */}
        <CoursesList
          onCreateNew={handleCreateCourse}
          onEditCourse={(course) => handleEditCourse(course.id)}
          onPreviewCourse={(course) => handlePreviewCourse(course.id)}
          onManageContent={(course) => handleManageContent(course.id)}
        />
      </DesktopSection>
    </DesktopContainer>
  );
};

export default CoachDashboard;
