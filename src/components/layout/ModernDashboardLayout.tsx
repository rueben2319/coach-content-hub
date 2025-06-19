
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';
import MobileSidebar from './MobileSidebar';
import ModernSidebar from './ModernSidebar';
import { MobileNavigation } from '@/components/mobile/MobileNavigation';

interface ModernDashboardLayoutProps {
  children: React.ReactNode;
}

const ModernDashboardLayout: React.FC<ModernDashboardLayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full flex-col">
          <MobileSidebar />
          <SidebarInset className="flex flex-col w-full">
            <header className="sticky top-0 z-40 bg-white border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  Experts Coach Hub
                </h1>
                <SidebarTrigger />
              </div>
            </header>
            <main className="flex-1 overflow-auto pb-20">
              <div className="p-4 md:p-6">
                {children}
              </div>
            </main>
          </SidebarInset>
          <MobileNavigation />
        </div>
      </SidebarProvider>
    );
  }

  // Modern desktop layout matching the reference image
  return (
    <div className="min-h-screen flex w-full bg-gray-50">
      <ModernSidebar />
      <main className="flex-1 pl-64 overflow-auto">
        <div className="modern-dashboard-container">
          <div className="modern-dashboard-content">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ModernDashboardLayout;
