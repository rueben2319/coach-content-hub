
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
  Search,
  Target,
  Award,
  Calendar,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface MenuItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  path: string;
  badge?: string;
}

const ModernSidebar = () => {
  const { profile, signOut } = useAuth();
  const location = useLocation();

  if (!profile) return null;

  const getMenuItems = (): MenuItem[] => {
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
          { icon: BookOpen, label: 'Content', path: '/coach/content' },
          { icon: Users, label: 'My Clients', path: '/coach/clients' },
          { icon: Calendar, label: 'Schedule', path: '/coach/schedule' },
          { icon: MessageSquare, label: 'Messages', path: '/coach/messages' },
          { icon: TrendingUp, label: 'Analytics', path: '/coach/analytics' },
          { icon: User, label: 'Profile', path: '/coach/profile' },
          { icon: CreditCard, label: 'Subscription', path: '/coach/subscription' },
        ];
      case 'client':
        return [
          { icon: LayoutDashboard, label: 'Dashboard', path: '/client' },
          { icon: BookOpen, label: 'Browse Content', path: '/client/content' },
          { icon: Target, label: 'My Goals', path: '/client/goals' },
          { icon: FileText, label: 'My Progress', path: '/client/progress' },
          { icon: Users, label: 'My Coaches', path: '/client/coaches' },
          { icon: Calendar, label: 'Sessions', path: '/client/sessions' },
          { icon: MessageSquare, label: 'Messages', path: '/client/messages' },
          { icon: Award, label: 'Achievements', path: '/client/achievements', badge: 'New' },
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

  const isActiveMenuItem = (itemPath: string) => {
    const dashboardRoots = ['/admin', '/coach', '/client'];
    if (dashboardRoots.includes(itemPath)) {
      return location.pathname === itemPath;
    }
    return location.pathname === itemPath;
  };

  return (
    <div className="modern-sidebar">
      {/* Header */}
      <div className="modern-sidebar-header">
        <div className="flex items-center space-x-3">
          <div className="modern-user-avatar">
            {profile.role === 'admin' ? 'A' : profile.first_name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="modern-user-name">{profile.role === 'admin' ? 'Admin' : displayName}</p>
            <Badge variant="outline" className="modern-role-badge">
              {profile.role}
            </Badge>
          </div>
        </div>
      </div>

      {/* Navigation Sections */}
      <nav className="modern-sidebar-nav">
        <div className="modern-nav-section">
          <h3 className="modern-nav-section-title">GENERAL</h3>
          <div className="modern-nav-items">
            {menuItems.slice(0, 1).map((item) => {
              const isActive = isActiveMenuItem(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'modern-nav-item',
                    isActive && 'modern-nav-item-active'
                  )}
                >
                  <item.icon className="modern-nav-icon" />
                  <span className="modern-nav-label">{item.label}</span>
                  {item.badge && (
                    <Badge variant="outline" className="modern-nav-badge">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {menuItems.length > 1 && (
          <div className="modern-nav-section">
            <h3 className="modern-nav-section-title">
              {profile.role === 'admin' ? 'MANAGEMENT' : 
               profile.role === 'coach' ? 'COACHING' : 'LEARNING'}
            </h3>
            <div className="modern-nav-items">
              {menuItems.slice(1, -2).map((item) => {
                const isActive = isActiveMenuItem(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      'modern-nav-item',
                      isActive && 'modern-nav-item-active'
                    )}
                  >
                    <item.icon className="modern-nav-icon" />
                    <span className="modern-nav-label">{item.label}</span>
                    {item.badge && (
                      <Badge variant="outline" className="modern-nav-badge">
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {menuItems.length > 2 && (
          <div className="modern-nav-section">
            <h3 className="modern-nav-section-title">ACCOUNT</h3>
            <div className="modern-nav-items">
              {menuItems.slice(-2).map((item) => {
                const isActive = isActiveMenuItem(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      'modern-nav-item',
                      isActive && 'modern-nav-item-active'
                    )}
                  >
                    <item.icon className="modern-nav-icon" />
                    <span className="modern-nav-label">{item.label}</span>
                    {item.badge && (
                      <Badge variant="outline" className="modern-nav-badge">
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      {/* Footer */}
      <div className="modern-sidebar-footer">
        <Button
          variant="ghost"
          className="modern-signout-btn"
          onClick={signOut}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default ModernSidebar;
