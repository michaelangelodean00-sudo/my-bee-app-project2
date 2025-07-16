
export interface VideoAd {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  advertiser: string;
  category: 'business' | 'events' | 'general';
  targetSection: 'businesses' | 'events' | 'both';
  duration: number; // in seconds
  clickUrl?: string;
  impressions: number;
  clicks: number;
  isActive: boolean;
  createdAt: string;
  budget?: number;
  costPerView?: number;
}

export interface SponsoredContent {
  videoId: string;
  advertiser: string;
  sponsorshipType: 'promoted' | 'featured' | 'sponsored';
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface AdAnalytics {
  adId: string;
  date: string;
  impressions: number;
  clicks: number;
  views: number;
  ctr: number; // click-through rate
  cost: number;
}
