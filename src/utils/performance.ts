// Performance monitoring utilities

export const measureWebVitals = () => {
  if (typeof window === 'undefined') return;

  // Core Web Vitals
  const observer = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      console.log(`${entry.name}:`, entry);
      
      // Log to analytics in production
      if (process.env.NODE_ENV === 'production') {
        // Here you would send to your analytics service
        const value = 'value' in entry ? entry.value : entry.duration;
        console.log('Web Vital:', {
          name: entry.name,
          value: value,
          timestamp: entry.startTime,
        });
      }
    });
  });

  // Observe different metrics
  try {
    observer.observe({ entryTypes: ['measure', 'mark', 'navigation', 'paint'] });
  } catch (e) {
    // Fallback for older browsers
    console.log('Performance Observer not fully supported');
  }
};

export const markPerformance = (name: string) => {
  if (typeof performance !== 'undefined' && performance.mark) {
    performance.mark(name);
  }
};

export const measurePerformance = (name: string, startMark: string, endMark?: string) => {
  if (typeof performance !== 'undefined' && performance.measure) {
    try {
      performance.measure(name, startMark, endMark);
    } catch (e) {
      console.warn('Performance measure failed:', e);
    }
  }
};

// Network quality detection
export const getNetworkQuality = (): string => {
  if ('connection' in navigator) {
    const connection = (navigator as any).connection;
    return connection.effectiveType || 'unknown';
  }
  return 'unknown';
};

// Memory usage monitoring
export const getMemoryUsage = () => {
  if ('memory' in performance) {
    const memory = (performance as any).memory;
    return {
      used: memory.usedJSHeapSize,
      total: memory.totalJSHeapSize,
      limit: memory.jsHeapSizeLimit,
    };
  }
  return null;
};

// Image loading optimization
export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
};

// Lazy loading intersection observer
export const createLazyLoadObserver = (
  callback: (entries: IntersectionObserverEntry[]) => void,
  options: IntersectionObserverInit = {}
): IntersectionObserver => {
  const defaultOptions = {
    threshold: 0.1,
    rootMargin: '50px',
    ...options,
  };

  return new IntersectionObserver(callback, defaultOptions);
};