
export interface User {
  id: string;
  email: string;
  role: 'admin' | 'coach' | 'client';
  name: string;
  avatar?: string;
  subscription_status?: 'active' | 'inactive' | 'trial';
  subscription_tier?: 'basic' | 'premium' | 'enterprise';
  created_at: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string, role: 'coach' | 'client') => Promise<void>;
  signOut: () => void;
}
