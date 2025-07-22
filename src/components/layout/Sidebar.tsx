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
  Award,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';

const Sidebar = () => {
  const { profile, signOut } = useAuth();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [hoveredSection, setHoveredSection] = useState(null);

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
          { icon: BookOpen, label: 'Content Hub', path: '/coach/content', section: 'content', badge: 'New' },
          { icon: Users, label: 'My Clients', path: '/coach/clients', section: 'clients' },
          { icon: Calendar, label: 'Schedule', path: '/coach/schedule', section: 'planning' },
          { icon: MessageSquare, label: 'Messages', path: '/coach/messages', section: 'communication' },
          { icon: TrendingUp, label: 'Analytics', path: '/coach/analytics', section: 'insights' },
          { icon: Award, label: 'Achievements', path: '/coach/achievements', section: 'progress' },
          { icon: User, label: 'Profile', path: '/coach/profile', section: 'account' },
          { icon: CreditCard, label: 'Subscription Hub', path: '/coach/subscription', section: 'account', badge: 'Updated' },
        ];
      case 'client':
        return [
          { icon: LayoutDashboard, label: 'Dashboard', path: '/client', section: 'main' },
          { icon: BookOpen, label: 'Browse Content', path: '/client/browse', section: 'learning' },
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

  return (
    <div className="fixed left-0 top-0 h-full w-72 bg-gradient-to-b from-slate-50 to-white border-r border-slate-200/60 flex flex-col z-30 shadow-xl overflow-hidden">
      {/* Logo */}
      <div className="p-6 border-b border-slate-200/60 flex-shrink-0 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-purple-600 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg">E</span>
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Experts Coach Hub
            </h1>
            <p className="text-xs text-slate-500 font-medium">Platform</p>
          </div>
        </div>
      </div>

      {/* Navigation - scrollable area */}
      <nav className="flex-1 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
        {Object.entries(groupedItems).map(([section, items]) => (
          <div key={section} className="mb-8">
            {section !== 'main' && (
              <div 
                className="mb-4"
                onMouseEnter={() => setHoveredSection(section)}
                onMouseLeave={() => setHoveredSection(null)}
              >
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-3 mb-3 flex items-center justify-between">
                  <span>{getSectionTitle(section)}</span>
                  {hoveredSection === section && (
                    <ChevronRight className="w-3 h-3 text-slate-400" />
                  )}
                </h3>
                <div className="h-px bg-gradient-to-r from-slate-200 via-slate-100 to-transparent"></div>
              </div>
            )}
            <div className="space-y-1">
              {items.map((item) => {
                const isActive = isActiveMenuItem(item.path);
                return (
                  <div key={item.path} className="relative">
                    <Link
                      to={item.path}
                      className={`group flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${
                        isActive
                          ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-sm border border-blue-100'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                      style={{ textDecoration: 'none' }}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-lg transition-colors ${
                          isActive 
                            ? 'bg-blue-100 text-blue-600' 
                            : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-600'
                        }`}>
                          <item.icon className="w-4 h-4" />
                        </div>
                        <span className="font-medium text-sm">{item.label}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {item.badge && (
                          <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200 font-medium">
                            {item.badge}
                          </Badge>
                        )}
                      </div>
                    </Link>
                    {isActive && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-r-full"></div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User Info and Sign Out - always visible at bottom */}
      <div className="flex flex-col border-t border-slate-200/60 flex-shrink-0 mt-auto bg-white/60 backdrop-blur-sm">
        <div className="p-4 border-b border-slate-200/40">
          <div className="flex flex-col items-center">
            {/* Avatar and Status */}
            <div className="relative mb-3 group">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-base shadow-lg ring-4 ring-blue-50 group-hover:ring-blue-100 transition-all duration-200">
                {initials}
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-br from-green-400 to-green-500 rounded-full border-2 border-white shadow-sm group-hover:scale-110 transition-transform duration-200"></div>
            </div>
            
            {/* User Details */}
            <div className="flex flex-col items-center space-y-1.5 w-full">
              <p className="text-sm font-semibold text-slate-800 text-center truncate max-w-[180px]">
                {displayName}
              </p>
              <div className="flex items-center justify-center space-x-2">
                <Badge 
                  variant="secondary" 
                  className="text-[11px] capitalize bg-gradient-to-r from-slate-50 to-slate-100 text-slate-600 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow duration-200 px-2.5 py-0.5"
                >
                  {profile.role}
                </Badge>
                {profile.role !== 'admin' && (
                  <div className="relative group cursor-pointer">
                    <div className="p-1 rounded-full hover:bg-slate-100 transition-colors duration-200">
                      <Bell className="w-4 h-4 text-slate-500 group-hover:text-slate-700 transition-colors duration-200" />
                    </div>
                    <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-gradient-to-br from-red-400 to-red-500 rounded-full border-2 border-white group-hover:scale-110 transition-transform duration-200"></span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="p-3">
          <Button
            variant="ghost"
            className="w-full justify-start text-slate-600 hover:text-slate-900 hover:bg-slate-100 p-3 rounded-xl transition-all duration-200 group"
            onClick={signOut}
          >
            <div className="p-2 rounded-lg bg-slate-100 text-slate-500 group-hover:bg-red-50 group-hover:text-red-600 transition-colors mr-4">
              <LogOut className="w-4 h-4" />
            </div>
            <span className="font-medium text-sm">Sign Out</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
