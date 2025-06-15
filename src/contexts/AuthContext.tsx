
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Profile } from '@/types/profile';
import { profileService } from '@/services/profileService';
import { authService } from '@/services/authService';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, firstName: string, lastName: string, role: 'coach' | 'client') => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId);
      const profileData = await profileService.fetchProfile(userId);
      console.log('Profile fetched successfully:', profileData);
      setProfile(profileData);
      return profileData;
    } catch (error) {
      console.error('Error fetching profile:', error);
      setProfile(null);
      return null;
    }
  };

  useEffect(() => {
    console.log('AuthProvider: Initializing auth state');
    
    let mounted = true;

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log('Auth state changed:', event, 'Session exists:', !!newSession);
        
        if (!mounted) return;
        
        setSession(newSession);
        setUser(newSession?.user ?? null);
        
        if (newSession?.user) {
          console.log('User authenticated, fetching profile...');
          await fetchUserProfile(newSession.user.id);
        } else {
          console.log('No user, clearing profile');
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    // Initialize current session
    const initializeAuth = async () => {
      try {
        console.log('Getting current session...');
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
        }
        
        console.log('Current session:', !!currentSession);
        
        if (mounted) {
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
          
          if (currentSession?.user) {
            console.log('User found, fetching profile...');
            await fetchUserProfile(currentSession.user.id);
          }
          
          setLoading(false);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      console.log('AuthProvider: Cleaning up');
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      console.log('Signing in user:', email);
      await authService.signIn(email, password);

      toast({
        title: "Welcome back!",
        description: "You have been successfully signed in.",
      });
    } catch (error: any) {
      console.error('Sign in error:', error);
      toast({
        title: "Error signing in",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const signUp = async (email: string, password: string, firstName: string, lastName: string, role: 'coach' | 'client') => {
    try {
      setLoading(true);
      await authService.signUp(email, password, firstName, lastName, role);

      toast({
        title: "Account created!",
        description: "Please check your email to verify your account.",
      });
    } catch (error: any) {
      toast({
        title: "Error creating account",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      console.log('Signing out user');
      await authService.signOut();
      
      // Clear state immediately
      setUser(null);
      setProfile(null);
      setSession(null);
      
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return;

    try {
      await profileService.updateProfile(user.id, updates);

      // Update local profile state
      setProfile(prev => prev ? { ...prev, ...updates } : null);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error: any) {
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  console.log('AuthProvider render - User:', !!user, 'Profile:', !!profile, 'Loading:', loading);

  const contextValue: AuthContextType = {
    user,
    profile,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
