
import { supabase } from '@/integrations/supabase/client';

export const authService = {
  async signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }
  },

  async signUp(email: string, password: string, firstName: string, lastName: string, role: 'coach' | 'client') {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          first_name: firstName,
          last_name: lastName,
          role: role,
        }
      }
    });

    if (error) {
      throw error;
    }
  },

  async signOut() {
    try {
      // Clear any local storage items related to auth
      localStorage.removeItem('supabase.auth.token');
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.warn('Logout warning:', error.message);
        // Don't throw error for session_not_found as user is effectively logged out
        if (error.message !== 'Session not found') {
          throw error;
        }
      }
      
      // Force reload to clear any remaining state
      window.location.href = '/auth';
    } catch (error) {
      console.error('Logout error:', error);
      // Force redirect even if logout fails
      window.location.href = '/auth';
    }
  }
};
