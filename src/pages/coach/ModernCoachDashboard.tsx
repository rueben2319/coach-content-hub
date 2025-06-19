
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, BookOpen, DollarSign, Users, TrendingUp, CreditCard, AlertTriangle, Package, Search } from 'lucide-react';
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
import ModernStatsGrid from '@/components/dashboard/ModernStatsGrid';
import { Input } from '@/components/ui/input';

type ViewType = 'dashboard' | 'create' | 'edit' | 'preview' | 'content' | 'subscription' | 'bundles';

const ModernCoachDashboard = () => {
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
    if (!hasActiveSubscription) {
      setCurrentView('subscription');
      return;
    }

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

  // Prepare stats data
  const statsData = [
    {
      title: 'Clients',
      value: usage?.studentsEnrolled || 512,
      icon: Users,
      color: 'green' as const,
    },
    {
      title: 'Sales',
      value: '$7,770',
      icon: DollarSign,
      color: 'blue' as const,
    },
    {
      title: 'Performance',
      value: '256%',
      icon: TrendingUp,
      color: 'red' as const,
    }
  ];

  return (
    <div className="modern-dashboard-content">
      {/* Header */}
      <div className="modern-dashboard-header">
        <div>
          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
            <span>Admin</span>
            <span>/</span>
            <span className="font-semibold text-gray-900">Dashboard</span>
          </div>
          <h1 className="modern-dashboard-title">Dashboard</h1>
        </div>
        <div className="modern-dashboard-actions">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search everywhere..."
              className="pl-10 pr-4 py-2 w-80 bg-white border-gray-200"
            />
          </div>
          <Button onClick={() => setCurrentView('subscription')} variant="outline">
            <CreditCard className="h-4 w-4 mr-2" />
            Subscription
          </Button>
          <Button onClick={() => setCurrentView('bundles')} variant="outline">
            <Package className="h-4 w-4 mr-2" />
            Bundles
          </Button>
          <Button onClick={handleCreateCourse} className="bg-blue-600 hover:bg-blue-700" disabled={!hasActiveSubscription}>
            <Plus className="h-4 w-4 mr-2" />
            Premium Demo
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
              <Button onClick={() => setCurrentView('subscription')} className="bg-blue-600 hover:bg-blue-700">
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
      ) : null}

      {/* Stats Grid */}
      <ModernStatsGrid stats={statsData} />

      {/* Performance Chart */}
      <div className="modern-chart-container">
        <div className="modern-chart-header">
          <h3 className="modern-chart-title">
            <TrendingUp className="w-5 h-5" />
            Performance
          </h3>
          <Button variant="ghost" size="sm">
            <Search className="w-4 h-4" />
          </Button>
        </div>
        <div className="h-64 flex items-center justify-center text-gray-500">
          Chart will be displayed here
        </div>
      </div>

      {/* Courses Section */}
      <div className="mt-8">
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

export default ModernCoachDashboard;
