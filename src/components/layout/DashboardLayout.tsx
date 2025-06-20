import React from 'react';
import { cn } from '@/lib/utils';
import Sidebar from '@/components/layout/Sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';


interface DashboardLayoutProps {
  /** The content to be rendered inside the dashboard layout */
  children: React.ReactNode;
  /** Optional additional classes to apply to the content container */
  className?: string;
  /** Whether to apply background and shadow to the content container. Default: true */
  withBackground?: boolean;
}

/**
 * DashboardLayout provides a consistent layout structure for dashboard pages
 * with responsive padding, max-width constraint, and optional background styling.
 * Now includes a sidebar on the left.
 */
const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  className,
  withBackground = true 
}) => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 min-h-screen">
            <div 
              className={cn(
                withBackground && "bg-white rounded-lg shadow",
                "p-6 space-y-6",
                className
              )}
            >
              {children}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
