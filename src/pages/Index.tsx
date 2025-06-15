
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Users, TrendingUp, Award, ArrowRight, CheckCircle } from 'lucide-react';

const Index = () => {
  const { user, profile, loading } = useAuth();

  // If user is authenticated, redirect to appropriate dashboard
  if (!loading && user && profile) {
    switch (profile.role) {
      case 'admin':
        return <Navigate to="/admin" replace />;
      case 'coach':
        return <Navigate to="/coach" replace />;
      case 'client':
        return <Navigate to="/client" replace />;
    }
  }

  // Show loading while checking authentication
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

  const features = [
    {
      icon: BookOpen,
      title: "Rich Content Creation",
      description: "Create engaging courses with videos, documents, and interactive content"
    },
    {
      icon: Users,
      title: "Client Management",
      description: "Manage your coaching relationships and track client progress"
    },
    {
      icon: TrendingUp,
      title: "Analytics & Insights",
      description: "Monitor engagement and track learning outcomes with detailed analytics"
    },
    {
      icon: Award,
      title: "Achievement System",
      description: "Motivate learners with badges, certificates, and progress tracking"
    }
  ];

  const benefits = [
    "Streamlined coaching workflows",
    "Professional course creation tools",
    "Client progress tracking",
    "Mobile-responsive design",
    "Secure payment processing",
    "24/7 customer support"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            Experts Coach Hub
          </h1>
          <div className="space-x-4">
            <Link to="/auth">
              <Button variant="outline">Sign In</Button>
            </Link>
            <Link to="/auth">
              <Button>Get Started</Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-5xl font-bold text-gray-900 mb-6">
          Empower Your Coaching
          <span className="block bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            Transform Lives
          </span>
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          The all-in-one platform for coaches to create, manage, and deliver exceptional learning experiences. 
          Build your coaching business with powerful tools designed for success.
        </p>
        <div className="space-x-4">
          <Link to="/auth">
            <Button size="lg" className="text-lg px-8 py-4">
              Start Your Journey <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Button size="lg" variant="outline" className="text-lg px-8 py-4">
            Watch Demo
          </Button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-20">
        <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Everything You Need to Succeed
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <feature.icon className="h-12 w-12 mx-auto text-blue-600 mb-4" />
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                Why Choose Experts Coach Hub?
              </h3>
              <p className="text-lg text-gray-600 mb-8">
                Join thousands of successful coaches who trust Experts Coach Hub to grow their business and impact more lives.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-100 to-green-100 rounded-2xl p-8">
              <div className="text-center">
                <h4 className="text-2xl font-bold text-gray-900 mb-4">Ready to Get Started?</h4>
                <p className="text-gray-600 mb-6">
                  Join our community of coaches and start building your impact today.
                </p>
                <Link to="/auth">
                  <Button size="lg" className="w-full">
                    Create Your Account
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent mb-4">
            Experts Coach Hub
          </h1>
          <p className="text-gray-400 mb-6">
            Empowering coaches to transform lives through exceptional learning experiences.
          </p>
          <div className="flex justify-center space-x-8 text-sm text-gray-400">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
          <p className="text-gray-500 text-sm mt-8">
            © 2024 Experts Coach Hub. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
