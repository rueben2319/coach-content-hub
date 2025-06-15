
import React from 'react';
import ResponsiveDashboardLayout from './ResponsiveDashboardLayout';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return <ResponsiveDashboardLayout>{children}</ResponsiveDashboardLayout>;
};

export default DashboardLayout;
