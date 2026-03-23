/**
 * B.E.E App Bahamas — Industry-Grade Input Sanitization & Validation
 * © 2025 B.E.E App Bahamas - All Rights Reserved
 *
 * Covers:
 *  - XSS prevention (HTML/script stripping)
 *  - URL allow-listing & protocol enforcement
 *  - Text length caps with character-class enforcement
 *  - File type & size hard gates
 *  - Search query sanitization
 *  - Rate-limiter per action key
 *  - Zod schemas for every public form
 */

import { z } from "zod";

// ─── Constants ───────────────────────────────────────────────────────────────

export const LIMITS = {
  NAME_MAX: 80,
  BIO_MAX: 300,
  LOCATION_MAX: 100,
  SEARCH_MAX: 120,
  TITLE_MAX: 120,
  DESCRIPTION_MAX: 500,
  URL_MAX: 2048,
  EMAIL_MAX: 254,
  PASSWORD_MIN: 8,
  PASSWORD_MAX: 128,
} as const;

// ─── Low-level XSS / injection strip ─────────────────────────────────────────

/** Remove all HTML tags and dangerous attribute patterns */
export const stripHtml = (input: string): string =>
  input
    .replace(/<[^>]*>/g, "")                        // strip ALL html tags
    .replace(/&lt;.*?&gt;/gi, "")                   // encoded brackets
    .replace(/javascript\s*:/gi, "")                // JS pseudo-protocol
    .replace(/data\s*:/gi, "")                      // data URI
    .replace(/vbscript\s*:/gi, "")                  // VBScript
    .replace(/on\w+\s*=\s*["']?[^"'\s>]*/gi, "")   // inline event handlers
    .replace(/expression\s*\(/gi, "")               // CSS expressions
    .trim();

/** Sanitize a plain-text user value (names, titles, descriptions, etc.) */
export const sanitizeText = (
  input: string,
  maxLength = LIMITS.DESCRIPTION_MAX
): string => {
  if (typeof input !== "string") return "";
  return stripHtml(input)
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "") // control chars
    .slice(0, maxLength)
    .trim();
};

/** Sanitize search queries — allow letters, numbers, spaces, and basic punctuation */
export const sanitizeSearch = (input: string): string => {
  if (typeof input !== "string") return "";
  return input
    .replace(/[<>'"`;\\{}()|]/g, "")   // dangerous chars
    .replace(/\s{2,}/g, " ")           // collapse whitespace
    .slice(0, LIMITS.SEARCH_MAX)
    .trim();
};

// ─── URL Validation ───────────────────────────────────────────────────────────

const ALLOWED_PROTOCOLS = ["https:", "http:"];
const BLOCKED_HOSTS = ["localhost", "127.0.0.1", "0.0.0.0", "::1"];

export const sanitizeUrl = (url: string): string | null => {
  if (!url || typeof url !== "string") return null;
  const clean = url.trim().slice(0, LIMITS.URL_MAX);
  try {
    const parsed = new URL(clean);
    if (!ALLOWED_PROTOCOLS.includes(parsed.protocol)) return null;
    if (BLOCKED_HOSTS.some((h) => parsed.hostname.includes(h))) return null;
    return parsed.href;
  } catch {
    return null;
  }
};

// ─── Zod schemas ─────────────────────────────────────────────────────────────

/** Reusable string transformer that strips HTML before validation */
const safeStr = (max: number) =>
  z
    .string()
    .transform((v) => sanitizeText(v, max));

export const profileSchema = z.object({
  name: safeStr(LIMITS.NAME_MAX)
    .pipe(z.string().min(1, "Name is required").max(LIMITS.NAME_MAX)),
  bio: safeStr(LIMITS.BIO_MAX)
    .pipe(z.string().max(LIMITS.BIO_MAX, `Bio must be ${LIMITS.BIO_MAX} chars or less`))
    .optional()
    .default(""),
  location: safeStr(LIMITS.LOCATION_MAX)
    .pipe(z.string().max(LIMITS.LOCATION_MAX, `Location must be ${LIMITS.LOCATION_MAX} chars or less`))
    .optional()
    .default(""),
  businessOwner: z.boolean().default(false),
  avatarUrl: z.string().optional().default(""),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

export const searchSchema = z.object({
  query: z
    .string()
    .transform((v) => sanitizeSearch(v))
    .pipe(z.string().max(LIMITS.SEARCH_MAX)),
  filter: z.enum(["all", "businesses", "events", "products"]).default("all"),
});

export type SearchFormData = z.infer<typeof searchSchema>;

export const videoSubmissionSchema = z.object({
  title: safeStr(LIMITS.TITLE_MAX)
    .pipe(z.string().min(1, "Title is required").max(LIMITS.TITLE_MAX)),
  description: safeStr(LIMITS.DESCRIPTION_MAX)
    .pipe(z.string().max(LIMITS.DESCRIPTION_MAX))
    .optional()
    .default(""),
  platform: z.enum(["youtube", "instagram", "tiktok", "facebook", "mp4"], {
    errorMap: () => ({ message: "Please select a valid platform" }),
  }),
  category: z.enum(["business", "events"], {
    errorMap: () => ({ message: "Please select a category" }),
  }),
  videoUrl: z
    .string()
    .optional()
    .default("")
    .transform((v) => sanitizeUrl(v ?? "") ?? ""),
});

export type VideoSubmissionData = z.infer<typeof videoSubmissionSchema>;

// ─── File validation ──────────────────────────────────────────────────────────

export interface FileValidationResult {
  isValid: boolean;
  error: string | null;
}

const VIDEO_MIME_ALLOWLIST = new Set([
  "video/mp4",
  "video/mpeg",
  "video/quicktime",
  "video/x-msvideo",
  "video/x-matroska",
  "video/webm",
]);

const IMAGE_MIME_ALLOWLIST = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]);

export const validateVideoFileSecure = (file: File): FileValidationResult => {
  if (!file) return { isValid: false, error: "No file provided" };

  // MIME type must be in explicit allowlist (not just startsWith)
  if (!VIDEO_MIME_ALLOWLIST.has(file.type)) {
    return {
      isValid: false,
      error: "Only MP4, MOV, AVI, MKV, and WebM video files are allowed",
    };
  }

  // Extension double-check
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  const allowedExts = ["mp4", "mpeg", "mov", "avi", "mkv", "webm"];
  if (!allowedExts.includes(ext)) {
    return { isValid: false, error: "File extension is not permitted" };
  }

  // Size: 50 MB hard cap
  const MAX_SIZE = 50 * 1024 * 1024;
  if (file.size > MAX_SIZE) {
    return { isValid: false, error: "File must be less than 50 MB" };
  }

  // Minimum size sanity check (1 KB)
  if (file.size < 1024) {
    return { isValid: false, error: "File appears to be empty or corrupt" };
  }

  return { isValid: true, error: null };
};

export const validateImageFileSecure = (file: File): FileValidationResult => {
  if (!file) return { isValid: false, error: "No file provided" };

  if (!IMAGE_MIME_ALLOWLIST.has(file.type)) {
    return {
      isValid: false,
      error: "Only JPEG, PNG, and WebP images are allowed",
    };
  }

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  const allowedExts = ["jpg", "jpeg", "png", "webp"];
  if (!allowedExts.includes(ext)) {
    return { isValid: false, error: "File extension is not permitted" };
  }

  // 5 MB hard cap for images
  const MAX_SIZE = 5 * 1024 * 1024;
  if (file.size > MAX_SIZE) {
    return { isValid: false, error: "Image must be less than 5 MB" };
  }

  if (file.size < 512) {
    return { isValid: false, error: "Image appears to be empty or corrupt" };
  }

  return { isValid: true, error: null };
};

// ─── Rate limiter ─────────────────────────────────────────────────────────────

interface RateLimitState {
  count: number;
  resetAt: number;
}

const _store = new Map<string, RateLimitState>();

/**
 * Client-side rate limiter — returns false when the caller exceeds
 * `maxCalls` within `windowMs` milliseconds for a given key.
 */
export const rateLimit = (
  key: string,
  maxCalls = 5,
  windowMs = 60_000
): boolean => {
  const now = Date.now();
  const state = _store.get(key);

  if (!state || now > state.resetAt) {
    _store.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (state.count >= maxCalls) return false;
  state.count += 1;
  return true;
};

// ─── Misc helpers ─────────────────────────────────────────────────────────────

/** Generate a cryptographically random nonce for CSP inline scripts */
export const generateNonce = (): string => {
  const buf = new Uint8Array(16);
  crypto.getRandomValues(buf);
  return btoa(String.fromCharCode(...buf));
};

/** Encode text for safe insertion into HTML attributes */
export const encodeHtmlAttr = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
