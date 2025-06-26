
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export const DashboardRoute: React.FC = () => {
  const { profile, loading, user } = useAuth();

  console.log('DashboardRoute - Auth state:', { 
    hasUser: !!user,
    hasProfile: !!profile, 
    profileRole: profile?.role, 
    loading 
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    console.log('DashboardRoute - No user or profile, redirecting to /auth');
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
