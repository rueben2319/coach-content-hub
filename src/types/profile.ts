
export interface Profile {
  id: string;
  user_id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: 'admin' | 'coach' | 'client';
  bio: string | null;
  specialties: string[] | null;
  experience_years: number | null;
  location: string | null;
  avatar_url: string | null;
  is_public: boolean;
  profile_completed: boolean;
  created_at: string;
  updated_at: string;
  // Payment integration fields
  paychangu_enabled?: boolean;
  paychangu_public_key?: string;
  paychangu_secret_key?: string;
  payment_settings?: any; // allow Supabase's JSON or null, fixes build error
}
