import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import {
  Menu,
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
  Target,
  X
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { NotificationCenter } from '@/components/notifications/NotificationCenter';
import { cn } from '@/lib/utils';

interface MobileNavbarProps {
  className?: string;
}

const MobileNavbar: React.FC<MobileNavbarProps> = ({ className }) => {
  const { profile, signOut } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
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
      'fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-4 py-3 lg:hidden',
      className
    )}>
      <div className="flex items-center justify-between">
                 {/* Left - Menu and Brand */}
         <div className="flex items-center space-x-3">
           <Sheet>
             <SheetTrigger asChild>
               <Button variant="ghost" size="sm" className="p-2">
                 <Menu className="w-5 h-5" />
               </Button>
             </SheetTrigger>
             <SheetContent side="left" className="w-80 p-0">
               <div className="bg-gradient-to-br from-gray-50 to-white px-6 pt-8 pb-6 flex items-center justify-between border-b border-gray-100 relative">
                 <div className="flex items-center space-x-3">
                   <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                     <span className="text-white font-bold text-lg">C</span>
                   </div>
                   <div className="text-lg font-semibold text-gray-900">Coach Content Hub</div>
                 </div>
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

          {/* App Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <span className="text-lg font-bold text-gray-900">CCH</span>
          </div>
        </div>

        {/* Center - Search */}
        <div className="flex-1 max-w-xs mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 text-sm border-gray-300 focus:border-primary focus:ring-primary"
            />
          </div>
        </div>

        {/* Right - Notifications and Profile */}
        <div className="flex items-center space-x-3">
          {/* Enhanced Notification Center */}
          <NotificationCenter variant="dropdown" />

          {/* Profile */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="p-0">
                <Avatar className="w-8 h-8">
                  <AvatarImage src="" alt={fullName} />
                  <AvatarFallback className="bg-gray-200 text-gray-700 text-sm font-medium">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 p-0">
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
        </div>
      </div>
    </header>
  );
};

export default MobileNavbar; 