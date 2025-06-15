
// Cross-browser compatibility utilities
export const BrowserCompatibility = {
  // Feature detection
  features: {
    intersectionObserver: 'IntersectionObserver' in window,
    resizeObserver: 'ResizeObserver' in window,
    webGL: (() => {
      try {
        const canvas = document.createElement('canvas');
        return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
      } catch (e) {
        return false;
      }
    })(),
    touchEvents: 'ontouchstart' in window,
    serviceWorker: 'serviceWorker' in navigator,
    localStorage: (() => {
      try {
        localStorage.setItem('test', 'test');
        localStorage.removeItem('test');
        return true;
      } catch (e) {
        return false;
      }
    })(),
    flexbox: CSS.supports('display', 'flex'),
    grid: CSS.supports('display', 'grid'),
    customProperties: CSS.supports('--test', 'test')
  },

  // Browser detection
  getBrowserInfo: () => {
    const ua = navigator.userAgent;
    return {
      isChrome: /Chrome/.test(ua) && /Google Inc/.test(navigator.vendor),
      isFirefox: /Firefox/.test(ua),
      isSafari: /Safari/.test(ua) && /Apple Computer/.test(navigator.vendor),
      isEdge: /Edg/.test(ua),
      isIE: /Trident/.test(ua),
      isMobile: /Mobi|Android/i.test(ua),
      isIOS: /iPad|iPhone|iPod/.test(ua),
      isAndroid: /Android/.test(ua)
    };
  },

  // Polyfill loader
  loadPolyfills: async () => {
    const polyfills = [];

    // IntersectionObserver polyfill
    if (!window.IntersectionObserver) {
      polyfills.push(import('intersection-observer'));
    }

    // ResizeObserver polyfill
    if (!window.ResizeObserver) {
      polyfills.push(
        import('resize-observer-polyfill').then(module => {
          (window as any).ResizeObserver = module.default;
        })
      );
    }

    // Custom properties polyfill for IE
    if (!CSS.supports('--test', 'test')) {
      polyfills.push(
        import('css-vars-ponyfill').then(module => {
          module.default();
        })
      );
    }

    await Promise.all(polyfills);
  },

  // CSS feature detection and fallbacks
  addCSSFallbacks: () => {
    const root = document.documentElement;

    // Grid fallback
    if (!CSS.supports('display', 'grid')) {
      root.classList.add('no-grid');
    }

    // Flexbox fallback
    if (!CSS.supports('display', 'flex')) {
      root.classList.add('no-flexbox');
    }

    // Custom properties fallback
    if (!CSS.supports('--test', 'test')) {
      root.classList.add('no-custom-properties');
    }
  },

  // Viewport fixes for mobile browsers
  setupViewportFixes: () => {
    // iOS Safari viewport height fix
    const setViewportHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    setViewportHeight();
    window.addEventListener('resize', setViewportHeight);
    window.addEventListener('orientationchange', setViewportHeight);
  }
};

// Input method compatibility
export const InputCompatibility = {
  // Touch vs mouse event handling
  getEventType: () => {
    return BrowserCompatibility.features.touchEvents ? 'touch' : 'mouse';
  },

  // Unified event handlers
  addUnifiedEventListener: (
    element: Element,
    eventType: 'start' | 'move' | 'end',
    handler: (e: Event) => void
  ) => {
    const isTouchDevice = BrowserCompatibility.features.touchEvents;
    
    const eventMap = {
      start: isTouchDevice ? 'touchstart' : 'mousedown',
      move: isTouchDevice ? 'touchmove' : 'mousemove',
      end: isTouchDevice ? 'touchend' : 'mouseup'
    };

    element.addEventListener(eventMap[eventType], handler);
    
    return () => element.removeEventListener(eventMap[eventType], handler);
  }
};

// Performance optimization for older browsers
export const LegacyOptimizations = {
  // Debounced scroll handler
  debounceScroll: (callback: () => void, delay = 16) => {
    let timeoutId: number;
    return () => {
      clearTimeout(timeoutId);
      timeoutId = window.setTimeout(callback, delay);
    };
  },

  // RequestAnimationFrame polyfill
  setupRAFPolyfill: () => {
    if (!window.requestAnimationFrame) {
      (window as any).requestAnimationFrame = (callback: FrameRequestCallback) => {
        return window.setTimeout(callback, 1000 / 60);
      };
    }

    if (!window.cancelAnimationFrame) {
      (window as any).cancelAnimationFrame = (id: number) => {
        clearTimeout(id);
      };
    }
  }
};
