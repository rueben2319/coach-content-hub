
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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is authenticated and has a profile, redirect to appropriate dashboard
  if (user && profile) {
    console.log('Index - User authenticated with profile, redirecting to dashboard');
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

  // If user exists but no profile, show loading state
  if (user && !profile) {
    console.log('Index - User exists but no profile found');
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Setting up your profile...</h2>
          <p className="text-gray-600 mb-4">We're preparing your account. This should only take a moment.</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Refresh Page
          </Button>
        </div>
      </div>
    );
  }

  // Show landing page for non-authenticated users
  console.log('Index - No user found, showing landing page');
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="container-constrained section-padding">
        <div className="text-center max-w-4xl mx-auto space-y-8">
          <div className="space-y-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
              Transform Your Learning with{' '}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Expert Coaching
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto">
              Connect with certified professional coaches and unlock your potential through personalized learning experiences designed for your success.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="w-full sm:w-auto px-8 py-3 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-200 bg-blue-600 hover:bg-blue-700" asChild>
              <Link to="/auth">Start Learning Today</Link>
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto px-8 py-3 text-base font-semibold border-slate-300 text-slate-700 hover:bg-slate-50 transition-all duration-200" asChild>
              <Link to="/auth">Sign In</Link>
            </Button>
          </div>
        </div>
        
        <div className="mt-16 sm:mt-20 lg:mt-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
            <div className="text-center p-6 sm:p-8 bg-white rounded-2xl shadow-soft border border-slate-100 hover:shadow-medium transition-all duration-200">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl mx-auto mb-6 flex items-center justify-center shadow-lg">
                <span className="text-white text-2xl font-bold">🎯</span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-3">Expert Coaching</h3>
              <p className="text-slate-600 leading-relaxed">Learn from certified industry professionals with proven track records and years of hands-on experience.</p>
            </div>
            
            <div className="text-center p-6 sm:p-8 bg-white rounded-2xl shadow-soft border border-slate-100 hover:shadow-medium transition-all duration-200">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl mx-auto mb-6 flex items-center justify-center shadow-lg">
                <span className="text-white text-2xl font-bold">📚</span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-3">Premium Content</h3>
              <p className="text-slate-600 leading-relaxed">Access high-quality courses, interactive materials, and resources tailored to your learning goals.</p>
            </div>
            
            <div className="text-center p-6 sm:p-8 bg-white rounded-2xl shadow-soft border border-slate-100 hover:shadow-medium transition-all duration-200">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl mx-auto mb-6 flex items-center justify-center shadow-lg">
                <span className="text-white text-2xl font-bold">🚀</span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-3">Track Progress</h3>
              <p className="text-slate-600 leading-relaxed">Monitor your learning journey with detailed analytics and celebrate achievements along the way.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
