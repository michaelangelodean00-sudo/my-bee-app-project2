
import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { checkSecurityHeaders } from '../utils/security';
import { measureWebVitals } from '../utils/performance';

interface SecurityContextType {
  isSecure: boolean;
}

const SecurityContext = createContext<SecurityContextType>({ isSecure: false });

export const useSecurityContext = () => useContext(SecurityContext);

interface SecurityProviderProps {
  children: ReactNode;
}

export const SecurityProvider = ({ children }: SecurityProviderProps) => {
  const isSecure = window.location.protocol === 'https:' || 
                   window.location.hostname === 'localhost' ||
                   window.location.hostname === '127.0.0.1';

  useEffect(() => {
    // Check security headers in development
    checkSecurityHeaders();
    
    // Initialize performance monitoring
    measureWebVitals();
    
    // Register service worker for PWA functionality
    if ('serviceWorker' in navigator) {
      // Register immediately for faster caching
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            // Check for updates periodically
            registration.update();
            setInterval(() => registration.update(), 60 * 60 * 1000); // hourly
            
            // Handle updates
            registration.addEventListener('updatefound', () => {
              const newWorker = registration.installing;
              if (newWorker) {
                newWorker.addEventListener('statechange', () => {
                  if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    // New content available, can notify user if needed
                    console.log('New content available, refresh to update');
                  }
                });
              }
            });
          })
          .catch((error) => {
            console.warn('SW registration failed:', error);
          });
      });
    }
    
    // Warn about insecure connections in production
    if (!import.meta.env.DEV && !isSecure) {
      console.warn('Application is running over HTTP in production. This is insecure.');
    }
  }, [isSecure]);

  return (
    <SecurityContext.Provider value={{ isSecure }}>
      {children}
    </SecurityContext.Provider>
  );
};
