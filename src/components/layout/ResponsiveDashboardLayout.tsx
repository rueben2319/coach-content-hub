
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';
import MobileSidebar from './MobileSidebar';
import Sidebar from './Sidebar';

interface ResponsiveDashboardLayoutProps {
  children: React.ReactNode;
}

const ResponsiveDashboardLayout: React.FC<ResponsiveDashboardLayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <MobileSidebar />
          <SidebarInset className="flex flex-col w-full">
            <header className="sticky top-0 z-40 bg-white border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  CoachHub
                </h1>
                <SidebarTrigger />
              </div>
            </header>
            <main className="flex-1 overflow-auto p-4 md:p-6">
              {children}
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <div className="min-h-screen flex w-full">
      <Sidebar />
      <main className="flex-1 ml-64 overflow-auto">
        <div className="p-4 md:p-6 h-full">
          {children}
        </div>
      </main>
    </div>
  );
};

export default ResponsiveDashboardLayout;
