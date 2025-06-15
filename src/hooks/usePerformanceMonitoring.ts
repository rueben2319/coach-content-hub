
import { useEffect, useRef } from 'react';
import { PerformanceMonitor } from '@/utils/performance';

// Hook for component performance monitoring
export function usePerformanceMonitoring(componentName: string, enabled = true) {
  const renderCountRef = useRef(0);
  const performanceMonitor = PerformanceMonitor.getInstance();

  useEffect(() => {
    if (enabled) {
      renderCountRef.current++;
      performanceMonitor.measureRender(componentName, () => {
        // Measurement happens in useEffect which tracks render completion
      });
    }
  });

  const measureAsyncOperation = async <T>(
    operationName: string,
    operation: () => Promise<T>
  ): Promise<T> => {
    if (!enabled) return operation();
    
    return performanceMonitor.measureApiCall(
      `${componentName}-${operationName}`,
      operation
    );
  };

  return {
    renderCount: renderCountRef.current,
    measureAsyncOperation,
    getMetrics: () => performanceMonitor.getMetrics()
  };
}

// Hook for Core Web Vitals monitoring
export function useCoreWebVitals() {
  useEffect(() => {
    const performanceMonitor = PerformanceMonitor.getInstance();
    performanceMonitor.recordCoreWebVitals();
    
    // Report metrics after page load
    window.addEventListener('load', () => {
      setTimeout(() => {
        const metrics = performanceMonitor.getMetrics();
        console.log('Core Web Vitals:', {
          LCP: metrics.lcp?.avg,
          FID: metrics.fid?.avg,
          CLS: metrics.cls?.avg
        });
      }, 1000);
    });
  }, []);
}

// Hook for memory usage monitoring
export function useMemoryMonitoring() {
  useEffect(() => {
    if ('memory' in performance) {
      const logMemoryUsage = () => {
        const memory = (performance as any).memory;
        console.log('Memory Usage:', {
          used: Math.round(memory.usedJSHeapSize / 1048576),
          total: Math.round(memory.totalJSHeapSize / 1048576),
          limit: Math.round(memory.jsHeapSizeLimit / 1048576)
        });
      };

      const interval = setInterval(logMemoryUsage, 30000); // Log every 30 seconds
      return () => clearInterval(interval);
    }
  }, []);
}
