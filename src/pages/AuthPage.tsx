
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import LoginForm from '@/components/auth/LoginForm';

const AuthPage = () => {
  const { user, loading, profile } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (user && profile) {
    const redirectMap = {
      admin: '/admin',
      coach: '/coach',
      client: '/client'
    };
    
    const redirectTo = redirectMap[profile.role];
    return <Navigate to={redirectTo || '/'} replace />;
  }

  return <LoginForm />;
};

export default AuthPage;
