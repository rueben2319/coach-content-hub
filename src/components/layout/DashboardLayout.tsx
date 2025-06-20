
import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import Sidebar from './Sidebar';
import MobileSidebar from './MobileSidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gray-50 flex w-full">
        {/* Desktop Sidebar */}
        {!isMobile && (
          <aside className="w-72 flex-shrink-0">
            <Sidebar />
          </aside>
        )}

        {/* Mobile Sidebar */}
        {isMobile && <MobileSidebar />}

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
