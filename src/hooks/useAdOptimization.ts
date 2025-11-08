import { useEffect, useState } from "react";
import { optimizeAd, optimizeAds } from "@/utils/adUtils";
import type { Ad } from "@/utils/adUtils";

/**
 * Custom hook to automatically optimize ad images on upload
 * Use this in admin panels or upload forms to ensure all customer ads
 * are automatically optimized for maximum quality and revenue
 */
export const useAdOptimization = (
  ads: Ad[],
  type: 'splash' | 'widget' | 'banner' = 'splash'
) => {
  const [optimizedAds, setOptimizedAds] = useState<Ad[]>([]);
  const [isOptimizing, setIsOptimizing] = useState(false);

  useEffect(() => {
    setIsOptimizing(true);
    const optimized = optimizeAds(ads, type);
    setOptimizedAds(optimized);
    setIsOptimizing(false);
  }, [ads, type]);

  return { optimizedAds, isOptimizing };
};

/**
 * Function to optimize a single ad when uploaded
 */
export const optimizeAdOnUpload = (
  ad: Ad,
  type: 'splash' | 'widget' | 'banner' = 'splash'
): Ad => {
  return optimizeAd(ad, type);
};
