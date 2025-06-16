
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import AuthForm from '@/components/auth/AuthForm';

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="flex items-center justify-center min-h-screen px-4 py-12">
        <div className="w-full max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Left side - Branding/Welcome */}
            <div className="hidden lg:flex flex-col justify-center space-y-6">
              <div className="text-center lg:text-left">
                <h1 className="text-4xl xl:text-5xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-4">
                  Welcome to Experts Coach Hub
                </h1>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Connect with expert coaches and unlock your potential through personalized learning experiences.
                </p>
                <div className="space-y-4 text-gray-600">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold">✓</span>
                    </div>
                    <span>Learn from certified professional coaches</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 font-semibold">✓</span>
                    </div>
                    <span>Access personalized learning paths</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-purple-600 font-semibold">✓</span>
                    </div>
                    <span>Track your progress and achievements</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right side - Auth Form */}
            <div className="flex justify-center lg:justify-end">
              <AuthForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
