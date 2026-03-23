
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
  const isSecure =
    window.location.protocol === 'https:' ||
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1';

  useEffect(() => {
    // ── Content Security Policy (meta tag fallback) ──────────────────────────
    // Primary CSP should be set as a server response header.
    // This meta tag provides a client-side backup.
    if (!document.querySelector('meta[http-equiv="Content-Security-Policy"]')) {
      const csp = document.createElement('meta');
      csp.setAttribute('http-equiv', 'Content-Security-Policy');
      csp.setAttribute(
        'content',
        [
          "default-src 'self'",
          "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.gpteng.co",
          "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
          "font-src 'self' https://fonts.gstatic.com data:",
          "img-src 'self' data: blob: https: http:",
          "media-src 'self' blob: https:",
          "connect-src 'self' https: wss:",
          "frame-src 'none'",
          "object-src 'none'",
          "base-uri 'self'",
          "form-action 'self'",
        ].join('; ')
      );
      document.head.prepend(csp);
    }

    // ── X-Frame-Options equivalent (clickjacking guard) ─────────────────────
    // If we're being framed by an unexpected origin, break out
    try {
      if (window.self !== window.top) {
        const allowedOrigin = window.location.origin;
        if (document.referrer && !document.referrer.startsWith(allowedOrigin)) {
          // Break out of unexpected iframe
          window.top!.location.href = window.location.href;
        }
      }
    } catch {
      // Cross-origin frame — break out
      document.body.innerHTML = '';
      window.location.reload();
    }

    // ── Referrer Policy ──────────────────────────────────────────────────────
    if (!document.querySelector('meta[name="referrer"]')) {
      const rp = document.createElement('meta');
      rp.name = 'referrer';
      rp.content = 'strict-origin-when-cross-origin';
      document.head.appendChild(rp);
    }

    // ── Security header check (dev only) ────────────────────────────────────
    checkSecurityHeaders();

    // ── Performance monitoring ───────────────────────────────────────────────
    measureWebVitals();

    // ── Service Worker (PWA) ─────────────────────────────────────────────────
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            registration.update();
            setInterval(() => registration.update(), 60 * 60 * 1000);

            registration.addEventListener('updatefound', () => {
              const newWorker = registration.installing;
              if (newWorker) {
                newWorker.addEventListener('statechange', () => {
                  if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    console.log('New content available, refresh to update');
                  }
                });
              }
            });
          })
          .catch((err) => {
            console.warn('SW registration failed:', err);
          });
      });
    }

    // ── Insecure connection warning ──────────────────────────────────────────
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
