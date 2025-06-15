
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import ResponsiveDashboardLayout from '@/components/layout/ResponsiveDashboardLayout';

// Auth pages
import Index from '@/pages/Index';
import NotFound from '@/pages/NotFound';

// Admin pages
import AdminDashboard from '@/pages/admin/AdminDashboard';

// Coach pages
import CoachDashboard from '@/pages/coach/CoachDashboard';
import CoachProfile from '@/pages/coach/CoachProfile';
import SubscriptionPage from '@/pages/coach/SubscriptionPage';

// Client pages
import ClientDashboard from '@/pages/client/ClientDashboard';
import ClientProfile from '@/pages/client/ClientProfile';
import ClientSubscriptionPage from '@/pages/client/SubscriptionPage';
import CourseView from '@/pages/client/CourseView';
import BrowseContent from '@/pages/client/BrowseContent';
import Goals from '@/pages/client/Goals';
import Progress from '@/pages/client/Progress';
import Achievements from '@/pages/client/Achievements';
import Coaches from '@/pages/client/Coaches';
import Sessions from '@/pages/client/Sessions';
import Messages from '@/pages/client/Messages';

import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              
              {/* Admin routes */}
              <Route path="/admin" element={
                <ResponsiveDashboardLayout>
                  <AdminDashboard />
                </ResponsiveDashboardLayout>
              } />
              
              {/* Coach routes */}
              <Route path="/coach" element={
                <ResponsiveDashboardLayout>
                  <CoachDashboard />
                </ResponsiveDashboardLayout>
              } />
              <Route path="/coach/profile" element={
                <ResponsiveDashboardLayout>
                  <CoachProfile />
                </ResponsiveDashboardLayout>
              } />
              <Route path="/coach/subscription" element={
                <ResponsiveDashboardLayout>
                  <SubscriptionPage />
                </ResponsiveDashboardLayout>
              } />
              
              {/* Client routes */}
              <Route path="/client" element={
                <ResponsiveDashboardLayout>
                  <ClientDashboard />
                </ResponsiveDashboardLayout>
              } />
              <Route path="/client/profile" element={
                <ResponsiveDashboardLayout>
                  <ClientProfile />
                </ResponsiveDashboardLayout>
              } />
              <Route path="/client/subscription" element={
                <ResponsiveDashboardLayout>
                  <ClientSubscriptionPage />
                </ResponsiveDashboardLayout>
              } />
              <Route path="/client/courses/:courseId" element={
                <ResponsiveDashboardLayout>
                  <CourseView />
                </ResponsiveDashboardLayout>
              } />
              <Route path="/client/content" element={
                <ResponsiveDashboardLayout>
                  <BrowseContent />
                </ResponsiveDashboardLayout>
              } />
              <Route path="/client/goals" element={
                <ResponsiveDashboardLayout>
                  <Goals />
                </ResponsiveDashboardLayout>
              } />
              <Route path="/client/progress" element={
                <ResponsiveDashboardLayout>
                  <Progress />
                </ResponsiveDashboardLayout>
              } />
              <Route path="/client/achievements" element={
                <ResponsiveDashboardLayout>
                  <Achievements />
                </ResponsiveDashboardLayout>
              } />
              <Route path="/client/coaches" element={
                <ResponsiveDashboardLayout>
                  <Coaches />
                </ResponsiveDashboardLayout>
              } />
              <Route path="/client/sessions" element={
                <ResponsiveDashboardLayout>
                  <Sessions />
                </ResponsiveDashboardLayout>
              } />
              <Route path="/client/messages" element={
                <ResponsiveDashboardLayout>
                  <Messages />
                </ResponsiveDashboardLayout>
              } />
              
              {/* Catch all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          <Toaster />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
