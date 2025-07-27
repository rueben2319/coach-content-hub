
import React from 'react';
import { Route } from 'react-router-dom';
import { RoleProtectedRoute } from './RoleProtectedRoute';
import DashboardLayout from '@/components/layout/DashboardLayout';
import CoachDashboard from '@/pages/coach/CoachDashboard';
import CoachProfile from '@/pages/coach/CoachProfile';
import ContentManagement from '@/pages/coach/ContentManagement';
import SubscriptionManagement from '@/pages/coach/SubscriptionManagement';
import Preview from '@/pages/coach/Preview';

export const CoachRoutes = () => (
  <>
    <Route path="/coach" element={
      <RoleProtectedRoute allowedRoles={['coach']}>
        <DashboardLayout>
          <CoachDashboard />
        </DashboardLayout>
      </RoleProtectedRoute>
    } />
    <Route path="/coach/profile" element={
      <RoleProtectedRoute allowedRoles={['coach']}>
        <DashboardLayout>
          <CoachProfile />
        </DashboardLayout>
      </RoleProtectedRoute>
    } />
    <Route path="/coach/content" element={
      <RoleProtectedRoute allowedRoles={['coach']}>
        <DashboardLayout>
          <ContentManagement />
        </DashboardLayout>
      </RoleProtectedRoute>
    } />
    <Route path="/coach/subscription" element={
      <RoleProtectedRoute allowedRoles={['coach']}>
        <DashboardLayout>
          <SubscriptionManagement />
        </DashboardLayout>
      </RoleProtectedRoute>
    } />
    <Route path="/coach/preview/:courseId" element={
      <RoleProtectedRoute allowedRoles={['coach']}>
        <DashboardLayout>
          <Preview />
        </DashboardLayout>
      </RoleProtectedRoute>
    } />
  </>
);
