
import { useEffect, useRef } from 'react';
import { AccessibilityTester, announceToScreenReader, FocusManager } from '@/utils/accessibility';

// Hook for accessibility testing
export function useAccessibilityTesting(enabled = false) {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!enabled || !containerRef.current) return;

    const testAccessibility = () => {
      if (containerRef.current) {
        const ariaIssues = AccessibilityTester.validateAriaLabels(containerRef.current);
        const keyboardIssues = AccessibilityTester.validateKeyboardNavigation(containerRef.current);
        
        const allIssues = [...ariaIssues, ...keyboardIssues];
        
        if (allIssues.length > 0) {
          console.warn('Accessibility Issues Found:', allIssues);
        }
      }
    };

    // Test on mount and when content changes
    testAccessibility();
    
    const observer = new MutationObserver(testAccessibility);
    observer.observe(containerRef.current, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['aria-label', 'aria-labelledby', 'role', 'tabindex']
    });

    return () => observer.disconnect();
  }, [enabled]);

  return containerRef;
}

// Hook for focus management
export function useFocusManagement() {
  const previouslyFocusedRef = useRef<Element | null>(null);

  const captureFocus = () => {
    previouslyFocusedRef.current = document.activeElement;
  };

  const restoreFocus = () => {
    FocusManager.restoreFocus(previouslyFocusedRef.current);
  };

  const trapFocus = (container: Element) => {
    return FocusManager.trapFocus(container);
  };

  return {
    captureFocus,
    restoreFocus,
    trapFocus
  };
}

// Hook for screen reader announcements
export function useScreenReader() {
  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    announceToScreenReader(message, priority);
  };

  return { announce };
}

// Hook for reduced motion preference
export function useReducedMotion() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  return prefersReducedMotion;
}
