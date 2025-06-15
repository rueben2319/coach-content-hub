
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import ResponsiveDashboardLayout from '@/components/layout/ResponsiveDashboardLayout';

// Auth pages
import Index from '@/pages/Index';
import AuthPage from '@/pages/AuthPage';
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

// Protected Route wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  console.log('ProtectedRoute - user:', user?.id, 'loading:', loading);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log('ProtectedRoute - No user, redirecting to /auth');
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

// Dashboard Route wrapper that redirects based on user role
const DashboardRoute: React.FC = () => {
  const { profile, loading } = useAuth();

  console.log('DashboardRoute - profile:', profile?.role, 'loading:', loading);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    console.log('DashboardRoute - No profile, redirecting to /auth');
    return <Navigate to="/auth" replace />;
  }

  // Redirect to appropriate dashboard based on role
  switch (profile.role) {
    case 'admin':
      console.log('DashboardRoute - Redirecting to /admin');
      return <Navigate to="/admin" replace />;
    case 'coach':
      console.log('DashboardRoute - Redirecting to /coach');
      return <Navigate to="/coach" replace />;
    case 'client':
      console.log('DashboardRoute - Redirecting to /client');
      return <Navigate to="/client" replace />;
    default:
      console.log('DashboardRoute - Unknown role, redirecting to /auth');
      return <Navigate to="/auth" replace />;
  }
};

function AppRoutes() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<AuthPage />} />
        
        {/* Dashboard redirect route */}
        <Route path="/dashboard" element={<DashboardRoute />} />
        
        {/* Admin routes */}
        <Route path="/admin" element={
          <ProtectedRoute>
            <ResponsiveDashboardLayout>
              <AdminDashboard />
            </ResponsiveDashboardLayout>
          </ProtectedRoute>
        } />
        
        {/* Coach routes */}
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
        
        {/* Client routes */}
        <Route path="/client" element={
          <ProtectedRoute>
            <ResponsiveDashboardLayout>
              <ClientDashboard />
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
              <ClientSubscriptionPage />
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
        <Route path="/client/content" element={
          <ProtectedRoute>
            <ResponsiveDashboardLayout>
              <BrowseContent />
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
        <Route path="/client/progress" element={
          <ProtectedRoute>
            <ResponsiveDashboardLayout>
              <Progress />
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
        <Route path="/client/coaches" element={
          <ProtectedRoute>
            <ResponsiveDashboardLayout>
              <Coaches />
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
        
        {/* Catch all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

function App() {
  console.log('App component rendering');
  
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <AppRoutes />
          <Toaster />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
