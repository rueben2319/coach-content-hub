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
  X,
  Bell,
  MessageSquare,
  Calendar,
  Target,
  Award
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
          { icon: LayoutDashboard, label: 'Dashboard', path: '/admin', section: 'main' },
          { icon: Users, label: 'Coaches', path: '/admin/coaches', section: 'management' },
          { icon: UserCheck, label: 'Clients', path: '/admin/clients', section: 'management' },
          { icon: TrendingUp, label: 'Analytics', path: '/admin/analytics', section: 'insights' },
          { icon: CreditCard, label: 'Subscriptions', path: '/admin/subscriptions', section: 'business' },
          { icon: Settings, label: 'Settings', path: '/admin/settings', section: 'system' },
        ];
      case 'coach':
        return [
          { icon: LayoutDashboard, label: 'Dashboard', path: '/coach', section: 'main' },
          { icon: BookOpen, label: 'My Content', path: '/coach/content', section: 'content', badge: 'New' },
          { icon: Users, label: 'My Clients', path: '/coach/clients', section: 'clients' },
          { icon: Calendar, label: 'Schedule', path: '/coach/schedule', section: 'planning' },
          { icon: MessageSquare, label: 'Messages', path: '/coach/messages', section: 'communication' },
          { icon: TrendingUp, label: 'Analytics', path: '/coach/analytics', section: 'insights' },
          { icon: Award, label: 'Achievements', path: '/coach/achievements', section: 'progress' },
          { icon: User, label: 'Profile', path: '/coach/profile', section: 'account' },
          { icon: CreditCard, label: 'Subscription', path: '/coach/subscription', section: 'account' },
        ];
      case 'client':
        return [
          { icon: LayoutDashboard, label: 'Dashboard', path: '/client', section: 'main' },
          { icon: BookOpen, label: 'Browse Content', path: '/client/content', section: 'learning' },
          { icon: Target, label: 'My Goals', path: '/client/goals', section: 'progress' },
          { icon: FileText, label: 'My Progress', path: '/client/progress', section: 'progress' },
          { icon: Users, label: 'My Coaches', path: '/client/coaches', section: 'support' },
          { icon: Calendar, label: 'Sessions', path: '/client/sessions', section: 'scheduling' },
          { icon: MessageSquare, label: 'Messages', path: '/client/messages', section: 'communication' },
          { icon: Award, label: 'Achievements', path: '/client/achievements', section: 'progress', badge: 'New' },
          { icon: User, label: 'Profile', path: '/client/profile', section: 'account' },
          { icon: CreditCard, label: 'Subscription', path: '/client/subscription', section: 'account' },
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

  // Group menu items by section
  const groupedItems = menuItems.reduce((acc, item) => {
    if (!acc[item.section]) {
      acc[item.section] = [];
    }
    acc[item.section].push(item);
    return acc;
  }, {} as Record<string, typeof menuItems>);

  const getSectionTitle = (section: string) => {
    const titles = {
      main: 'Overview',
      content: 'Content Management',
      learning: 'Learning',
      clients: 'Client Management',
      support: 'Support',
      planning: 'Planning',
      scheduling: 'Scheduling',
      communication: 'Communication',
      progress: 'Progress & Goals',
      insights: 'Analytics',
      account: 'Account',
      management: 'User Management',
      business: 'Business',
      system: 'System'
    };
    return titles[section] || section;
  };

  // For desktop and tablet, return a properly positioned fixed sidebar
  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 flex flex-col z-30 shadow-sm">
      {/* Logo */}
      <div className="p-4 lg:p-6 border-b border-gray-200 flex-shrink-0">
        <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
          Experts Coach Hub
        </h1>
      </div>

      {/* User Info */}
      <div className="p-3 lg:p-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{displayName}</p>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="text-xs capitalize">
                {profile.role}
              </Badge>
              {profile.role !== 'admin' && (
                <Bell className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-pointer" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation - scrollable area */}
      <nav className="flex-1 p-3 lg:p-4 overflow-y-auto">
        {Object.entries(groupedItems).map(([section, items]) => (
          <div key={section} className="mb-6">
            {section !== 'main' && (
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3">
                {getSectionTitle(section)}
              </h3>
            )}
            <div className="space-y-1">
              {items.map((item) => {
                const isActive = isActiveMenuItem(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                    style={{ textDecoration: 'none' }}
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon className="w-4 h-4 lg:w-5 lg:h-5 flex-shrink-0" />
                      <span className="font-medium text-sm lg:text-base">{item.label}</span>
                    </div>
                    {item.badge && (
                      <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Sign Out - always visible at bottom */}
      <div className="p-3 lg:p-4 border-t border-gray-200 flex-shrink-0 mt-auto">
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-600 hover:text-gray-900 text-sm lg:text-base"
          onClick={signOut}
        >
          <LogOut className="w-4 h-4 lg:w-5 lg:h-5 mr-3 flex-shrink-0" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
