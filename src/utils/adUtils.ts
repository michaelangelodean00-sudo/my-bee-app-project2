
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
