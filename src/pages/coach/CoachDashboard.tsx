import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, BookOpen, DollarSign, Users, TrendingUp, CreditCard, AlertTriangle, Package } from 'lucide-react';
import { StatCard } from '@/components/dashboard/StatCard';
import { StatusBadge, getStatusBadge } from '@/components/dashboard/StatusBadge';
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
import DashboardLayout from '@/components/layout/DashboardLayout';

type ViewType = 'dashboard' | 'create' | 'edit' | 'preview' | 'content' | 'subscription' | 'bundles';

const CoachDashboard = () => {
  const { profile } = useAuth();
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [showWizard, setShowWizard] = useState(false);

  const renderView = () => {
    if (currentView === 'subscription') {
      return (
        <DashboardLayout>
          <SubscriptionPage />
        </DashboardLayout>
      );
    }

    if (currentView === 'bundles') {
      return (
        <DashboardLayout>
          <CourseBundleManager />
        </DashboardLayout>
      );
    }

    if (showWizard) {
      return (
        <DashboardLayout>
          <CourseCreationWizard
            onSuccess={() => { setShowWizard(false); handleBackToDashboard(); }}
            onCancel={() => setShowWizard(false)}
          />
        </DashboardLayout>
      );
    }

    if (currentView === 'create') {
      return (
        <DashboardLayout>
          <CourseForm
            onSuccess={handleBackToDashboard}
            onCancel={handleBackToDashboard}
          />
        </DashboardLayout>
      );
    }

    if (currentView === 'edit' && selectedCourseId) {
      return (
        <DashboardLayout>
          <CourseEditor
            courseId={selectedCourseId}
            onSuccess={handleBackToDashboard}
            onCancel={handleBackToDashboard}
            onPreview={() => setCurrentView('preview')}
          />
        </DashboardLayout>
      );
    }

    if (currentView === 'preview' && selectedCourseId) {
      return (
        <DashboardLayout>
          <CoursePreview
            courseId={selectedCourseId}
            onBack={handleBackToDashboard}
          />
        </DashboardLayout>
      );
    }

    if (currentView === 'content' && selectedCourseId) {
      return (
        <DashboardLayout>
          <CourseContentManager
            courseId={selectedCourseId}
            onBack={handleBackToDashboard}
          />
        </DashboardLayout>
      );
    }

    return null;
  };
  
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

  const alternateView = renderView();
  if (alternateView) {
    return alternateView;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6">
          <div className="min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                {profile?.first_name?.[0] || 'C'}
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                  Welcome back, {profile?.first_name}!
                </h1>
                <p className="text-slate-600 text-sm sm:text-base mt-1">
                  Manage your courses and track your success
                </p>
              </div>
            </div>
          </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="flex gap-2">
                <Button 
                  onClick={() => setCurrentView('subscription')} 
                  variant="outline" 
                  className="flex-1 sm:flex-none bg-slate-50 hover:bg-slate-100 border-slate-200"
                >
                  <CreditCard className="h-4 w-4 mr-2 text-slate-600" />
                  Subscription
                </Button>
                <Button 
                  onClick={() => setCurrentView('bundles')} 
                  variant="outline" 
                  className="flex-1 sm:flex-none bg-slate-50 hover:bg-slate-100 border-slate-200"
                >
                  <Package className="h-4 w-4 mr-2 text-slate-600" />
                  Bundles
                </Button>
              </div>
              <Button 
                onClick={handleCreateCourse} 
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm" 
                disabled={!hasActiveSubscription}
              >
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
          <Card className="mb-6 bg-gradient-to-br from-slate-50 via-white to-blue-50/50 border-slate-200/75">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                <div className="flex items-start sm:items-center gap-4">
                  <div className="p-3 rounded-xl bg-blue-50">
                    <CreditCard className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold text-slate-900">
                        {currentTier?.name || subscription.tier} Plan
                      </h3>
                      <StatusBadge status={subscription.status} {...getStatusBadge(subscription.status)}>
                        {getStatusBadge(subscription.status).label}
                      </StatusBadge>
                    </div>
                    <p className="text-sm text-slate-600">
                      {subscription.currency} {subscription.price}/{subscription.billing_cycle}
                    </p>
                  </div>
                </div>
                
                {/* Usage warnings */}
                {currentTier && usage && (
                  <div className="flex flex-wrap items-center gap-3">
                    {isAtLimit(usage.coursesCreated, currentTier.features.maxCourses) && (
                      <StatusBadge status="limit" variant="destructive" icon>
                        Course limit reached
                      </StatusBadge>
                    )}
                    {isAtLimit(usage.studentsEnrolled, currentTier.features.maxStudents) && (
                      <StatusBadge status="limit" variant="destructive" icon>
                        Student limit reached
                      </StatusBadge>
                    )}
                    {!isAtLimit(usage.coursesCreated, currentTier.features.maxCourses) && 
                     !isAtLimit(usage.studentsEnrolled, currentTier.features.maxStudents) && (
                      <StatusBadge status="ok" variant="outline">
                        All usage within limits
                      </StatusBadge>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={BookOpen}
            title="Total Courses"
            value={usage?.coursesCreated || 0}
            maxValue={currentTier && hasActiveSubscription ? currentTier.features.maxCourses : undefined}
            trend={0}
            color="blue"
          />
          <StatCard
            icon={Users}
            title="Total Students"
            value={usage?.studentsEnrolled || 0}
            maxValue={currentTier && hasActiveSubscription ? currentTier.features.maxStudents : undefined}
            trend={0}
            color="purple"
          />
          <StatCard
            icon={DollarSign}
            title="Total Revenue"
            value="MWK 0"
            trend={0}
            color="emerald"
          />
          <StatCard
            icon={TrendingUp}
            title="Growth Rate"
            value="0%"
            trend={0}
            color="rose"
          />
        </div>

        {/* Courses Section */}
        <CoursesList
          onCreateNew={handleCreateCourse}
          onEditCourse={(course) => handleEditCourse(course.id)}
          onPreviewCourse={(course) => handlePreviewCourse(course.id)}
          onManageContent={(course) => handleManageContent(course.id)}
        />
      </div>
    </DashboardLayout>
  );
};

export default CoachDashboard;
