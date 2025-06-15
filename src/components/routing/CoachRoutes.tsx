
import React from 'react';
import { Route } from 'react-router-dom';
import { RoleProtectedRoute } from './RoleProtectedRoute';
import ResponsiveDashboardLayout from '@/components/layout/ResponsiveDashboardLayout';
import CoachDashboard from '@/pages/coach/CoachDashboard';
import CoachProfile from '@/pages/coach/CoachProfile';
import SubscriptionPage from '@/pages/coach/SubscriptionPage';

export const CoachRoutes = () => (
  <>
    <Route path="/coach" element={
      <RoleProtectedRoute allowedRoles={['coach']}>
        <ResponsiveDashboardLayout>
          <CoachDashboard />
        </ResponsiveDashboardLayout>
      </RoleProtectedRoute>
    } />
    <Route path="/coach/profile" element={
      <RoleProtectedRoute allowedRoles={['coach']}>
        <ResponsiveDashboardLayout>
          <CoachProfile />
        </ResponsiveDashboardLayout>
      </RoleProtectedRoute>
    } />
    <Route path="/coach/subscription" element={
      <RoleProtectedRoute allowedRoles={['coach']}>
        <ResponsiveDashboardLayout>
          <SubscriptionPage />
        </ResponsiveDashboardLayout>
      </RoleProtectedRoute>
    } />
  </>
);
