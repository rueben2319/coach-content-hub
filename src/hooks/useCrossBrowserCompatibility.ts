
import { useEffect, useState } from 'react';
import { BrowserCompatibility, InputCompatibility, LegacyOptimizations } from '@/utils/crossBrowser';

// Hook for browser feature detection
export function useBrowserFeatures() {
  const [features, setFeatures] = useState(BrowserCompatibility.features);
  const [browserInfo, setBrowserInfo] = useState(BrowserCompatibility.getBrowserInfo());

  useEffect(() => {
    // Setup polyfills
    BrowserCompatibility.loadPolyfills();
    BrowserCompatibility.addCSSFallbacks();
    BrowserCompatibility.setupViewportFixes();
    LegacyOptimizations.setupRAFPolyfill();
  }, []);

  return {
    features,
    browserInfo,
    isModernBrowser: features.intersectionObserver && features.flexbox && features.grid
  };
}

// Hook for unified input handling
export function useUnifiedInput(
  elementRef: React.RefObject<Element>,
  handlers: {
    onStart?: (e: Event) => void;
    onMove?: (e: Event) => void;
    onEnd?: (e: Event) => void;
  }
) {
  useEffect(() => {
    if (!elementRef.current) return;

    const cleanupFunctions: (() => void)[] = [];

    if (handlers.onStart) {
      cleanupFunctions.push(
        InputCompatibility.addUnifiedEventListener(
          elementRef.current,
          'start',
          handlers.onStart
        )
      );
    }

    if (handlers.onMove) {
      cleanupFunctions.push(
        InputCompatibility.addUnifiedEventListener(
          elementRef.current,
          'move',
          handlers.onMove
        )
      );
    }

    if (handlers.onEnd) {
      cleanupFunctions.push(
        InputCompatibility.addUnifiedEventListener(
          elementRef.current,
          'end',
          handlers.onEnd
        )
      );
    }

    return () => {
      cleanupFunctions.forEach(cleanup => cleanup());
    };
  }, [elementRef, handlers]);
}

// Hook for responsive design with legacy support
export function useResponsiveDesign() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isTablet, setIsTablet] = useState(window.innerWidth >= 768 && window.innerWidth < 1024);

  useEffect(() => {
    const updateScreenSize = LegacyOptimizations.debounceScroll(() => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    }, 100);

    window.addEventListener('resize', updateScreenSize);
    window.addEventListener('orientationchange', updateScreenSize);

    return () => {
      window.removeEventListener('resize', updateScreenSize);
      window.removeEventListener('orientationchange', updateScreenSize);
    };
  }, []);

  return {
    isMobile,
    isTablet,
    isDesktop: !isMobile && !isTablet
  };
}
