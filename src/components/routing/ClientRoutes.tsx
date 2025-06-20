import React from 'react';
import { Route } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import DashboardLayout from '@/components/layout/DashboardLayout';
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
        <DashboardLayout>
          <ClientDashboard />
        </DashboardLayout>
      </ProtectedRoute>
    } />
    <Route path="/client/browse" element={
      <ProtectedRoute>
        <DashboardLayout>
          <BrowseContent />
        </DashboardLayout>
      </ProtectedRoute>
    } />
    <Route path="/client/content" element={
      <ProtectedRoute>
        <DashboardLayout>
          <BrowseContent />
        </DashboardLayout>
      </ProtectedRoute>
    } />
    <Route path="/client/courses/:courseId" element={
      <ProtectedRoute>
        <DashboardLayout>
          <CourseView />
        </DashboardLayout>
      </ProtectedRoute>
    } />
    <Route path="/client/progress" element={
      <ProtectedRoute>
        <DashboardLayout>
          <Progress />
        </DashboardLayout>
      </ProtectedRoute>
    } />
    <Route path="/client/goals" element={
      <ProtectedRoute>
        <DashboardLayout>
          <Goals />
        </DashboardLayout>
      </ProtectedRoute>
    } />
    <Route path="/client/achievements" element={
      <ProtectedRoute>
        <DashboardLayout>
          <Achievements />
        </DashboardLayout>
      </ProtectedRoute>
    } />
    <Route path="/client/sessions" element={
      <ProtectedRoute>
        <DashboardLayout>
          <Sessions />
        </DashboardLayout>
      </ProtectedRoute>
    } />
    <Route path="/client/messages" element={
      <ProtectedRoute>
        <DashboardLayout>
          <Messages />
        </DashboardLayout>
      </ProtectedRoute>
    } />
    <Route path="/client/coaches" element={
      <ProtectedRoute>
        <DashboardLayout>
          <Coaches />
        </DashboardLayout>
      </ProtectedRoute>
    } />
    <Route path="/client/profile" element={
      <ProtectedRoute>
        <DashboardLayout>
          <ClientProfile />
        </DashboardLayout>
      </ProtectedRoute>
    } />
    <Route path="/client/subscription" element={
      <ProtectedRoute>
        <DashboardLayout>
          <SubscriptionPage />
        </DashboardLayout>
      </ProtectedRoute>
    } />
  </>
);
