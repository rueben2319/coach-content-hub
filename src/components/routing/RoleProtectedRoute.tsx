
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Profile } from '@/types/profile';

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: Profile['role'][];
  redirectTo?: string;
}

export const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({ 
  children, 
  allowedRoles, 
  redirectTo = '/auth' 
}) => {
  const { user, profile, loading } = useAuth();

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

  if (!user || !profile) {
    return <Navigate to={redirectTo} replace />;
  }

  if (!allowedRoles.includes(profile.role)) {
    // Redirect to appropriate dashboard based on user's actual role
    const roleRedirects = {
      admin: '/admin',
      coach: '/coach',
      client: '/client'
    };
    
    return <Navigate to={roleRedirects[profile.role] || '/'} replace />;
  }

  return <>{children}</>;
};
