
import React, { useEffect } from 'react';
import DashboardLayout from './DashboardLayout';
import { UserFeedbackWidget } from '@/components/feedback/UserFeedbackWidget';
import { AccessibilityOverlay } from '@/components/testing/AccessibilityOverlay';
import { useCoreWebVitals } from '@/hooks/usePerformanceMonitoring';
import { useBrowserFeatures } from '@/hooks/useCrossBrowserCompatibility';

interface EnhancedDashboardLayoutProps {
  children: React.ReactNode;
}

const EnhancedDashboardLayout: React.FC<EnhancedDashboardLayoutProps> = ({ children }) => {
  const { features, browserInfo } = useBrowserFeatures();
  
  // Initialize performance monitoring
  useCoreWebVitals();

  useEffect(() => {
    // Log browser compatibility info
    console.log('Browser Features:', features);
    console.log('Browser Info:', browserInfo);

    // Add browser-specific classes for styling
    const root = document.documentElement;
    if (browserInfo.isSafari) root.classList.add('browser-safari');
    if (browserInfo.isFirefox) root.classList.add('browser-firefox');
    if (browserInfo.isChrome) root.classList.add('browser-chrome');
    if (browserInfo.isMobile) root.classList.add('is-mobile');
    if (browserInfo.isIOS) root.classList.add('is-ios');
    if (browserInfo.isAndroid) root.classList.add('is-android');
  }, [features, browserInfo]);

  return (
    <>
      <DashboardLayout>
        {children}
      </DashboardLayout>
      
      <UserFeedbackWidget />
      <AccessibilityOverlay />
    </>
  );
};

export default EnhancedDashboardLayout;
