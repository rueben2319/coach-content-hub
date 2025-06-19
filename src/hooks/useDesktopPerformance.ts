
import { useEffect, useCallback } from 'react';

export interface PerformanceMetrics {
  fps: number;
  memoryUsage: number;
  paintTime: number;
  layoutTime: number;
}

export const useDesktopPerformance = () => {
  const measurePerformance = useCallback((): PerformanceMetrics => {
    const performance = window.performance;
    
    // Measure FPS (simplified)
    let fps = 60; // Default assumption
    if ('memory' in performance) {
      // Chrome-specific memory info
      const memory = (performance as any).memory;
      fps = Math.min(60, Math.max(30, 60 - (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 30));
    }

    // Get paint and layout timing
    const paintEntries = performance.getEntriesByType('paint');
    const layoutEntries = performance.getEntriesByType('layout-shift');
    
    const paintTime = paintEntries.length > 0 ? paintEntries[0].startTime : 0;
    const layoutTime = layoutEntries.length > 0 ? layoutEntries[0].startTime : 0;

    // Memory usage (Chrome-specific)
    let memoryUsage = 0;
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      memoryUsage = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;
    }

    return {
      fps: Math.round(fps),
      memoryUsage: Math.round(memoryUsage),
      paintTime: Math.round(paintTime),
      layoutTime: Math.round(layoutTime)
    };
  }, []);

  const optimizeForDesktop = useCallback(() => {
    // Enable CSS containment for better performance
    const containers = document.querySelectorAll('.desktop-contained');
    containers.forEach(container => {
      if (container instanceof HTMLElement) {
        container.style.contain = 'layout style paint';
      }
    });

    // Optimize images for high DPI displays
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      if (window.devicePixelRatio > 1) {
        img.style.imageRendering = 'crisp-edges';
      }
    });

    // Enable hardware acceleration for specific elements
    const acceleratedElements = document.querySelectorAll('.desktop-gpu-accelerated');
    acceleratedElements.forEach(element => {
      if (element instanceof HTMLElement) {
        element.style.transform = 'translateZ(0)';
        element.style.backfaceVisibility = 'hidden';
        element.style.perspective = '1000px';
      }
    });
  }, []);

  useEffect(() => {
    // Run optimization on mount
    optimizeForDesktop();

    // Set up performance monitoring
    const performanceObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach(entry => {
        if (entry.entryType === 'layout-shift' && (entry as any).value > 0.1) {
          console.warn('Large layout shift detected:', entry);
        }
        if (entry.entryType === 'longtask' && entry.duration > 50) {
          console.warn('Long task detected:', entry);
        }
      });
    });

    if (typeof PerformanceObserver !== 'undefined') {
      performanceObserver.observe({ entryTypes: ['layout-shift', 'longtask'] });
    }

    return () => {
      if (typeof PerformanceObserver !== 'undefined') {
        performanceObserver.disconnect();
      }
    };
  }, [optimizeForDesktop]);

  return {
    measurePerformance,
    optimizeForDesktop
  };
};
