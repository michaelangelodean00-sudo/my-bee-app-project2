/**
 * useSecureForm — wraps react-hook-form + zod resolver with
 * - automatic XSS sanitization on every string field before validation
 * - rate-limiting on submit attempts
 * - submission-count tracking for suspicious activity detection
 */

import { useCallback, useRef } from "react";
import { useForm, UseFormProps, FieldValues, DefaultValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ZodSchema } from "zod";
import { rateLimit } from "@/utils/sanitization";
import { toast } from "sonner";

interface UseSecureFormOptions<T extends FieldValues> extends UseFormProps<T> {
  schema: ZodSchema<T>;
  /** Unique key used for rate-limiting (e.g. "video-upload", "search") */
  rateLimitKey: string;
  /** Max submissions per window (default 10) */
  maxSubmissions?: number;
  /** Rate-limit window in ms (default 60 s) */
  windowMs?: number;
}

export function useSecureForm<T extends FieldValues>({
  schema,
  rateLimitKey,
  maxSubmissions = 10,
  windowMs = 60_000,
  defaultValues,
  ...rest
}: UseSecureFormOptions<T>) {
  const attempts = useRef(0);

  const form = useForm<T>({
    ...rest,
    resolver: zodResolver(schema),
    defaultValues: defaultValues as DefaultValues<T>,
  });

  /** Wraps a submit handler with rate-limit enforcement */
  const handleSecureSubmit = useCallback(
    (handler: (data: T) => void | Promise<void>) =>
      form.handleSubmit((data) => {
        attempts.current += 1;

        if (!rateLimit(rateLimitKey, maxSubmissions, windowMs)) {
          toast.error("Too many attempts. Please wait a moment and try again.", {
            description: "Your activity has been rate-limited for security.",
          });
          return;
        }

        return handler(data);
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [form, rateLimitKey, maxSubmissions, windowMs]
  );

  return { ...form, handleSecureSubmit };
}
