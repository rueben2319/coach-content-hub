import React from 'react';
import { Route } from 'react-router-dom';
import { RoleProtectedRoute } from './RoleProtectedRoute';
import DashboardLayout from '@/components/layout/DashboardLayout';
import CoachDashboard from '@/pages/coach/CoachDashboard';
import CoachProfile from '@/pages/coach/CoachProfile';
import SubscriptionPage from '@/pages/coach/SubscriptionPage';

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
    <Route path="/coach/subscription" element={
      <RoleProtectedRoute allowedRoles={['coach']}>
        <DashboardLayout>
          <SubscriptionPage />
        </DashboardLayout>
      </RoleProtectedRoute>
    } />
  </>
);
