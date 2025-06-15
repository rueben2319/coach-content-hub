
import React from 'react';
import { MobileNavigation } from './MobileNavigation';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface MobileLayoutProps {
  children: React.ReactNode;
  showBottomNav?: boolean;
}

export function MobileLayout({ children, showBottomNav = true }: MobileLayoutProps) {
  const isMobile = useIsMobile();

  if (!isMobile) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Main content with bottom padding for navigation */}
      <main className={cn("flex-1 overflow-auto", showBottomNav && "pb-16")}>
        <div className="px-4 py-6">
          {children}
        </div>
      </main>
      
      {/* Bottom navigation */}
      {showBottomNav && <MobileNavigation />}
    </div>
  );
}

