
import React, { useState } from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import Sidebar from './Sidebar';
import MobileSidebar from './MobileSidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        {/* Desktop Sidebar */}
        {!isMobile && <Sidebar />}
        
        {/* Mobile Sidebar */}
        {isMobile && (
          <>
            {mobileMenuOpen && (
              <div className="fixed inset-0 z-50 lg:hidden">
                <div className="fixed inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
                <div className="fixed left-0 top-0 h-full w-72 bg-white">
                  <MobileSidebar />
                </div>
              </div>
            )}
          </>
        )}

        {/* Main Content Area */}
        <SidebarInset className="flex-1">
          <div className="flex flex-col h-full">
            {/* Mobile Header */}
            {isMobile && (
              <header className="sticky top-0 z-40 border-b bg-white px-4 py-3">
                <div className="flex items-center justify-between">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setMobileMenuOpen(true)}
                  >
                    <Menu className="h-6 w-6" />
                  </Button>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-600 via-purple-600 to-green-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">E</span>
                    </div>
                    <span className="font-semibold text-gray-900">Experts Coach Hub</span>
                  </div>
                </div>
              </header>
            )}

            {/* Page Content */}
            <main className="flex-1 overflow-auto">
              <div className="desktop-container">
                <div className="desktop-content-wrapper">
                  {children}
                </div>
              </div>
            </main>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
