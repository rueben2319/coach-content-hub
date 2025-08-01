import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import {
  Sparkles,
  Search,
  Bell,
  User,
  Settings,
  LogOut,
  ChevronDown,
  Globe,
  HelpCircle,
  BookOpen,
  BarChart3,
  Users,
  FileText,
  CreditCard,
  MessageSquare,
  Calendar,
  Target,
  Trophy,
  TrendingUp,
  Activity,
  PieChart,
  Layers,
  Grid,
  List,
  Filter,
  Download,
  Share2,
  Edit,
  Plus,
  MoreHorizontal,
  Check,
  Clock,
  AlertCircle,
  Info,
  Loader2,
  X
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { NotificationCenter } from '@/components/notifications/NotificationCenter';
import { cn } from '@/lib/utils';

interface NavbarProps {
  className?: string;
}

const Navbar: React.FC<NavbarProps> = ({ className }) => {
  const { profile, signOut } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [language, setLanguage] = useState('EN');
  const [profileOpen, setProfileOpen] = useState(false);

  const fullName = profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : '';
  const initials = fullName
    ? fullName.split(' ').map(n => n[0]).join('').toUpperCase()
    : profile?.email?.charAt(0).toUpperCase() || 'U';

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className={cn(
      'fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-6 py-3',
      className
    )}>
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Left Section - App Branding */}
        <div className="flex items-center space-x-6">
          {/* App Logo/Branding */}
          <div className="flex items-center space-x-2 select-none">
            <Sparkles className="w-6 h-6 text-primary" />
            <span className="text-2xl font-bold text-gray-900 tracking-tight">Coach Content Hub</span>
          </div>
          {/* Explore Button */}
          <Button
            variant="outline"
            className="flex items-center space-x-2 bg-white hover:bg-primary-50 hover:border-primary-300 hover:text-primary-700 border-gray-300 transition-colors"
          >
            <span>Explore</span>
            <ChevronDown className="w-4 h-4" />
          </Button>
        </div>

        {/* Center Section - Search */}
        <div className="flex-1 max-w-2xl mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search for courses, articles and..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border-gray-300 focus:border-primary focus:ring-primary"
            />
          </div>
        </div>

        {/* Right Section - Navigation Items */}
        <div className="flex items-center space-x-6">
          {/* My Learning/My Work Link */}
          {profile?.role === 'coach' ? (
            <Link
              to="/coach"
              className="text-primary font-medium hover:text-primary-600 border-b-2 border-primary pb-1 transition-colors"
            >
              My Work
            </Link>
          ) : (
            <Link
              to="/client"
              className="text-primary font-medium hover:text-primary-600 border-b-2 border-primary pb-1 transition-colors"
            >
              My Learning
            </Link>
          )}

          {/* Language Selector */}
          <Button variant="ghost" size="sm" className="flex items-center space-x-1 text-gray-600 hover:text-primary hover:bg-primary-50 transition-colors">
            <Globe className="w-4 h-4" />
            <span>{language}</span>
            <ChevronDown className="w-3 h-3" />
          </Button>

          {/* Help */}
          <Button variant="ghost" size="sm" className="text-gray-600 hover:text-primary hover:bg-primary-50 transition-colors">
            <div className="w-6 h-6 rounded-full border-2 border-gray-400 flex items-center justify-center">
              <span className="text-xs font-bold text-gray-400">?</span>
            </div>
          </Button>

          {/* Enhanced Notification Center */}
          <NotificationCenter variant="dropdown" />

          {/* Profile (clickable, opens offcanvas) */}
          <>
            <Button variant="ghost" size="sm" className="flex items-center space-x-3 p-0 hover:bg-primary-50 transition-colors" onClick={() => setProfileOpen(true)}>
              <Avatar className="w-8 h-8">
                <AvatarImage src="" alt={fullName} />
                <AvatarFallback className="bg-gray-200 text-gray-700 text-sm font-medium">
                  <User className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start">
                <span className="text-sm font-semibold text-gray-900">
                  {fullName || profile?.email || 'User'}
                </span>
                <span className="text-xs text-gray-500 capitalize">
                  {profile?.role || 'Learner'}
                </span>
              </div>
            </Button>
            <Sheet open={profileOpen} onOpenChange={setProfileOpen}>
              <SheetContent side="right" className="max-w-xs w-full p-0">
                {/* Header */}
                <div className="bg-gradient-to-br from-gray-50 to-white px-6 pt-8 pb-6 flex items-center justify-between border-b border-gray-100 relative">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src="" alt={fullName} />
                      <AvatarFallback className="bg-gray-200 text-gray-700 text-xl font-bold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-lg font-semibold text-gray-900 lowercase first-letter:capitalize">
                      {fullName || profile?.email || 'User'}
                    </div>
                  </div>
                  <Button 
                    variant="default" 
                    size="sm" 
                    className="absolute top-4 right-4 h-8 w-8 p-0 rounded-full"
                    onClick={() => setProfileOpen(false)}
                  >
                    <span className="sr-only">Close</span>
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Navigation Menu */}
                <nav className="flex-1 px-6 py-4 space-y-2">
                  {/* Dashboard Section */}
                  <div className="space-y-1">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                      Dashboard
                    </h3>
                    {profile?.role === 'coach' ? (
                      <>
                        <Link to="/coach/dashboard" className="flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                          <BarChart3 className="w-4 h-4" />
                          <span>Analytics</span>
                        </Link>
                        <Link to="/coach/content" className="flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                          <FileText className="w-4 h-4" />
                          <span>Content Management</span>
                        </Link>
                        <Link to="/coach/students" className="flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                          <Users className="w-4 h-4" />
                          <span>Students</span>
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link to="/client/dashboard" className="flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                          <BarChart3 className="w-4 h-4" />
                          <span>Progress</span>
                        </Link>
                        <Link to="/client/courses" className="flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                          <BookOpen className="w-4 h-4" />
                          <span>My Courses</span>
                        </Link>
                        <Link to="/client/goals" className="flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                          <Target className="w-4 h-4" />
                          <span>Goals</span>
                        </Link>
                      </>
                    )}
                  </div>

                  {/* Account Section */}
                  <div className="space-y-1 pt-4">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                      Account
                    </h3>
                    <Link to="/profile" className="flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                      <User className="w-4 h-4" />
                      <span>Profile</span>
                    </Link>
                    <Link to="/subscription" className="flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                      <CreditCard className="w-4 h-4" />
                      <span>Subscription</span>
                    </Link>
                    <Link to="/settings" className="flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                      <Settings className="w-4 h-4" />
                      <span>Settings</span>
                    </Link>
                  </div>

                  {/* Support Section */}
                  <div className="space-y-1 pt-4">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                      Support
                    </h3>
                    <Link to="/help" className="flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                      <HelpCircle className="w-4 h-4" />
                      <span>Help Center</span>
                    </Link>
                    <Link to="/contact" className="flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                      <MessageSquare className="w-4 h-4" />
                      <span>Contact Support</span>
                    </Link>
                  </div>
                </nav>

                {/* Footer */}
                <div className="border-t border-gray-100 px-6 py-4">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Sign Out
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </>
        </div>
      </div>
    </header>
  );
};

export default Navbar; 