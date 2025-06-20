
import React from 'react';
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
  X
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface MobileSidebarProps {
  onClose?: () => void;
}

const MobileSidebar: React.FC<MobileSidebarProps> = ({ onClose }) => {
  const { profile, signOut } = useAuth();
  const location = useLocation();

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
          { icon: BookOpen, label: 'My Content', path: '/coach/content', badge: 'New' },
          { icon: Users, label: 'My Clients', path: '/coach/clients' },
          { icon: Calendar, label: 'Schedule', path: '/coach/schedule' },
          { icon: MessageSquare, label: 'Messages', path: '/coach/messages' },
          { icon: TrendingUp, label: 'Analytics', path: '/coach/analytics' },
          { icon: Award, label: 'Achievements', path: '/coach/achievements' },
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
  const initials = fullName ? `${profile.first_name?.[0] || ''}${profile.last_name?.[0] || ''}`.toUpperCase() : profile.email[0].toUpperCase();

  const isActiveMenuItem = (itemPath: string) => {
    const dashboardRoots = ['/admin', '/coach', '/client'];
    if (dashboardRoots.includes(itemPath)) {
      return location.pathname === itemPath;
    }
    return location.pathname === itemPath;
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 via-purple-600 to-green-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">E</span>
          </div>
          <span className="font-semibold text-gray-900">Experts Coach Hub</span>
        </div>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* User Info */}
      <div className="p-4 border-b">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{displayName}</p>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="text-xs capitalize">
                {profile.role}
              </Badge>
              {profile.role !== 'admin' && (
                <Bell className="w-4 h-4 text-gray-400" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-2">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const isActive = isActiveMenuItem(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`flex items-center justify-between px-3 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium text-sm">{item.label}</span>
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
      </nav>

      {/* Sign Out */}
      <div className="p-4 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          onClick={() => {
            signOut();
            onClose?.();
          }}
        >
          <LogOut className="w-5 h-5 mr-3" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default MobileSidebar;
