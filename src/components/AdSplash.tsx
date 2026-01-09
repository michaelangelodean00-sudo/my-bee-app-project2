import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { ExternalLink, Share2, Volume2, VolumeX, Play, Pause } from "lucide-react";
import ShareDialog from './ShareDialog';
import { useAdAnalytics } from '@/hooks/useAdAnalytics';

interface Ad {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  videoUrl?: string;
  linkUrl: string;
  type: 'image' | 'video';
}

const ads: Ad[] = [
  {
    id: '1',
    title: 'Premium Honey Collection',
    description: 'Discover our exclusive organic honey varieties from local beekeepers',
    imageUrl: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=1920&h=1080&fit=crop&q=90&fm=webp',
    linkUrl: 'https://example.com/honey',
    type: 'image'
  },
  {
    id: '2',
    title: 'Bee Conservation Initiative',
    description: 'Join our mission to protect bee populations worldwide',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    linkUrl: 'https://example.com/conservation',
    type: 'video'
  },
  {
    id: '3',
    title: 'Artisan Beeswax Products',
    description: 'Handcrafted candles and skincare made with pure beeswax',
    imageUrl: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=1920&h=1080&fit=crop&q=90&fm=webp',
    linkUrl: 'https://example.com/beeswax',
    type: 'image'
  },
  {
    id: '4',
    title: 'Beekeeping Essentials',
    description: 'Everything you need to start your beekeeping journey',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    linkUrl: 'https://example.com/beekeeping',
    type: 'video'
  },
  {
    id: '5',
    title: 'Pollinator Garden Seeds',
    description: 'Create a bee-friendly garden with our curated seed collection',
    imageUrl: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1920&h=1080&fit=crop&q=90&fm=webp',
    linkUrl: 'https://example.com/seeds',
    type: 'image'
  }
];

