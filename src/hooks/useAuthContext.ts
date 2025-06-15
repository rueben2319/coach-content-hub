
import { useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContext';

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider. Make sure your component is wrapped with AuthProvider.');
  }
  
  return context;
};
