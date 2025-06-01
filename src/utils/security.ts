
// Content Security Policy helpers
export const sanitizeInput = (input: string): string => {
  // Basic XSS prevention - remove potentially dangerous characters
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
    // Only allow http and https protocols
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
  if (process.env.NODE_ENV === 'development') {
    console.log('Security Headers Check:');
    console.log('- Content-Security-Policy:', document.querySelector('meta[http-equiv="Content-Security-Policy"]') ? '✓' : '✗');
    console.log('- X-Frame-Options:', '(Check server response headers)');
    console.log('- X-Content-Type-Options:', '(Check server response headers)');
  }
};
