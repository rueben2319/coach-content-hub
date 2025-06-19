
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
  Bell,
  MessageSquare,
  Calendar,
  Target,
  Award,
  ChevronDown,
  ChevronRight,
  Search
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface MenuItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  path: string;
  section: string;
  badge?: string;
  children?: MenuItem[];
}

const EnhancedSidebar = () => {
  const { profile, signOut } = useAuth();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSections, setExpandedSections] = useState<string[]>(['main']);

  if (!profile) return null;

  const getMenuItems = (): MenuItem[] => {
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
          { 
            icon: BookOpen, 
            label: 'Content', 
            path: '/coach/content', 
            section: 'content',
            children: [
              { icon: BookOpen, label: 'My Courses', path: '/coach/content', section: 'content' },
              { icon: FileText, label: 'Course Bundles', path: '/coach/bundles', section: 'content' },
            ]
          },
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

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const filteredItems = menuItems.filter(item => 
    searchQuery === '' || 
    item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.children?.some(child => child.label.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const groupedItems = filteredItems.reduce((acc, item) => {
    if (!acc[item.section]) {
      acc[item.section] = [];
    }
    acc[item.section].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

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
    <div className="desktop-sidebar-enhanced">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
          Experts Coach Hub
        </h1>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-semibold">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 truncate">{displayName}</p>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="text-xs capitalize">
                {profile.role}
              </Badge>
              {profile.role !== 'admin' && (
                <Bell className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-pointer transition-colors" />
              )}
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search menu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-9 bg-gray-50 border-0 focus:bg-white transition-colors"
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        {Object.entries(groupedItems).map(([section, items]) => (
          <div key={section} className="mb-6">
            {section !== 'main' && (
              <div 
                className="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors"
                onClick={() => toggleSection(section)}
              >
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {getSectionTitle(section)}
                </h3>
                {expandedSections.includes(section) ? (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                )}
              </div>
            )}
            
            {(section === 'main' || expandedSections.includes(section)) && (
              <div className="space-y-1 mt-2">
                {items.map((item) => {
                  const isActive = isActiveMenuItem(item.path);
                  return (
                    <div key={item.path}>
                      <Link
                        to={item.path}
                        className={cn(
                          'desktop-nav-item group flex items-center justify-between px-3 py-3 rounded-xl transition-all duration-200',
                          isActive 
                            ? 'desktop-nav-item active bg-blue-50 text-blue-700 font-semibold shadow-sm'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        )}
                      >
                        <div className="flex items-center space-x-3">
                          <item.icon className={cn(
                            'w-5 h-5 transition-colors',
                            isActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-700'
                          )} />
                          <span className="font-medium">{item.label}</span>
                        </div>
                        {item.badge && (
                          <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                            {item.badge}
                          </Badge>
                        )}
                        {item.children && (
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        )}
                      </Link>
                      
                      {item.children && (
                        <div className="ml-8 mt-1 space-y-1">
                          {item.children.map((child) => (
                            <Link
                              key={child.path}
                              to={child.path}
                              className={cn(
                                'flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors',
                                isActiveMenuItem(child.path)
                                  ? 'bg-blue-50 text-blue-700 font-medium'
                                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                              )}
                            >
                              <child.icon className="w-4 h-4" />
                              <span>{child.label}</span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Sign Out */}
      <div className="p-4 border-t border-gray-200">
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          onClick={signOut}
        >
          <LogOut className="w-5 h-5 mr-3" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default EnhancedSidebar;
