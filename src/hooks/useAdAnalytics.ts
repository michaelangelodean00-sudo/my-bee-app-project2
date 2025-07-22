
import { useState, useCallback } from 'react';
import { VideoAd, AdAnalytics } from '@/types/ads';

export const useAdAnalytics = () => {
  const [analytics, setAnalytics] = useState<AdAnalytics[]>([]);

  const trackImpression = useCallback((adId: string) => {
    // In a real app, this would send data to your analytics backend
    console.log(`Ad impression tracked: ${adId}`);
    
    // Update local analytics
    setAnalytics(prev => {
      const today = new Date().toISOString().split('T')[0];
      const existing = prev.find(a => a.adId === adId && a.date === today);
      
      if (existing) {
        return prev.map(a => 
          a.adId === adId && a.date === today 
            ? { ...a, impressions: a.impressions + 1 }
            : a
        );
      } else {
        return [...prev, {
          adId,
          date: today,
          impressions: 1,
          clicks: 0,
          views: 0,
          ctr: 0,
          cost: 0
        }];
      }
    });
  }, []);

  const trackClick = useCallback((adId: string) => {
    // In a real app, this would send data to your analytics backend
    console.log(`Ad click tracked: ${adId}`);
    
    // Update local analytics
    setAnalytics(prev => {
      const today = new Date().toISOString().split('T')[0];
      return prev.map(a => {
        if (a.adId === adId && a.date === today) {
          const newClicks = a.clicks + 1;
          const newCtr = a.impressions > 0 ? (newClicks / a.impressions) * 100 : 0;
          return { ...a, clicks: newClicks, ctr: newCtr };
        }
        return a;
      });
    });
  }, []);

  const trackView = useCallback((adId: string, duration: number) => {
    // Track when user actually watches the ad
    console.log(`Ad view tracked: ${adId}, duration: ${duration}s`);
    
    setAnalytics(prev => {
      const today = new Date().toISOString().split('T')[0];
      return prev.map(a => {
        if (a.adId === adId && a.date === today) {
          return { ...a, views: a.views + 1 };
        }
        return a;
      });
    });
  }, []);

  const getAdPerformance = useCallback((adId: string, days: number = 7) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return analytics
      .filter(a => a.adId === adId && new Date(a.date) >= cutoffDate)
      .reduce((acc, curr) => ({
        totalImpressions: acc.totalImpressions + curr.impressions,
        totalClicks: acc.totalClicks + curr.clicks,
        totalViews: acc.totalViews + curr.views,
        averageCtr: acc.averageCtr + curr.ctr,
        totalCost: acc.totalCost + curr.cost
      }), {
        totalImpressions: 0,
        totalClicks: 0,
        totalViews: 0,
        averageCtr: 0,
        totalCost: 0
      });
  }, [analytics]);

  return {
    trackImpression,
    trackClick,
    trackView,
    getAdPerformance,
    analytics
  };
};
