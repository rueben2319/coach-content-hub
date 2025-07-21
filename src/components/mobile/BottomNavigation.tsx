
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  User,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const BottomNavigation: React.FC = () => {
  const { profile } = useAuth();
  const location = useLocation();

  if (!profile) return null;

  const getNavItems = () => {
    switch (profile.role) {
      case 'coach':
        return [
          { icon: User, label: 'Profile', path: '/coach/profile' },
          { icon: TrendingUp, label: 'Analytics', path: '/coach/analytics' },
          { icon: Users, label: 'Clients', path: '/coach/clients' },
          { icon: BookOpen, label: 'Content', path: '/coach/content' },
          { icon: LayoutDashboard, label: 'Dashboard', path: '/coach' },
        ];
      case 'client':
        return [
          { icon: User, label: 'Profile', path: '/client/profile' },
          { icon: TrendingUp, label: 'Progress', path: '/client/progress' },
          { icon: Users, label: 'Coaches', path: '/client/coaches' },
          { icon: BookOpen, label: 'Content', path: '/client/content' },
          { icon: LayoutDashboard, label: 'Dashboard', path: '/client' },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  const isActive = (path: string) => {
    if (path === '/coach' || path === '/client' || path === '/admin') {
      return location.pathname === path;
    }
    return location.pathname === path;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900 border-t border-gray-800">
      <nav className="flex items-center justify-around px-4 py-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              'flex flex-col items-center justify-center min-w-0 flex-1 px-2 py-1 text-xs transition-colors',
              isActive(item.path)
                ? 'text-white'
                : 'text-gray-400 hover:text-gray-300'
            )}
          >
            <item.icon className={cn(
              'h-6 w-6 mb-1',
              isActive(item.path) ? 'text-white' : 'text-gray-400'
            )} />
            <span className="truncate">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default BottomNavigation;
