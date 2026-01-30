import { useCallback } from 'react';

// Route components for prefetching
const routeImports: Record<string, () => Promise<unknown>> = {
  '/': () => import('../pages/Index'),
  '/businesses': () => import('../pages/Businesses'),
  '/events': () => import('../pages/Events'),
  '/ecommerce': () => import('../pages/Ecommerce'),
  '/admin': () => import('../pages/Admin'),
  '/settings': () => import('../pages/ProfileSettings'),
  '/profile': () => import('../pages/UserProfilePage'),
  '/upload-video': () => import('../pages/VideoUpload'),
  '/copyright': () => import('../pages/Copyright'),
  '/customer-analytics': () => import('../pages/CustomerAnalytics'),
};

const prefetchedRoutes = new Set<string>();

export const usePrefetch = () => {
  const prefetchRoute = useCallback((path: string) => {
    // Normalize path
    const normalizedPath = path.split('?')[0].split('#')[0];
    
    // Skip if already prefetched
    if (prefetchedRoutes.has(normalizedPath)) return;
    
    const importFn = routeImports[normalizedPath];
    if (importFn) {
      // Mark as prefetched immediately to avoid duplicates
      prefetchedRoutes.add(normalizedPath);
      
      // Use requestIdleCallback for non-blocking prefetch
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
          importFn().catch(() => {
            // Remove from set if prefetch fails so it can be retried
            prefetchedRoutes.delete(normalizedPath);
          });
        }, { timeout: 2000 });
      } else {
        // Fallback for Safari
        setTimeout(() => {
          importFn().catch(() => {
            prefetchedRoutes.delete(normalizedPath);
          });
        }, 100);
      }
    }
  }, []);

  const prefetchOnHover = useCallback((path: string) => {
    return {
      onMouseEnter: () => prefetchRoute(path),
      onFocus: () => prefetchRoute(path),
    };
  }, [prefetchRoute]);

  return { prefetchRoute, prefetchOnHover };
};

// Prefetch critical routes after initial load
export const prefetchCriticalRoutes = () => {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      ['/businesses', '/events', '/ecommerce'].forEach(route => {
        const importFn = routeImports[route];
        if (importFn && !prefetchedRoutes.has(route)) {
          prefetchedRoutes.add(route);
          importFn().catch(() => prefetchedRoutes.delete(route));
        }
      });
    }, { timeout: 5000 });
  }
};
