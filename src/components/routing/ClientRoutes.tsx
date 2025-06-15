
import React from 'react';
import { Route } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import ResponsiveDashboardLayout from '@/components/layout/ResponsiveDashboardLayout';
import ClientDashboard from '@/pages/client/ClientDashboard';
import BrowseContent from '@/pages/client/BrowseContent';
import CourseView from '@/pages/client/CourseView';
import Progress from '@/pages/client/Progress';
import Goals from '@/pages/client/Goals';
import Achievements from '@/pages/client/Achievements';
import Sessions from '@/pages/client/Sessions';
import Messages from '@/pages/client/Messages';
import Coaches from '@/pages/client/Coaches';
import ClientProfile from '@/pages/client/ClientProfile';
import SubscriptionPage from '@/pages/client/SubscriptionPage';

export const ClientRoutes = () => (
  <>
    <Route path="/client" element={
      <ProtectedRoute>
        <ResponsiveDashboardLayout>
          <ClientDashboard />
        </ResponsiveDashboardLayout>
      </ProtectedRoute>
    } />
    <Route path="/client/browse" element={
      <ProtectedRoute>
        <ResponsiveDashboardLayout>
          <BrowseContent />
        </ResponsiveDashboardLayout>
      </ProtectedRoute>
    } />
    <Route path="/client/content" element={
      <ProtectedRoute>
        <ResponsiveDashboardLayout>
          <BrowseContent />
        </ResponsiveDashboardLayout>
      </ProtectedRoute>
    } />
    <Route path="/client/courses/:courseId" element={
      <ProtectedRoute>
        <ResponsiveDashboardLayout>
          <CourseView />
        </ResponsiveDashboardLayout>
      </ProtectedRoute>
    } />
    <Route path="/client/progress" element={
      <ProtectedRoute>
        <ResponsiveDashboardLayout>
          <Progress />
        </ResponsiveDashboardLayout>
      </ProtectedRoute>
    } />
    <Route path="/client/goals" element={
      <ProtectedRoute>
        <ResponsiveDashboardLayout>
          <Goals />
        </ResponsiveDashboardLayout>
      </ProtectedRoute>
    } />
    <Route path="/client/achievements" element={
      <ProtectedRoute>
        <ResponsiveDashboardLayout>
          <Achievements />
        </ResponsiveDashboardLayout>
      </ProtectedRoute>
    } />
    <Route path="/client/sessions" element={
      <ProtectedRoute>
        <ResponsiveDashboardLayout>
          <Sessions />
        </ResponsiveDashboardLayout>
      </ProtectedRoute>
    } />
    <Route path="/client/messages" element={
      <ProtectedRoute>
        <ResponsiveDashboardLayout>
          <Messages />
        </ResponsiveDashboardLayout>
      </ProtectedRoute>
    } />
    <Route path="/client/coaches" element={
      <ProtectedRoute>
        <ResponsiveDashboardLayout>
          <Coaches />
        </ResponsiveDashboardLayout>
      </ProtectedRoute>
    } />
    <Route path="/client/profile" element={
      <ProtectedRoute>
        <ResponsiveDashboardLayout>
          <ClientProfile />
        </ResponsiveDashboardLayout>
      </ProtectedRoute>
    } />
    <Route path="/client/subscription" element={
      <ProtectedRoute>
        <ResponsiveDashboardLayout>
          <SubscriptionPage />
        </ResponsiveDashboardLayout>
      </ProtectedRoute>
    } />
  </>
);
