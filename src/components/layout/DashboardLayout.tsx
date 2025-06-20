
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
      <div className="grid grid-cols-1 md:grid-cols-[288px_1fr] min-h-screen bg-gray-50/50">
        {/* Desktop Sidebar */}
        {!isMobile && (
          <aside className="hidden md:block">
            <Sidebar />
          </aside>
        )}
        
        {/* Mobile Sidebar Overlay */}
        {isMobile && mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="fixed inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
            <div className="fixed left-0 top-0 h-full w-72 bg-white shadow-xl">
              <MobileSidebar onClose={() => setMobileMenuOpen(false)} />
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <SidebarInset className="flex flex-col min-h-screen">
          {/* Mobile Header */}
          {isMobile && (
            <header className="sticky top-0 z-40 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 px-4 py-3">
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileMenuOpen(true)}
                  className="h-9 w-9"
                >
                  <Menu className="h-5 w-5" />
                </Button>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 via-purple-600 to-green-600 rounded-lg flex items-center justify-center shadow-sm">
                    <span className="text-white font-bold text-sm">E</span>
                  </div>
                  <span className="font-semibold text-gray-900">Experts Coach Hub</span>
                </div>
              </div>
            </header>
          )}

          {/* Page Content */}
          <main className="flex-1 w-full overflow-y-auto p-4 md:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
              {children}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
