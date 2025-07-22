
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
        <div className="min-h-screen bg-slate-50 flex flex-col w-full">
          {/* Fixed Mobile Header */}
          <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 bg-white/95 backdrop-blur-sm border-b border-slate-200 md:hidden safe-area-pt">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-sm">
                {initials}
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-900">{fullName || 'User'}</div>
                {profile && (
                  <Badge variant="secondary" className="text-xs capitalize font-medium">
                    {profile.role}
                  </Badge>
                )}
              </div>
            </div>
            <SidebarTrigger className="h-9 w-9 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors" />
          </header>

          {/* Mobile Sidebar */}
          <MobileSidebar />

          {/* Main Content Area */}
          <main className="flex-1 overflow-hidden pt-[72px] pb-[80px]">
            <div className="h-full overflow-y-auto">
              <div className="container-fluid py-2">
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
      <div className="min-h-screen bg-slate-50 flex w-full">
        {/* Desktop Sidebar */}
        <aside className="w-72 flex-shrink-0 bg-white border-r border-slate-200">
          <Sidebar />
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto">
            <div className="container-constrained section-padding">
              {children}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
