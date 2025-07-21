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
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-slate-200 z-50 md:hidden safe-area-pb">
      <div className="flex justify-around items-center px-2 py-2">
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all duration-200 min-w-[64px] min-h-[56px] relative",
                "touch-manipulation active:scale-95",
                active 
                  ? "text-blue-600 bg-blue-50" 
                  : "text-slate-600 hover:text-slate-900 active:bg-slate-100"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5 mb-1 transition-colors", 
                active ? "text-blue-600" : "text-slate-600"
              )} />
              <span className={cn(
                "text-xs font-medium leading-tight transition-colors", 
                active ? "text-blue-600" : "text-slate-600"
              )}>
                {item.label}
              </span>
              {item.badge && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-semibold shadow-sm">
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
