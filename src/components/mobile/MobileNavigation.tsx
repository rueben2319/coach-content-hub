
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  User,
  TrendingUp,
  Target,
  Calendar,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface NavItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  path: string;
  badge?: string;
}

export function MobileNavigation() {
  const { profile } = useAuth();
  const location = useLocation();

  if (!profile) return null;

  const getNavItems = (): NavItem[] => {
    switch (profile.role) {
      case 'admin':
        return [
          { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
          { icon: Users, label: 'Users', path: '/admin/coaches' },
          { icon: TrendingUp, label: 'Analytics', path: '/admin/analytics' },
          { icon: User, label: 'Settings', path: '/admin/settings' },
        ];
      case 'coach':
        return [
          { icon: LayoutDashboard, label: 'Dashboard', path: '/coach' },
          { icon: BookOpen, label: 'Content', path: '/coach/content' },
          { icon: Users, label: 'Clients', path: '/coach/clients' },
          { icon: User, label: 'Profile', path: '/coach/profile' },
        ];
      case 'client':
        return [
          { icon: LayoutDashboard, label: 'Home', path: '/client' },
          { icon: BookOpen, label: 'Learn', path: '/client/content' },
          { icon: Target, label: 'Goals', path: '/client/goals' },
          { icon: Calendar, label: 'Sessions', path: '/client/sessions' },
          { icon: User, label: 'Profile', path: '/client/profile' },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  const isActive = (path: string) => {
    const dashboardRoots = ['/admin', '/coach', '/client'];
    if (dashboardRoots.includes(path)) {
      return location.pathname === path;
    }
    return location.pathname === path;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-1 z-50 md:hidden">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-all duration-200 min-w-[60px] min-h-[48px]",
                "touch-manipulation active:scale-95",
                active 
                  ? "text-primary bg-primary-50" 
                  : "text-gray-600 hover:text-gray-900 active:bg-gray-100"
              )}
            >
              <item.icon className={cn("w-5 h-5 mb-1", active ? "text-primary" : "text-gray-600")} />
              <span className={cn("text-xs font-medium", active ? "text-primary" : "text-gray-600")}>
                {item.label}
              </span>
              {item.badge && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
