
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/profile';

export const profileService = {
  async fetchProfile(userId: string): Promise<Profile | null> {
    try {
      console.log('Fetching profile for user:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      if (!data) {
        console.log('No profile found for user:', userId);
        return await this.createProfile(userId);
      }

      console.log('Profile fetched successfully:', data);
      return data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  },

  async createProfile(userId: string): Promise<Profile | null> {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return null;

      console.log('Creating profile for user:', userId);
      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert({
          user_id: userId,
          email: userData.user.email || '',
          role: 'client' as const,
          first_name: userData.user.user_metadata?.first_name || null,
          last_name: userData.user.user_metadata?.last_name || null,
        })
        .select()
        .maybeSingle();

      if (createError) {
        console.error('Error creating profile:', createError);
        return null;
      }

      console.log('Profile created successfully:', newProfile);
      return newProfile;
    } catch (error) {
      console.error('Error creating profile:', error);
      return null;
    }
  },

  async updateProfile(userId: string, updates: Partial<Profile>): Promise<void> {
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('user_id', userId);

    if (error) {
      throw error;
    }
  }
};
