import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";

/**
 * Admin-only design preview. Demo/sample content is shown ONLY when the
 * signed-in user is an admin AND has switched preview on for this tab session.
 * Never enabled by build mode alone (preview links can be public).
 */
const KEY = "bee_preview";
const EVENT = "bee-preview-change";

const readFlag = () => {
  try {
    return sessionStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
};

export const usePreviewMode = () => {
  const { isAdmin } = useAuth();
  const [flag, setFlag] = useState(readFlag);

  useEffect(() => {
    const sync = () => setFlag(readFlag());
    window.addEventListener(EVENT, sync);
    return () => window.removeEventListener(EVENT, sync);
  }, []);

  const setPreview = useCallback((on: boolean) => {
    try {
      if (on) sessionStorage.setItem(KEY, "1");
      else sessionStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
    window.dispatchEvent(new Event(EVENT));
  }, []);

  return { isPreview: isAdmin && flag, canPreview: isAdmin, setPreview };
};
