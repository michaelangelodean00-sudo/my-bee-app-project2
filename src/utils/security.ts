
// ── URL safety helpers ───────────────────────────────────────────────────────

/**
 * Resolve an untrusted `next`/`returnTo` value to a SAME-ORIGIN relative path.
 *
 * Returns `fallback` for anything that would leave this origin. Do not
 * pattern-match on the raw string: for special schemes the URL parser treats
 * a backslash as a forward slash, so `/\evil.com` and `/\/evil.com` resolve to
 * `https://evil.com/` while still passing a naive
 * `startsWith("/") && !startsWith("//")` check. Parsing and comparing the
 * resolved origin is the only reliable test.
 */
export const safeInternalPath = (
  raw: string | null | undefined,
  fallback = "/"
): string => {
  if (!raw) return fallback;
  try {
    const base = window.location.origin;
    const resolved = new URL(raw, base);
    if (resolved.origin !== base) return fallback;
    const path = `${resolved.pathname}${resolved.search}${resolved.hash}`;
    return path.startsWith("/") ? path : fallback;
  } catch {
    return fallback;
  }
};

/** True only for absolute http(s) URLs — blocks javascript:, data:, blob:, etc. */
export const isValidUrl = (url: string): boolean => {
  try {
    return ["http:", "https:"].includes(new URL(url).protocol);
  } catch {
    return false;
  }
};

/**
 * Open an untrusted URL in a new tab with the opener relationship severed.
 *
 * `noopener` prevents reverse tabnabbing (the opened page rewriting
 * `window.opener.location`). The scheme check stops `javascript:` URLs, which
 * `window.open` would otherwise execute in this origin.
 */
export const openExternal = (url: string): void => {
  if (!isValidUrl(url)) return;
  window.open(url, "_blank", "noopener,noreferrer");
};

// ── Misc ─────────────────────────────────────────────────────────────────────

/** Rate limiting helper (basic client-side; a convenience, not a control). */
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

/** Generate secure random tokens */
export const generateSecureToken = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
};

/** Check for common security headers (dev-only debugging aid) */
export const checkSecurityHeaders = (): void => {
  if (import.meta.env.DEV) {
    const csp = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    const xcto = document.querySelector('meta[http-equiv="X-Content-Type-Options"]');
    console.group('🔒 Security Headers Check');
    console.log('Content-Security-Policy:', csp ? '✅ present' : '⚠️  missing');
    console.log('X-Content-Type-Options:', xcto ? '✅ present' : '⚠️  missing');
    console.log(
      'frame-ancestors:',
      csp?.getAttribute('content')?.includes('frame-ancestors')
        ? '✅ present'
        : '⚠️  missing — page is framable'
    );
    console.groupEnd();
  }
};
