
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  Settings, 
  User, 
  CreditCard,
  FileText,
  UserCheck,
  TrendingUp,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';

const Sidebar = () => {
  const { profile, signOut } = useAuth();
  const location = useLocation();
  const isMobile = useIsMobile();

  if (!profile) return null;

  const getMenuItems = () => {
    switch (profile.role) {
      case 'admin':
        return [
          { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
          { icon: Users, label: 'Coaches', path: '/admin/coaches' },
          { icon: UserCheck, label: 'Clients', path: '/admin/clients' },
          { icon: TrendingUp, label: 'Analytics', path: '/admin/analytics' },
          { icon: CreditCard, label: 'Subscriptions', path: '/admin/subscriptions' },
          { icon: Settings, label: 'Settings', path: '/admin/settings' },
        ];
      case 'coach':
        return [
          { icon: LayoutDashboard, label: 'Dashboard', path: '/coach' },
          { icon: BookOpen, label: 'My Content', path: '/coach/content' },
          { icon: Users, label: 'My Clients', path: '/coach/clients' },
          { icon: TrendingUp, label: 'Analytics', path: '/coach/analytics' },
          { icon: User, label: 'Profile', path: '/coach/profile' },
          { icon: CreditCard, label: 'Subscription', path: '/coach/subscription' },
        ];
      case 'client':
        return [
          { icon: LayoutDashboard, label: 'Dashboard', path: '/client' },
          { icon: BookOpen, label: 'Browse Content', path: '/client/content' },
          { icon: Users, label: 'My Coaches', path: '/client/coaches' },
          { icon: FileText, label: 'My Progress', path: '/client/progress' },
          { icon: User, label: 'Profile', path: '/client/profile' },
          { icon: CreditCard, label: 'Subscription', path: '/client/subscription' },
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();
  const fullName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim();
  const displayName = fullName || profile.email;
  const initials = fullName ? `${profile.first_name?.[0] || ''}${profile.last_name?.[0] || ''}`.toUpperCase() : profile.email[0].toUpperCase();

  const isActiveMenuItem = (itemPath: string) => {
    const dashboardRoots = ['/admin', '/coach', '/client'];
    if (dashboardRoots.includes(itemPath)) {
      return location.pathname === itemPath;
    }
    return location.pathname === itemPath;
  };

  // For desktop, return a properly positioned fixed sidebar
  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 flex flex-col z-30">
      {/* Logo */}
      <div className="p-4 md:p-6 border-b border-gray-200 flex-shrink-0">
        <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
          CoachHub
        </h1>
      </div>

      {/* User Info */}
      <div className="p-3 md:p-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{displayName}</p>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="text-xs capitalize">
                {profile.role}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation - scrollable area */}
      <nav className="flex-1 p-3 md:p-4 space-y-1 md:space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = isActiveMenuItem(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
              style={{ textDecoration: 'none' }}
            >
              <item.icon className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
              <span className="font-medium text-sm md:text-base">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Sign Out - always visible at bottom */}
      <div className="p-3 md:p-4 border-t border-gray-200 flex-shrink-0">
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-600 hover:text-gray-900 text-sm md:text-base"
          onClick={signOut}
        >
          <LogOut className="w-4 h-4 md:w-5 md:h-5 mr-3 flex-shrink-0" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
