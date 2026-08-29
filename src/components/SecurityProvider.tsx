
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
          "script-src 'self' 'unsafe-inline'",
          "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
          "font-src 'self' https://fonts.gstatic.com data:",
          "img-src 'self' data: blob: https:",
          "media-src 'self' blob: https:",
          "connect-src 'self' https: wss:",
          "frame-src 'none'",
          "object-src 'none'",
          "base-uri 'self'",
          "form-action 'self'",
          "upgrade-insecure-requests",
        ].join('; ')
      );
      document.head.prepend(csp);
    }

    // ── Framing guard ────────────────────────────────────────────────────────
    // Frame-busting via JS is intentionally disabled: the app is designed to
    // run inside the Lovable preview iframe and other trusted embed contexts.
    // Cross-origin `window.top.location` assignments throw SecurityError and
    // previously triggered an infinite reload loop.
    //
    // NOTE: `frame-src` above does NOT provide clickjacking protection - it
    // restricts what this page may embed, not who may embed this page. The
    // actual control is the `frame-ancestors` directive, which browsers only
    // honour from a real HTTP response header (never from a <meta> tag). It is
    // configured per-host in public/_headers, vercel.json and public/.htaccess.
    // If this app is served from a host none of those cover, that header must
    // be added there or the app is framable by anyone.

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
