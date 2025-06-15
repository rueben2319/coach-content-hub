
// Accessibility testing and validation utilities
export const AccessibilityTester = {
  // Check for proper ARIA labels and roles
  validateAriaLabels: (element: Element): string[] => {
    const issues: string[] = [];
    
    // Check for buttons without accessible names
    const buttons = element.querySelectorAll('button, [role="button"]');
    buttons.forEach((button, index) => {
      const hasLabel = button.getAttribute('aria-label') || 
                      button.getAttribute('aria-labelledby') ||
                      button.textContent?.trim();
      if (!hasLabel) {
        issues.push(`Button ${index + 1} missing accessible name`);
      }
    });

    // Check for images without alt text
    const images = element.querySelectorAll('img');
    images.forEach((img, index) => {
      if (!img.getAttribute('alt') && img.getAttribute('role') !== 'presentation') {
        issues.push(`Image ${index + 1} missing alt text`);
      }
    });

    // Check for form inputs without labels
    const inputs = element.querySelectorAll('input, textarea, select');
    inputs.forEach((input, index) => {
      const hasLabel = input.getAttribute('aria-label') ||
                      input.getAttribute('aria-labelledby') ||
                      element.querySelector(`label[for="${input.id}"]`);
      if (!hasLabel) {
        issues.push(`Form input ${index + 1} missing label`);
      }
    });

    return issues;
  },

  // Check color contrast ratios
  checkColorContrast: (textElement: Element, bgElement?: Element): boolean => {
    // Simplified contrast check - in real implementation would use color calculation
    const textColor = getComputedStyle(textElement).color;
    const bgColor = getComputedStyle(bgElement || textElement).backgroundColor;
    
    // Return true for now - would implement actual contrast calculation
    return true;
  },

  // Check keyboard navigation
  validateKeyboardNavigation: (container: Element): string[] => {
    const issues: string[] = [];
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    focusableElements.forEach((element, index) => {
      const tabIndex = element.getAttribute('tabindex');
      if (tabIndex && parseInt(tabIndex) > 0) {
        issues.push(`Element ${index + 1} uses positive tabindex, may disrupt tab order`);
      }
    });

    return issues;
  }
};

// Screen reader announcement utility
export const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

// Focus management utilities
export const FocusManager = {
  trapFocus: (container: Element) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>;
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);
    return () => container.removeEventListener('keydown', handleTabKey);
  },

  restoreFocus: (previouslyFocusedElement: Element | null) => {
    if (previouslyFocusedElement && 'focus' in previouslyFocusedElement) {
      (previouslyFocusedElement as HTMLElement).focus();
    }
  }
};
