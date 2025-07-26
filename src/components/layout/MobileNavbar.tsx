import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import {
  Search,
  Bell,
  User,
  Sparkles,
  LogOut,
  ArrowRight,
  LayoutDashboard,
  Newspaper,
  BadgeCheck,
  Percent,
  History,
  FileText,
  UserCog
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface MobileNavbarProps {
  className?: string;
}

const MobileNavbar: React.FC<MobileNavbarProps> = ({ className }) => {
  const { profile, signOut } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications] = useState(3); // Mock notification count
  const [profileOpen, setProfileOpen] = useState(false);

  const fullName = profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : '';
  const initials = fullName ? `${profile.first_name?.[0] || ''}${profile.last_name?.[0] || ''}`.toUpperCase() : (profile?.email?.[0]?.toUpperCase() || 'U');

  const handleLogout = async () => {
    try {
      await signOut();
      setProfileOpen(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className={cn(
      'bg-white border-b border-gray-200 px-4 py-3',
      className
    )}>
      <div className="flex items-center justify-between">
        {/* Left Section - App Branding */}
        <div className="flex items-center space-x-2 select-none">
          <Sparkles className="w-5 h-5 text-primary" />
          <span className="text-lg font-bold text-gray-900 tracking-tight">Coach Content Hub</span>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center space-x-2">
          {/* Search */}
          <Button variant="ghost" size="sm" className="text-gray-600 hover:text-primary hover:bg-primary-50 transition-colors">
            <Search className="w-5 h-5" />
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative text-gray-600 hover:text-primary hover:bg-primary-50 transition-colors">
            <Bell className="w-5 h-5" />
            {notifications > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 flex items-center justify-center text-xs"
              >
                {notifications}
              </Badge>
            )}
          </Button>

          {/* Profile (clickable, opens offcanvas) */}
          <>
            <Button variant="ghost" size="sm" className="p-0 hover:bg-primary-50 transition-colors" onClick={() => setProfileOpen(true)}>
              <Avatar className="w-8 h-8">
                <AvatarImage src="" alt={fullName} />
                <AvatarFallback className="bg-gray-200 text-gray-700 text-sm font-medium">
                  <User className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
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
                    className="rounded-full px-5 py-2 font-semibold text-white bg-green-500 hover:bg-green-600" 
                    size="sm"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4 mr-1" /> Logout
                  </Button>
                </div>
                {/* Sidebar Sections */}
                <div className="px-6 py-4 overflow-y-auto h-full">
                  {/* Dashboard Section */}
                  <div className="mb-2">
                    <div className="flex items-center text-xs font-bold text-gray-500 uppercase mb-2 mt-2">
                      <LayoutDashboard className="w-4 h-4 mr-2 text-gray-400" /> Dashboard
                    </div>
                    <Link to="/client" className="flex items-center justify-between py-2 px-0 text-gray-900 hover:bg-primary-50 hover:text-primary rounded transition-colors">
                      <span className="flex items-center"><span className="ml-6">My Learning</span></span>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    </Link>
                  </div>
                  <Separator className="my-3" />
                  {/* News Section */}
                  <div className="mb-2">
                    <div className="flex items-center text-xs font-bold text-gray-500 uppercase mb-2 mt-2">
                      <Newspaper className="w-4 h-4 mr-2 text-gray-400" /> News
                    </div>
                    <a href="#" className="flex items-center justify-between py-2 px-0 text-gray-900 hover:bg-primary-50 hover:text-primary rounded transition-colors">
                      <span className="flex items-center"><span className="ml-6">For Learners</span></span>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    </a>
                  </div>
                  <Separator className="my-3" />
                  {/* Profile Section */}
                  <div className="mb-2">
                    <div className="flex items-center text-xs font-bold text-gray-500 uppercase mb-2 mt-2">
                      <UserCog className="w-4 h-4 mr-2 text-gray-400" /> Profile
                    </div>
                    <Link to="/client/profile" className="flex items-center justify-between py-2 px-0 text-gray-900 hover:bg-primary-50 hover:text-primary rounded transition-colors">
                      <span className="flex items-center"><span className="ml-6">Update Profile</span></span>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    </Link>
                    <a href="#" className="flex items-center justify-between py-2 px-0 text-gray-900 hover:bg-primary-50 hover:text-primary rounded transition-colors">
                      <span className="flex items-center"><BadgeCheck className="w-4 h-4 mr-2 text-gray-400" /><span>Badges & Certificates</span></span>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    </a>
                    <a href="#" className="flex items-center justify-between py-2 px-0 text-gray-900 hover:bg-primary-50 hover:text-primary rounded transition-colors">
                      <span className="flex items-center"><Percent className="w-4 h-4 mr-2 text-gray-400" /><span>Discounts</span></span>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    </a>
                    <a href="#" className="flex items-center justify-between py-2 px-0 text-gray-900 hover:bg-primary-50 hover:text-primary rounded transition-colors">
                      <span className="flex items-center"><History className="w-4 h-4 mr-2 text-gray-400" /><span>Learning History</span></span>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    </a>
                    <a href="#" className="flex items-center justify-between py-2 px-0 text-gray-900 hover:bg-primary-50 hover:text-primary rounded transition-colors">
                      <span className="flex items-center"><FileText className="w-4 h-4 mr-2 text-gray-400" /><span>Transcript</span></span>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    </a>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </>
        </div>
      </div>

      {/* Search Bar - Full Width */}
      <div className="mt-3">
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
    </header>
  );
};

export default MobileNavbar; 