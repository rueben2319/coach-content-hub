
import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import Sidebar from './Sidebar';
import MobileSidebar from './MobileSidebar';
import { MobileNavigation } from '@/components/mobile/MobileNavigation';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Mobile Sidebar */}
        <SidebarProvider>
          <MobileSidebar />
        </SidebarProvider>

        {/* Main Content Area with bottom padding for navigation */}
        <main className="flex-1 overflow-hidden pb-16">
          <div className="h-full overflow-y-auto">
            <div className="max-w-7xl mx-auto p-4">
              {children}
            </div>
          </div>
        </main>

        {/* Bottom Navigation */}
        <MobileNavigation />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gray-50 flex w-full">
        {/* Desktop Sidebar */}
        <aside className="w-72 flex-shrink-0">
          <Sidebar />
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto">
            <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
