
import React from 'react';
import Sidebar from './Sidebar';
import { useIsMobile } from '@/hooks/use-mobile';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();

  return (
    <div className="flex h-screen bg-gray-50 w-full">
      {!isMobile && <Sidebar />}
      <main className="flex-1 overflow-auto w-full">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
