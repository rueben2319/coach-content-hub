
import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Index = () => {
  const { user, loading, profile } = useAuth();

  useEffect(() => {
    console.log('Index page - Auth state:', { 
      hasUser: !!user, 
      userId: user?.id, 
      hasProfile: !!profile, 
      profileRole: profile?.role, 
      isLoading: loading 
    });
  }, [user, profile, loading]);

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
    if (redirectTo) {
      console.log('Index - Redirecting to:', redirectTo);
      return <Navigate to={redirectTo} replace />;
    }
  }

  if (user && !profile) {
    // User exists but no profile - this shouldn't happen with the trigger
    // but handle it gracefully by showing a message and retry option
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Setting up your profile...</h2>
          <p className="text-gray-600 mb-4">We're preparing your account. This should only take a moment.</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Refresh Page
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-6">
            Experts Coach Hub
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8">
            Connect with expert coaches and unlock your potential through personalized learning experiences
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/auth">Get Started</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/auth">Sign In</Link>
            </Button>
          </div>
        </div>
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <span className="text-blue-600 text-xl">🎯</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Expert Coaching</h3>
            <p className="text-gray-600">Learn from industry experts with years of experience</p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-green-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <span className="text-green-600 text-xl">📚</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Quality Content</h3>
            <p className="text-gray-600">Access premium courses and learning materials</p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <span className="text-purple-600 text-xl">🚀</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
            <p className="text-gray-600">Monitor your learning journey and achievements</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
