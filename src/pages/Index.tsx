
import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Index = () => {
  const { user, loading, profile } = useAuth();

  console.log('Index page render - User:', !!user, 'Profile role:', profile?.role, 'Loading:', loading);

  useEffect(() => {
    console.log('Index page mounted');
    console.log('Current auth state:', { 
      hasUser: !!user, 
      userId: user?.id, 
      hasProfile: !!profile, 
      profileRole: profile?.role, 
      isLoading: loading 
    });
  }, [user, profile, loading]);

  // Show loading while checking authentication
  if (loading) {
    console.log('Index: Showing loading state');
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is authenticated with a complete profile, redirect to appropriate dashboard
  if (user && profile) {
    console.log('Index: User authenticated with profile, redirecting based on role:', profile.role);
    
    switch (profile.role) {
      case 'admin':
        console.log('Redirecting to admin dashboard');
        return <Navigate to="/admin" replace />;
      case 'coach':
        console.log('Redirecting to coach dashboard');
        return <Navigate to="/coach" replace />;
      case 'client':
        console.log('Redirecting to client browse page');
        return <Navigate to="/client/browse" replace />;
      default:
        console.warn('Unknown role:', profile.role, 'redirecting to auth');
        return <Navigate to="/auth" replace />;
    }
  }

  // If user exists but no profile, there's an issue - redirect to auth
  if (user && !profile && !loading) {
    console.warn('User exists but no profile found, redirecting to auth');
    return <Navigate to="/auth" replace />;
  }

  console.log('Index: Showing landing page for non-authenticated users');

  // Show landing page for non-authenticated users
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

        {/* Debug info for troubleshooting */}
        <div className="mt-8 p-4 bg-blue-50 rounded text-sm text-blue-800 max-w-md mx-auto">
          <strong>Debug Info:</strong><br/>
          User ID: {user?.id || 'Not authenticated'}<br/>
          Profile Role: {profile?.role || 'No profile'}<br/>
          Loading: {loading ? 'Yes' : 'No'}<br/>
          Current URL: {window.location.href}
        </div>
      </div>
    </div>
  );
};

export default Index;
