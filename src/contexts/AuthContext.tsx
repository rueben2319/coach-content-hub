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

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
      console.log('Profile fetched:', profileData);
      setProfile(profileData);
      return profileData;
    } catch (error) {
      console.error('Error fetching profile:', error);
      setProfile(null);
      return null;
    }
  };

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log('Initializing auth...');
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
        }
        
        if (mounted) {
          console.log('Setting initial session:', !!currentSession);
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
          
          if (currentSession?.user) {
            console.log('Fetching profile for user:', currentSession.user.id);
            await fetchUserProfile(currentSession.user.id);
          }
          
          console.log('Auth initialization complete - setting loading to false');
          setLoading(false);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          setUser(null);
          setProfile(null);
          setSession(null);
          setLoading(false);
        }
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        if (!mounted) return;
        
        console.log('Auth state change:', event, !!newSession);
        
        try {
          setSession(newSession);
          setUser(newSession?.user ?? null);
          
          if (newSession?.user) {
            console.log('Fetching profile after auth change:', newSession.user.id);
            await fetchUserProfile(newSession.user.id);
          } else {
            setProfile(null);
          }
          
          // Always ensure loading is false after any auth state change
          console.log('Setting loading to false after auth state change:', event);
          setLoading(false);
        } catch (error) {
          console.error('Auth state change error:', error);
          if (mounted) {
            setUser(null);
            setProfile(null);
            setSession(null);
            setLoading(false);
          }
        }
      }
    );

    // Initialize auth
    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      await authService.signIn(email, password);

      toast({
        title: "Welcome back!",
        description: "You have been successfully signed in.",
      });
    } catch (error: any) {
      console.error('Sign in error:', error);
      toast({
        title: "Error signing in",
        description: error.message || "Failed to sign in. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
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
      console.error('Sign up error:', error);
      toast({
        title: "Error creating account",
        description: error.message || "Failed to create account. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await authService.signOut();
      
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
        description: error.message || "Failed to sign out.",
        variant: "destructive",
      });
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) {
      throw new Error('No authenticated user found');
    }

    try {
      await profileService.updateProfile(user.id, updates);
      setProfile(prev => prev ? { ...prev, ...updates } : null);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error: any) {
      console.error('Update profile error:', error);
      toast({
        title: "Error updating profile",
        description: error.message || "Failed to update profile.",
        variant: "destructive",
      });
      throw error;
    }
  };

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
