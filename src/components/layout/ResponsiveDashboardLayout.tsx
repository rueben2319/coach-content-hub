
import React from 'react';
import DashboardLayout from './DashboardLayout';

interface ResponsiveDashboardLayoutProps {
  children: React.ReactNode;
}

const ResponsiveDashboardLayout: React.FC<ResponsiveDashboardLayoutProps> = ({ children }) => {
  return (
    <DashboardLayout>
      {children}
    </DashboardLayout>
  );
};

export default ResponsiveDashboardLayout;
