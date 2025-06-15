
import React from 'react';
import { Route } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import ResponsiveDashboardLayout from '@/components/layout/ResponsiveDashboardLayout';
import CoachDashboard from '@/pages/coach/CoachDashboard';
import CoachProfile from '@/pages/coach/CoachProfile';
import SubscriptionPage from '@/pages/coach/SubscriptionPage';

export const CoachRoutes = () => (
  <>
    <Route path="/coach" element={
      <ProtectedRoute>
        <ResponsiveDashboardLayout>
          <CoachDashboard />
        </ResponsiveDashboardLayout>
      </ProtectedRoute>
    } />
    <Route path="/coach/profile" element={
      <ProtectedRoute>
        <ResponsiveDashboardLayout>
          <CoachProfile />
        </ResponsiveDashboardLayout>
      </ProtectedRoute>
    } />
    <Route path="/coach/subscription" element={
      <ProtectedRoute>
        <ResponsiveDashboardLayout>
          <SubscriptionPage />
        </ResponsiveDashboardLayout>
      </ProtectedRoute>
    } />
  </>
);
