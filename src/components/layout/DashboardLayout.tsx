
import React from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import Sidebar from './Sidebar';
import MobileSidebar from './MobileSidebar';
import { MobileNavigation } from '@/components/mobile/MobileNavigation';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();
  const { profile } = useAuth();

  if (isMobile) {
    const fullName = profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : '';
    const initials = fullName ? `${profile.first_name?.[0] || ''}${profile.last_name?.[0] || ''}`.toUpperCase() : (profile?.email[0].toUpperCase() || '');

    return (
      <SidebarProvider>
        <div className="min-h-screen bg-white flex flex-col w-full">
          {/* Fixed Mobile Header with Sidebar Trigger */}
          <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-white border-b shadow-sm md:hidden">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                {initials}
              </div>
              {profile && (
                <Badge variant="secondary" className="text-xs capitalize">
                  {profile.role}
                </Badge>
              )}
            </div>
            <SidebarTrigger className="h-8 w-8" />
          </header>

          {/* Mobile Sidebar */}
          <MobileSidebar />

          {/* Main Content Area with top padding for fixed header and bottom padding for navigation */}
          <main className="flex-1 overflow-hidden pt-20 pb-16">
            <div className="h-full overflow-y-auto">
              <div className="w-full">
                {children}
              </div>
            </div>
          </main>

          {/* Fixed Bottom Navigation */}
          <MobileNavigation />
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-white flex w-full">
        {/* Desktop Sidebar */}
        <aside className="w-72 flex-shrink-0">
          <Sidebar />
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto">
            <div className="w-full">
              {children}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
