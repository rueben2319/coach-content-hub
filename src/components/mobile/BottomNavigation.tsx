
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
          { icon: LayoutDashboard, label: 'Dashboard', path: '/coach' },
          { icon: BookOpen, label: 'Content', path: '/coach/content' },
          { icon: Users, label: 'Clients', path: '/coach/clients' },
          { icon: TrendingUp, label: 'Analytics', path: '/coach/analytics' },
          { icon: User, label: 'Profile', path: '/coach/profile' },
        ];
      case 'client':
        return [
          { icon: LayoutDashboard, label: 'Dashboard', path: '/client' },
          { icon: BookOpen, label: 'Content', path: '/client/content' },
          { icon: Users, label: 'Coaches', path: '/client/coaches' },
          { icon: TrendingUp, label: 'Progress', path: '/client/progress' },
          { icon: User, label: 'Profile', path: '/client/profile' },
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
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 safe-area-pb">
      <nav className="flex items-center justify-around px-2 py-1">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              'flex flex-col items-center justify-center min-w-0 flex-1 px-1 py-2 text-xs transition-colors touch-manipulation',
              isActive(item.path)
                ? 'text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            )}
          >
            <item.icon className={cn(
              'h-5 w-5 mb-1',
              isActive(item.path) ? 'text-blue-600' : 'text-gray-500'
            )} />
            <span className="truncate font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default BottomNavigation;
