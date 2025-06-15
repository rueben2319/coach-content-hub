
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthContextType, User } from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock data for demonstration
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@coachplatform.com',
    role: 'admin',
    name: 'Admin User',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    email: 'coach@example.com',
    role: 'coach',
    name: 'Sarah Johnson',
    subscription_status: 'active',
    subscription_tier: 'premium',
    created_at: '2024-01-15T00:00:00Z'
  },
  {
    id: '3',
    email: 'client@example.com',
    role: 'client',
    name: 'John Smith',
    subscription_status: 'active',
    subscription_tier: 'basic',
    created_at: '2024-02-01T00:00:00Z'
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for existing session
    const savedUser = localStorage.getItem('coachPlatformUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    // Mock authentication
    const foundUser = mockUsers.find(u => u.email === email);
    if (foundUser && password === 'password') {
      setUser(foundUser);
      localStorage.setItem('coachPlatformUser', JSON.stringify(foundUser));
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const signUp = async (email: string, password: string, name: string, role: 'coach' | 'client') => {
    // Mock user creation
    const newUser: User = {
      id: Date.now().toString(),
      email,
      role,
      name,
      subscription_status: 'trial',
      subscription_tier: 'basic',
      created_at: new Date().toISOString()
    };
    setUser(newUser);
    localStorage.setItem('coachPlatformUser', JSON.stringify(newUser));
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('coachPlatformUser');
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
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
