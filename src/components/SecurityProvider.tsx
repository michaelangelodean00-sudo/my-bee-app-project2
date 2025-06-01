
import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { checkSecurityHeaders } from '../utils/security';

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
    
    // Warn about insecure connections in production
    if (process.env.NODE_ENV === 'production' && !isSecure) {
      console.warn('Application is running over HTTP in production. This is insecure.');
    }
  }, [isSecure]);

  return (
    <SecurityContext.Provider value={{ isSecure }}>
      {children}
    </SecurityContext.Provider>
  );
};
