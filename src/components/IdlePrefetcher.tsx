import { useEffect } from "react";

/**
 * Prefetches lazy route chunks during browser idle time.
 * Makes subsequent navigation feel instant without delaying first paint.
 */
const IdlePrefetcher = () => {
  useEffect(() => {
    const prefetch = () => {
      // Warm the lazy chunks — imports resolve from Vite cache on real nav
      import("../pages/Businesses");
      import("../pages/Events");
      import("../pages/Ecommerce");
      import("../pages/UserProfilePage");
      import("../pages/ProfileSettings");
      import("../pages/VideoUpload");
    };

    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
    };

    if (typeof w.requestIdleCallback === "function") {
      w.requestIdleCallback(prefetch, { timeout: 2500 });
    } else {
      const t = setTimeout(prefetch, 1500);
      return () => clearTimeout(t);
    }
  }, []);

  return null;
};

export default IdlePrefetcher;