const AdSplash = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const [loadedMedia, setLoadedMedia] = useState<Set<number>>(new Set([0, 1]));
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedAd, setSelectedAd] = useState<Ad | null>(null);
  const [mutedVideos, setMutedVideos] = useState<Set<string>>(new Set(ads.filter(a => a.type === 'video').map(a => a.id)));
  const [playingVideos, setPlayingVideos] = useState<Set<string>>(new Set());
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});
  
  const { trackImpression, trackClick } = useAdAnalytics();

  // Preload images
  useEffect(() => {
    ads.forEach((ad, index) => {
      if (ad.type === 'image' && ad.imageUrl && index < 3) {
        const img = new Image();
        img.src = ad.imageUrl;
        img.onload = () => {
          setLoadedMedia(prev => new Set([...prev, index]));
        };
      }
    });
  }, []);

  // Handle autoplay
  useEffect(() => {
    if (!api || !autoplay) return;

    const interval = setInterval(() => {
      const currentAd = ads[current];
      // If current slide is a playing video, don't auto-advance
      if (currentAd?.type === 'video' && playingVideos.has(currentAd.id)) {
        return;
      }
      api.scrollNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [api, autoplay, current, playingVideos]);

  // Track slide changes
  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      const newIndex = api.selectedScrollSnap();
      setCurrent(newIndex);
      
      // Lazy load nearby slides
      setLoadedMedia(prev => {
        const newSet = new Set(prev);
        for (let i = Math.max(0, newIndex - 1); i <= Math.min(ads.length - 1, newIndex + 1); i++) {
          newSet.add(i);
        }
        return newSet;
      });

      // Pause all videos except current
      Object.entries(videoRefs.current).forEach(([id, video]) => {
        if (video && ads[newIndex]?.id !== id) {
          video.pause();
          setPlayingVideos(prev => {
            const newSet = new Set(prev);
            newSet.delete(id);
            return newSet;
          });
        }
      });
    };

    api.on('select', onSelect);
    return () => {
      api.off('select', onSelect);
    };
  }, [api]);

  // Track impressions
  useEffect(() => {
    if (ads[current]) {
      trackImpression(ads[current].id);
    }
  }, [current, trackImpression]);

  const handleGetMoreInfo = useCallback((ad: Ad) => {
    trackClick(ad.id);
    window.open(ad.linkUrl, '_blank', 'noopener,noreferrer');
  }, [trackClick]);

  const handleShare = useCallback((ad: Ad) => {
    setSelectedAd(ad);
    setShareDialogOpen(true);
  }, []);

  const toggleMute = useCallback((adId: string) => {
    setMutedVideos(prev => {
      const newSet = new Set(prev);
      if (newSet.has(adId)) {
        newSet.delete(adId);
      } else {
        newSet.add(adId);
      }
      return newSet;
    });
  }, []);

  const togglePlayPause = useCallback((adId: string) => {
    const video = videoRefs.current[adId];
    if (video) {
      if (video.paused) {
        video.play();
        setPlayingVideos(prev => new Set([...prev, adId]));
      } else {
        video.pause();
        setPlayingVideos(prev => {
          const newSet = new Set(prev);
          newSet.delete(adId);
          return newSet;
        });
      }
    }
  }, []);

  const handleVideoRef = useCallback((adId: string, el: HTMLVideoElement | null) => {
    videoRefs.current[adId] = el;
  }, []);

  return (
    <div className="relative w-full overflow-hidden rounded-xl bg-gradient-to-br from-background to-muted/30">
      <Carousel
        setApi={setApi}
        className="w-full"
        opts={{
          align: "start",
          loop: true,
        }}
        onMouseEnter={() => setAutoplay(false)}
        onMouseLeave={() => setAutoplay(true)}
      >
        <CarouselContent>
          {ads.map((ad, index) => (
            <CarouselItem key={ad.id}>
              <div className="relative aspect-[21/9] sm:aspect-[21/8] md:aspect-[21/7] overflow-hidden rounded-xl">
                {/* Media Content */}
                {loadedMedia.has(index) ? (
                  ad.type === 'video' && ad.videoUrl ? (
                    <div className="relative w-full h-full">
                      <video
                        ref={(el) => handleVideoRef(ad.id, el)}
                        src={ad.videoUrl}
                        className="w-full h-full object-cover"
                        loop
                        muted={mutedVideos.has(ad.id)}
                        playsInline
                        onPlay={() => setPlayingVideos(prev => new Set([...prev, ad.id]))}
                        onPause={() => setPlayingVideos(prev => {
                          const newSet = new Set(prev);
                          newSet.delete(ad.id);
                          return newSet;
                        })}
                      />
                      {/* Video Controls */}
                      <div className="absolute bottom-4 right-4 flex gap-2 z-20">
                        <Button
                          variant="secondary"
                          size="icon"
                          className="h-10 w-10 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm"
                          onClick={() => togglePlayPause(ad.id)}
                        >
                          {playingVideos.has(ad.id) ? (
                            <Pause className="h-5 w-5 text-white" />
                          ) : (
                            <Play className="h-5 w-5 text-white" />
                          )}
                        </Button>
                        <Button
                          variant="secondary"
                          size="icon"
                          className="h-10 w-10 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm"
                          onClick={() => toggleMute(ad.id)}
                        >
                          {mutedVideos.has(ad.id) ? (
                            <VolumeX className="h-5 w-5 text-white" />
                          ) : (
                            <Volume2 className="h-5 w-5 text-white" />
                          )}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <img
                      src={ad.imageUrl}
                      alt={ad.title}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                      loading={index === 0 ? "eager" : "lazy"}
                    />
                  )
                ) : (
                  <div className="w-full h-full bg-muted animate-pulse" />
                )}
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                
                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8">
                  <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        {ad.type === 'video' && (
                          <span className="px-2 py-0.5 text-xs font-medium bg-primary/80 text-primary-foreground rounded-full">
                            VIDEO
                          </span>
                        )}
                        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white drop-shadow-lg">
                          {ad.title}
                        </h3>
                      </div>
                      <p className="text-sm sm:text-base text-white/90 max-w-lg drop-shadow">
                        {ad.description}
                      </p>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm"
                        onClick={() => handleShare(ad)}
                      >
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                      <Button
                        size="sm"
                        className="bg-primary hover:bg-primary/90"
                        onClick={() => handleGetMoreInfo(ad)}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Learn More
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        {/* Navigation */}
        <CarouselPrevious className="left-2 sm:left-4 h-10 w-10 bg-black/30 hover:bg-black/50 border-0 text-white" />
        <CarouselNext className="right-2 sm:right-4 h-10 w-10 bg-black/30 hover:bg-black/50 border-0 text-white" />
      </Carousel>
      
      {/* Slide Indicators */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {ads.map((ad, index) => (
          <button
            key={ad.id}
            onClick={() => api?.scrollTo(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              current === index 
                ? 'w-8 bg-primary' 
                : 'w-2 bg-white/50 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {selectedAd && (
        <ShareDialog
          open={shareDialogOpen}
          onOpenChange={setShareDialogOpen}
          postId={selectedAd.id}
          postContent={`${selectedAd.title} - ${selectedAd.description}`}
        />
      )}
    </div>
  );
};

export default AdSplash;
