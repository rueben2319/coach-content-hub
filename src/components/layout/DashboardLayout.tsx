
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { MobileNavigation } from '@/components/mobile/MobileNavigation';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import Navbar from './Navbar';
import MobileNavbar from './MobileNavbar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();
  const { profile } = useAuth();

  if (isMobile) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col w-full">
        {/* Fixed Mobile Header */}
        <div className="fixed top-0 left-0 right-0 z-50 md:hidden safe-area-pt">
          <MobileNavbar />
        </div>
        {/* Main Content Area */}
        <main className="flex-1 overflow-hidden pt-[120px] pb-[80px]">
          <div className="h-full overflow-y-auto">
            <div className="container-fluid py-2">
              {children}
            </div>
          </div>
        </main>
        {/* Fixed Bottom Navigation */}
        <MobileNavigation />
      </div>
    );
  }

  // Desktop layout: full width, no sidebar
  return (
    <div className="min-h-screen bg-slate-50 w-full flex flex-col">
      {/* Navbar */}
      <Navbar />
      {/* Main Content as <main> */}
      <main className="flex-1 overflow-y-auto">
        <div className="h-full">
          <div className="container-constrained section-padding">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
