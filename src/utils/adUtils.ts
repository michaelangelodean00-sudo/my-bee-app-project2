
export interface Ad {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  linkUrl: string;
  priority?: number; // For ad ordering
  startDate?: string; // For scheduling
  endDate?: string; // For scheduling
  isActive?: boolean; // For enabling/disabling
  isAdvertiseCTA?: boolean; // For "Advertise Here" placeholder slides
}

export const filterActiveAds = (ads: Ad[]): Ad[] => {
  const now = new Date();
  
  return ads.filter(ad => {
    // Check if ad is marked as active (default to true if not specified)
    if (ad.isActive === false) return false;
    
    // Check date range if specified
    if (ad.startDate && new Date(ad.startDate) > now) return false;
    if (ad.endDate && new Date(ad.endDate) < now) return false;
    
    return true;
  });
};

export const sortAdsByPriority = (ads: Ad[]): Ad[] => {
  return [...ads].sort((a, b) => {
    const priorityA = a.priority ?? 0;
    const priorityB = b.priority ?? 0;
    return priorityB - priorityA; // Higher priority first
  });
};

export const validateAdUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
};

export const batchPreloadImages = async (imageUrls: string[], batchSize: number = 3): Promise<void> => {
  for (let i = 0; i < imageUrls.length; i += batchSize) {
    const batch = imageUrls.slice(i, i + batchSize);
    await Promise.allSettled(batch.map(preloadImage));
  }
};

export interface ImageOptimizationOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png';
  fit?: 'crop' | 'contain' | 'cover';
}

/**
 * Automatically optimizes image URLs for better quality and performance
 * Applies high-quality WebP format and proper sizing for ad revenue optimization
 */
export const optimizeImageUrl = (
  url: string, 
  type: 'splash' | 'widget' | 'banner' = 'splash',
  customOptions?: ImageOptimizationOptions
): string => {
  // Skip optimization for uploaded files or data URLs
  if (url.startsWith('data:') || url.startsWith('blob:') || url.startsWith('/lovable-uploads/')) {
    return url;
  }

  // Default optimization settings based on ad type
  const defaultOptions: Record<string, ImageOptimizationOptions> = {
    splash: { width: 1920, height: 1080, quality: 90, format: 'webp', fit: 'crop' },
    widget: { width: 256, height: 256, quality: 90, format: 'webp', fit: 'crop' },
    banner: { width: 1200, height: 1600, quality: 90, format: 'webp', fit: 'crop' }
  };

  const options = { ...defaultOptions[type], ...customOptions };

  // Handle Unsplash URLs
  if (url.includes('unsplash.com')) {
    const baseUrl = url.split('?')[0];
    const params = new URLSearchParams();
    
    if (options.width) params.set('w', options.width.toString());
    if (options.height) params.set('h', options.height.toString());
    if (options.quality) params.set('q', options.quality.toString());
    if (options.format) params.set('fm', options.format);
    if (options.fit) params.set('fit', options.fit);
    
    return `${baseUrl}?${params.toString()}`;
  }

  // Handle other CDN URLs - add custom logic here for other image services
  // For now, return original URL if not Unsplash
  return url;
};

/**
 * Automatically optimize an Ad object's image URL
 */
export const optimizeAd = (ad: Ad, type: 'splash' | 'widget' | 'banner' = 'splash'): Ad => {
  return {
    ...ad,
    imageUrl: optimizeImageUrl(ad.imageUrl, type)
  };
};

/**
 * Batch optimize multiple ads
 */
export const optimizeAds = (ads: Ad[], type: 'splash' | 'widget' | 'banner' = 'splash'): Ad[] => {
  return ads.map(ad => optimizeAd(ad, type));
};
