
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

const AuthForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp } = useAuth();

  const [signInData, setSignInData] = useState({
    email: '',
    password: '',
  });

  const [signUpData, setSignUpData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    role: 'client' as 'coach' | 'client',
  });

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signIn(signInData.email, signInData.password);
    } catch (error) {
      console.error('Sign in error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (signUpData.password !== signUpData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      await signUp(
        signUpData.email,
        signUpData.password,
        signUpData.firstName,
        signUpData.lastName,
        signUpData.role
      );
    } catch (error) {
      console.error('Sign up error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-xl border-0 bg-white/95 backdrop-blur-sm">
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-2xl font-bold text-gray-900">
          Get Started
        </CardTitle>
        <CardDescription className="text-gray-600">
          Sign in to your account or create a new one
        </CardDescription>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-100">
            <TabsTrigger 
              value="signin" 
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all"
            >
              Sign In
            </TabsTrigger>
            <TabsTrigger 
              value="signup"
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all"
            >
              Sign Up
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="signin" className="space-y-0">
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signin-email" className="text-sm font-medium text-gray-700">
                  Email Address
                </Label>
                <Input
                  id="signin-email"
                  type="email"
                  placeholder="Enter your email"
                  value={signInData.email}
                  onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                  className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signin-password" className="text-sm font-medium text-gray-700">
                  Password
                </Label>
                <Input
                  id="signin-password"
                  type="password"
                  placeholder="Enter your password"
                  value={signInData.password}
                  onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                  className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full h-11 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium transition-all duration-200 shadow-md hover:shadow-lg" 
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign In to Your Account
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="signup" className="space-y-0">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="signup-firstname" className="text-sm font-medium text-gray-700">
                    First Name
                  </Label>
                  <Input
                    id="signup-firstname"
                    type="text"
                    placeholder="First name"
                    value={signUpData.firstName}
                    onChange={(e) => setSignUpData({ ...signUpData, firstName: e.target.value })}
                    className="h-11 border-gray-200 focus:border-green-500 focus:ring-green-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-lastname" className="text-sm font-medium text-gray-700">
                    Last Name
                  </Label>
                  <Input
                    id="signup-lastname"
                    type="text"
                    placeholder="Last name"
                    value={signUpData.lastName}
                    onChange={(e) => setSignUpData({ ...signUpData, lastName: e.target.value })}
                    className="h-11 border-gray-200 focus:border-green-500 focus:ring-green-500"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email" className="text-sm font-medium text-gray-700">
                  Email Address
                </Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="Enter your email"
                  value={signUpData.email}
                  onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                  className="h-11 border-gray-200 focus:border-green-500 focus:ring-green-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-role" className="text-sm font-medium text-gray-700">
                  Join As
                </Label>
                <Select value={signUpData.role} onValueChange={(value: 'coach' | 'client') => setSignUpData({ ...signUpData, role: value })}>
                  <SelectTrigger className="h-11 border-gray-200 focus:border-green-500 focus:ring-green-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="client">
                      <div className="flex flex-col items-start">
                        <span className="font-medium">Client</span>
                        <span className="text-xs text-gray-500">Learn from expert coaches</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="coach">
                      <div className="flex flex-col items-start">
                        <span className="font-medium">Coach</span>
                        <span className="text-xs text-gray-500">Teach and create courses</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password" className="text-sm font-medium text-gray-700">
                  Password
                </Label>
                <Input
                  id="signup-password"
                  type="password"
                  placeholder="Create a password"
                  value={signUpData.password}
                  onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                  className="h-11 border-gray-200 focus:border-green-500 focus:ring-green-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-confirm-password" className="text-sm font-medium text-gray-700">
                  Confirm Password
                </Label>
                <Input
                  id="signup-confirm-password"
                  type="password"
                  placeholder="Confirm your password"
                  value={signUpData.confirmPassword}
                  onChange={(e) => setSignUpData({ ...signUpData, confirmPassword: e.target.value })}
                  className="h-11 border-gray-200 focus:border-green-500 focus:ring-green-500"
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full h-11 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium transition-all duration-200 shadow-md hover:shadow-lg" 
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Your Account
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AuthForm;
