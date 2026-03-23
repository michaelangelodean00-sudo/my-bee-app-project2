
// Content Security Policy helpers
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '');
};

// Validate URLs to prevent malicious redirects
export const isValidUrl = (url: string): boolean => {
  try {
    const parsedUrl = new URL(url);
    return ['http:', 'https:'].includes(parsedUrl.protocol);
  } catch {
    return false;
  }
};

// Rate limiting helper (basic client-side)
export const createRateLimiter = (maxAttempts: number, windowMs: number) => {
  const attempts = new Map<string, { count: number; resetTime: number }>();

  return (identifier: string): boolean => {
    const now = Date.now();
    const current = attempts.get(identifier);

    if (!current || now > current.resetTime) {
      attempts.set(identifier, { count: 1, resetTime: now + windowMs });
      return true;
    }

    if (current.count >= maxAttempts) {
      return false;
    }

    current.count++;
    return true;
  };
};

// Generate secure random tokens
export const generateSecureToken = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

// Check for common security headers (for debugging)
export const checkSecurityHeaders = (): void => {
  if (import.meta.env.DEV) {
    const csp = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    const xfo = document.querySelector('meta[http-equiv="X-Frame-Options"]');
    const xcto = document.querySelector('meta[http-equiv="X-Content-Type-Options"]');
    console.group('🔒 Security Headers Check');
    console.log('Content-Security-Policy:', csp ? '✅ present' : '⚠️  missing');
    console.log('X-Frame-Options:', xfo ? '✅ present' : '⚠️  missing');
    console.log('X-Content-Type-Options:', xcto ? '✅ present' : '⚠️  missing');
    console.groupEnd();
  }
};
