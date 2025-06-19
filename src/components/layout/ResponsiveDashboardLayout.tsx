
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';
import MobileSidebar from './MobileSidebar';
import Sidebar from './Sidebar';
import { MobileNavigation } from '@/components/mobile/MobileNavigation';

interface ResponsiveDashboardLayoutProps {
  children: React.ReactNode;
}

const ResponsiveDashboardLayout: React.FC<ResponsiveDashboardLayoutProps> = ({ children }) => {
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

  // Enhanced desktop layout with proper grid system and spacing
  return (
    <div className="min-h-screen flex w-full bg-gradient-to-br from-gray-50 to-blue-50/30">
      <Sidebar />
      <main className="flex-1 pl-64 overflow-auto">
        {/* Desktop container system with proper max-width and centering */}
        <div className="desktop-container">
          <div className="desktop-content-wrapper">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResponsiveDashboardLayout;
