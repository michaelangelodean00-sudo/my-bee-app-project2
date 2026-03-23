/**
 * B.E.E App Bahamas — Industry-Grade Input Sanitization & Validation
 * © 2025 B.E.E App Bahamas - All Rights Reserved
 */

import { z } from "zod";

// ─── Constants ────────────────────────────────────────────────────────────────

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
};

// ─── XSS / Injection strip ────────────────────────────────────────────────────

export const stripHtml = (input: string): string =>
  input
    .replace(/<[^>]*>/g, "")
    .replace(/&lt;.*?&gt;/gi, "")
    .replace(/javascript\s*:/gi, "")
    .replace(/data\s*:/gi, "")
    .replace(/vbscript\s*:/gi, "")
    .replace(/on\w+\s*=\s*["']?[^"'\s>]*/gi, "")
    .replace(/expression\s*\(/gi, "")
    .trim();

export const sanitizeText = (input: string, maxLength: number): string => {
  if (typeof input !== "string") return "";
  return stripHtml(input)
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
    .slice(0, maxLength)
    .trim();
};

export const sanitizeSearch = (input: string): string => {
  if (typeof input !== "string") return "";
  return input
    .replace(/[<>'"`;\\{}()|]/g, "")
    .replace(/\s{2,}/g, " ")
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

export const profileSchema = z.object({
  name: z
    .string()
    .transform((v) => sanitizeText(v, LIMITS.NAME_MAX))
    .refine((v) => v.length >= 1, "Name is required")
    .refine((v) => v.length <= LIMITS.NAME_MAX, `Name must be ${LIMITS.NAME_MAX} chars or less`),
  bio: z
    .string()
    .optional()
    .default("")
    .transform((v) => sanitizeText(v ?? "", LIMITS.BIO_MAX))
    .refine((v) => v.length <= LIMITS.BIO_MAX, `Bio must be ${LIMITS.BIO_MAX} chars or less`),
  location: z
    .string()
    .optional()
    .default("")
    .transform((v) => sanitizeText(v ?? "", LIMITS.LOCATION_MAX))
    .refine((v) => v.length <= LIMITS.LOCATION_MAX, `Location must be ${LIMITS.LOCATION_MAX} chars or less`),
  businessOwner: z.boolean().default(false),
  avatarUrl: z.string().optional().default(""),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

export const searchSchema = z.object({
  query: z
    .string()
    .transform((v) => sanitizeSearch(v))
    .refine((v) => v.length <= LIMITS.SEARCH_MAX, "Search query too long"),
  filter: z.enum(["all", "businesses", "events", "products"]).default("all"),
});

export type SearchFormData = z.infer<typeof searchSchema>;

export const videoSubmissionSchema = z.object({
  title: z
    .string()
    .transform((v) => sanitizeText(v, LIMITS.TITLE_MAX))
    .refine((v) => v.length >= 1, "Title is required")
    .refine((v) => v.length <= LIMITS.TITLE_MAX, `Title must be ${LIMITS.TITLE_MAX} chars or less`),
  description: z
    .string()
    .optional()
    .default("")
    .transform((v) => sanitizeText(v ?? "", LIMITS.DESCRIPTION_MAX))
    .refine((v) => v.length <= LIMITS.DESCRIPTION_MAX),
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
    .transform((v) => {
      if (!v) return "";
      const safe = sanitizeUrl(v);
      return safe ?? "";
    }),
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
  if (!VIDEO_MIME_ALLOWLIST.has(file.type)) {
    return { isValid: false, error: "Only MP4, MOV, AVI, MKV, and WebM video files are allowed" };
  }
  const ext = (file.name.split(".").pop() ?? "").toLowerCase();
  const allowedExts = ["mp4", "mpeg", "mov", "avi", "mkv", "webm"];
  if (!allowedExts.includes(ext)) {
    return { isValid: false, error: "File extension is not permitted" };
  }
  if (file.size > 50 * 1024 * 1024) {
    return { isValid: false, error: "Video must be less than 50 MB" };
  }
  if (file.size < 1024) {
    return { isValid: false, error: "File appears to be empty or corrupt" };
  }
  return { isValid: true, error: null };
};

export const validateImageFileSecure = (file: File): FileValidationResult => {
  if (!file) return { isValid: false, error: "No file provided" };
  if (!IMAGE_MIME_ALLOWLIST.has(file.type)) {
    return { isValid: false, error: "Only JPEG, PNG, and WebP images are allowed" };
  }
  const ext = (file.name.split(".").pop() ?? "").toLowerCase();
  const allowedExts = ["jpg", "jpeg", "png", "webp"];
  if (!allowedExts.includes(ext)) {
    return { isValid: false, error: "File extension is not permitted" };
  }
  if (file.size > 5 * 1024 * 1024) {
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

const _rlStore = new Map<string, RateLimitState>();

export const rateLimit = (key: string, maxCalls = 5, windowMs = 60_000): boolean => {
  const now = Date.now();
  const state = _rlStore.get(key);
  if (!state || now > state.resetAt) {
    _rlStore.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (state.count >= maxCalls) return false;
  state.count += 1;
  return true;
};

// ─── Misc ─────────────────────────────────────────────────────────────────────

export const generateNonce = (): string => {
  const buf = new Uint8Array(16);
  crypto.getRandomValues(buf);
  return btoa(String.fromCharCode(...buf));
};

export const encodeHtmlAttr = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
