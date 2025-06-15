
import { supabase } from '@/integrations/supabase/client';

export const authService = {
  async signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (error) {
      throw new Error(error.message);
    }
  },

  async signUp(email: string, password: string, firstName: string, lastName: string, role: 'coach' | 'client') {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          role: role,
        }
      }
    });

    if (error) {
      throw new Error(error.message);
    }
  },

  async signOut() {
    try {
      localStorage.removeItem('supabase.auth.token');
      
      const { error } = await supabase.auth.signOut();
      
      if (error && error.message !== 'Session not found') {
        throw new Error(error.message);
      }
      
      // Force reload to clear any remaining state
      window.location.href = '/auth';
    } catch (error: any) {
      console.error('Logout error:', error);
      // Force redirect even if logout fails
      window.location.href = '/auth';
    }
  }
};
