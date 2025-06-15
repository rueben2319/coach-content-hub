
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/profile';

export const profileService = {
  async fetchProfile(userId: string): Promise<Profile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        throw new Error(error.message);
      }

      if (!data) {
        // Profile should be created automatically by the trigger
        // If it doesn't exist, something went wrong
        console.warn('No profile found for user:', userId);
        return null;
      }

      return data;
    } catch (error: any) {
      console.error('Error in fetchProfile:', error);
      throw new Error(error.message || 'Failed to fetch profile');
    }
  },

  async updateProfile(userId: string, updates: Partial<Profile>): Promise<void> {
    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', userId);

      if (error) {
        throw new Error(error.message);
      }
    } catch (error: any) {
      console.error('Error in updateProfile:', error);
      throw new Error(error.message || 'Failed to update profile');
    }
  }
};
