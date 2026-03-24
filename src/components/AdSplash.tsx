import { useState, useEffect, useCallback, memo, useRef } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogPortal,
  DialogOverlay,
} from "@/components/ui/dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import bambooAd from "../images/bamboo-ad.jpeg";
import advertiseHereSample from "../assets/advertise-here-sample.jpg";
import { optimizeAds, preloadImage } from "@/utils/adUtils";
import type { Ad } from "@/utils/adUtils";
import { useAdAnalytics } from "@/hooks/useAdAnalytics";
import ShareDialog from "./ShareDialog";
import { Share2, Sparkles, X, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";

// Image Preview with pinch-to-zoom
const ZoomableImage = memo(({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const lastTouchRef = useRef<{ x: number; y: number } | null>(null);
  const lastPinchDistanceRef = useRef<number | null>(null);
  const lastTapRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const resetZoom = useCallback(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      // Pinch start
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      lastPinchDistanceRef.current = dist;
    } else if (e.touches.length === 1) {
      // Single touch - check for double tap
      const now = Date.now();
      if (now - lastTapRef.current < 300) {
        // Double tap - toggle zoom
        if (scale > 1) {
          resetZoom();
        } else {
          setScale(2.5);
        }
        lastTapRef.current = 0;
      } else {
        lastTapRef.current = now;
      }
      
      if (scale > 1) {
        setIsDragging(true);
        lastTouchRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    }
  }, [scale, resetZoom]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2 && lastPinchDistanceRef.current !== null) {
      // Pinch zoom
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const delta = dist / lastPinchDistanceRef.current;
      lastPinchDistanceRef.current = dist;
      
      setScale(prev => Math.min(Math.max(prev * delta, 1), 4));
    } else if (e.touches.length === 1 && isDragging && lastTouchRef.current && scale > 1) {
      // Pan
      const deltaX = e.touches[0].clientX - lastTouchRef.current.x;
      const deltaY = e.touches[0].clientY - lastTouchRef.current.y;
      lastTouchRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      
      setPosition(prev => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }));
    }
  }, [isDragging, scale]);

  const handleTouchEnd = useCallback(() => {
    lastPinchDistanceRef.current = null;
    lastTouchRef.current = null;
    setIsDragging(false);
    
    // Reset position if zoomed out
    if (scale <= 1) {
      setPosition({ x: 0, y: 0 });
    }
  }, [scale]);

  // Reset on close
  useEffect(() => {
    return () => resetZoom();
  }, [resetZoom]);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center touch-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 z-50 bg-black/50 hover:bg-black/70 text-white rounded-full h-10 w-10"
        onClick={onClose}
      >
        <X size={20} />
      </Button>
      
      {/* Zoom indicator */}
      {scale > 1 && (
        <div className="absolute top-2 left-2 z-50 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
          {Math.round(scale * 100)}%
        </div>
      )}
      
      {/* Instructions hint */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 bg-black/50 text-white text-xs px-3 py-1.5 rounded-full opacity-70 pointer-events-none">
        {scale > 1 ? "Drag to pan • Double-tap to reset" : "Pinch to zoom • Double-tap to zoom"}
      </div>
      
      <img
        src={src}
        alt={alt}
        className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl select-none"
        style={{
          transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
          transition: isDragging ? 'none' : 'transform 0.2s ease-out'
        }}
        draggable={false}
      />
    </div>
  );
});

ZoomableImage.displayName = 'ZoomableImage';

// Static ads array - defined outside component
const ads: Ad[] = [
  {
    id: "ad1",
    title: "Summer Festival Weekend",
    description: "Join us for the biggest summer celebration with live music, food, and activities for the whole family.",
    imageUrl: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1200&h=675&q=75&fm=webp&fit=crop",
    linkUrl: "https://www.facebook.com/summerfestival"
  },
  {
    id: "ad2",
    title: "Local Business Spotlight",
    description: "Discover the best local businesses and exclusive deals just for B.E.E App members.",
    imageUrl: "https://images.unsplash.com/photo-1525328437458-0c4d4db7cab4?w=1200&h=675&q=75&fm=webp&fit=crop",
    linkUrl: "https://www.instagram.com/localbusiness"
  },
  {
    id: "ad3",
    title: "Island Tour Specials",
    description: "Explore the beauty of our islands with special discounts on tours and excursions.",
    imageUrl: "https://images.unsplash.com/photo-1548574505-5e239809ee19?w=1200&h=675&q=75&fm=webp&fit=crop",
    linkUrl: "https://www.islandtours.com"
  },
  {
    id: "ad4",
    title: "Bamboo Shack Special",
    description: "Taste the best of the Bahamas! Visit Bamboo Shack for delicious local cuisine and unbeatable deals.",
    imageUrl: bambooAd,
    linkUrl: "https://www.bambooshackbahamas.com"
  },
  {
    id: "ad5",
    title: "Adventure Sports Center",
    description: "Try kayaking, snorkeling, and diving with professional instructors. Equipment provided.",
    imageUrl: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=1200&h=675&q=75&fm=webp&fit=crop",
    linkUrl: "https://www.adventuresports.com"
  },
  {
    id: "ad6",
    title: "Beachfront Yoga Retreat",
    description: "Find your zen with sunrise yoga sessions on pristine beaches. All skill levels welcome.",
    imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&h=675&q=75&fm=webp&fit=crop",
    linkUrl: "https://www.beachyoga.com"
  },
  {
    id: "ad7",
    title: "Tropical Spa Retreat",
    description: "Relax and rejuvenate with our signature treatments using natural island ingredients.",
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1920&h=1080&q=90&fm=webp&fit=crop",
    linkUrl: "https://www.tropicalspa.com"
  },
  {
    id: "ad8",
    title: "Artisan Market",
    description: "Shop unique handcrafted items from local artisans. Support our creative community.",
    imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=1080&q=90&fm=webp&fit=crop",
    linkUrl: "https://www.artisanmarket.com"
  },
  {
    id: "ad-advertise",
    title: "Advertise Here",
    description: "Your brand, seen by thousands of Bahamian customers every day. Join the businesses already growing with B.E.E App — contact us to book your spot!",
    imageUrl: advertiseHereSample,
    linkUrl: "mailto:advertise@beeapp.com",
    isAdvertiseCTA: true
  }
];

// Pre-optimize ads once at module level
const optimizedAdsStatic = optimizeAds(ads, 'splash');

const AdSplash = memo(() => {
  const optimizedAds = optimizedAdsStatic;
  
  const [autoplay, setAutoplay] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  // Start with first 3 images ready to load for instant render
  const [loadedImages, setLoadedImages] = useState(new Set([0, 1, 2]));
  const [api, setApi] = useState<CarouselApi>();
  // Start ready immediately - no waiting
  const [isReady, setIsReady] = useState(true);
  const [shareDialog, setShareDialog] = useState(false);
  const [selectedAd, setSelectedAd] = useState<Ad | null>(null);
  const [shareCounts, setShareCounts] = useState<Record<string, number>>({});
  const [imagePreview, setImagePreview] = useState<{ url: string; title: string } | null>(null);
  
  // Tap detection state for distinguishing taps from swipes
  const tapStartRef = useRef<{ x: number; y: number; time: number; imageUrl: string; title: string } | null>(null);

  // Analytics tracking
  const { trackImpression, trackClick, getAdPerformance } = useAdAnalytics();
  
  // Enable autoplay immediately, preload images in background
  useEffect(() => {
    // Start autoplay immediately
    setAutoplay(true);
    
    // Preload remaining images in background (non-blocking)
    const preloadRemaining = () => {
      optimizedAds.slice(2).forEach((ad, index) => {
        if (ad.imageUrl) {
          const img = new Image();
          img.src = ad.imageUrl;
        }
      });
    };
    
    // Defer preloading to not block initial render
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(preloadRemaining);
    } else {
      setTimeout(preloadRemaining, 1000);
    }
  }, [optimizedAds]);
  
  useEffect(() => {
    let interval: number;
    if (autoplay && api && isReady) {
      interval = window.setInterval(() => {
        api.scrollNext();
      }, 5000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoplay, api, isReady]);

  useEffect(() => {
    if (!api) return;
    api.on("select", () => {
      const newSlide = api.selectedScrollSnap();
      setCurrentSlide(newSlide);
      if (optimizedAds[newSlide]) {
        trackImpression(optimizedAds[newSlide].id);
      }
    });
  }, [api, optimizedAds, trackImpression]);
  
  // Track initial impression
  useEffect(() => {
    if (isReady && optimizedAds[0]) {
      trackImpression(optimizedAds[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady]);

  // Lazy load images for current and adjacent slides
  useEffect(() => {
    const indicesToLoad = [
      currentSlide,
      (currentSlide + 1) % optimizedAds.length,
      currentSlide === 0 ? optimizedAds.length - 1 : currentSlide - 1
    ];
    setLoadedImages(prev => {
      const newSet = new Set(prev);
      let hasNewItems = false;
      indicesToLoad.forEach(index => {
        if (!newSet.has(index)) {
          newSet.add(index);
          hasNewItems = true;
        }
      });
      return hasNewItems ? newSet : prev;
    });
  }, [currentSlide, optimizedAds.length]);

  const handleGetMoreInfo = useCallback((adId: string, linkUrl: string) => {
    trackClick(adId);
    window.open(linkUrl, '_blank', 'noopener,noreferrer');
  }, [trackClick]);

  const handleSlideChange = useCallback((index: number) => {
    if (api) api.scrollTo(index);
  }, [api]);

  const handleShare = useCallback((ad: Ad) => {
    console.log('handleShare called for ad:', ad.id, 'setting shareDialog to true');
    setSelectedAd(ad);
    setShareDialog(true);
    console.log('handleShare: state update dispatched');
  }, []);

  // Tap detection handlers - distinguish taps from swipes
  const handleImageTapStart = useCallback((e: React.PointerEvent | React.TouchEvent, imageUrl: string, title: string) => {
    const point = 'touches' in e ? e.touches[0] : e;
    tapStartRef.current = {
      x: point.clientX,
      y: point.clientY,
      time: Date.now(),
      imageUrl,
      title
    };
  }, []);

  const handleImageTapEnd = useCallback((e: React.PointerEvent | React.TouchEvent) => {
    if (!tapStartRef.current) return;
    
    const point = 'changedTouches' in e ? e.changedTouches[0] : e;
    const deltaX = Math.abs(point.clientX - tapStartRef.current.x);
    const deltaY = Math.abs(point.clientY - tapStartRef.current.y);
    const deltaTime = Date.now() - tapStartRef.current.time;
    
    // If movement is small (<25px) and time is short (<400ms), it's a tap
    if (deltaX < 25 && deltaY < 25 && deltaTime < 400) {
      e.stopPropagation();
      e.preventDefault();
      setImagePreview({ url: tapStartRef.current.imageUrl, title: tapStartRef.current.title });
    }
    
    tapStartRef.current = null;
  }, []);

  const handleShareComplete = useCallback(() => {
    if (selectedAd) {
      setShareCounts(prev => ({
        ...prev,
        [selectedAd.id]: (prev[selectedAd.id] || 0) + 1
      }));
    }
    setShareDialog(false);
  }, [selectedAd]);
  
  return (
    <div className="relative bg-secondary text-secondary-foreground flex justify-center z-0">
      <Carousel 
        className="w-full max-w-7xl mx-auto py-8" 
        opts={{ loop: true, align: "center" }}
        setApi={setApi}
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {optimizedAds.map((ad, index) => (
            <CarouselItem key={ad.id} className="pl-2 md:pl-4 basis-[80%] md:basis-[85%]">
              <div 
                className={`flex flex-col md:flex-row items-center gap-8 px-4 transform-gpu ${
                  isReady ? 'transition-transform duration-200' : ''
                } ${index === currentSlide ? 'scale-100' : isReady ? 'scale-[0.97]' : 'scale-100'}`}
                style={{ contain: 'layout' }}
              >
                {/* Image / CTA panel */}
                <div className="w-full md:w-1/2 relative group">
                  {ad.isAdvertiseCTA ? (
                    /* "Advertise Here" — real sample photo with overlay banner */
                    <div className="relative overflow-hidden rounded-2xl shadow-2xl shadow-primary/40 group">
                      {/* "Sample Ad" ribbon */}
                      <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold tracking-wide shadow-lg">
                        <Sparkles size={11} />
                        Sample Ad
                      </div>
                      {/* "Advertise Here" bottom banner */}
                      <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/80 to-transparent px-4 py-4 flex items-end justify-between">
                        <span className="text-white font-bold text-lg leading-tight">Could be your brand<br/><span className="text-primary font-extrabold">Advertise Here →</span></span>
                      </div>
                      <img
                        src={ad.imageUrl}
                        alt="Sample advertisement — Advertise Here"
                        className="rounded-2xl w-full h-64 md:h-80 lg:h-96 object-cover transform-gpu transition-transform duration-300 group-hover:scale-105 select-none"
                        loading="lazy"
                        decoding="async"
                        draggable={false}
                      />
                    </div>
                  ) : loadedImages.has(index) ? (
                    <div className="relative overflow-hidden rounded-2xl group">
                      {/* Sponsored badge */}
                      <div className="absolute bottom-3 right-3 z-20 flex items-center gap-1 bg-black/30 backdrop-blur-sm px-2 py-1 rounded-md border border-white/10 pointer-events-none">
                        <Sparkles size={10} className="text-white/70" />
                        <span className="text-[9px] font-medium text-white/70 uppercase tracking-wide">Sponsored</span>
                      </div>
                      
                      {/* Invisible tap overlay to open zoom */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          setImagePreview({ url: ad.imageUrl, title: ad.title });
                        }}
                        className="absolute inset-0 z-30 bg-transparent cursor-zoom-in"
                        aria-label={`View ${ad.title} full size`}
                      />

                      <img 
                        src={ad.imageUrl} 
                        alt={ad.title}
                        className="rounded-2xl w-full h-64 md:h-80 lg:h-96 object-cover transform-gpu transition-transform duration-300 group-hover:scale-105 shadow-2xl shadow-primary/30 select-none"
                        loading={index === 0 ? "eager" : "lazy"}
                        decoding="async"
                        fetchPriority={index === 0 ? "high" : "auto"}
                        draggable={false}
                      />
                    </div>
                  ) : (
                    <div className="rounded-2xl w-full h-64 md:h-80 lg:h-96 bg-gradient-to-br from-muted/50 to-muted animate-pulse flex items-center justify-center shadow-2xl">
                      <span className="text-muted-foreground text-sm">Loading...</span>
                    </div>
                  )}
                </div>

                {/* Text panel */}
                <div className="w-full md:w-1/2">
                  <h3 className="text-2xl md:text-3xl font-bold mb-4">{ad.title}</h3>
                  <p className="text-lg mb-6 leading-relaxed">{ad.description}</p>
                  <div className="flex flex-wrap gap-3 items-center">
                    {ad.isAdvertiseCTA ? (
                      <a
                        href="mailto:advertise@beeapp.com"
                        className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold text-lg hover:bg-primary/90 active:scale-95 transition-all cursor-pointer shadow-md touch-manipulation min-h-[44px]"
                      >
                        <Sparkles size={18} className="pointer-events-none" />
                        Contact Us
                      </a>
                    ) : (
                      <>
                        <button 
                          onClick={() => handleGetMoreInfo(ad.id, ad.linkUrl)}
                          className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold text-lg hover:bg-primary/90 active:scale-95 transition-all cursor-pointer shadow-md touch-manipulation min-h-[44px]"
                        >
                          Get More Info
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            console.log('Share button clicked for ad:', ad.id);
                            handleShare(ad);
                          }}
                          className="relative z-50 inline-flex items-center justify-center text-white hover:bg-white/10 border border-white/20 hover:border-white/40 backdrop-blur-sm min-h-[44px] gap-2 px-5 transition-all active:scale-95 font-medium rounded-md"
                          style={{ touchAction: 'manipulation', pointerEvents: 'auto' }}
                        >
                          <Share2 size={18} className="pointer-events-none" />
                          <span className="pointer-events-none">Share</span>
                          {shareCounts[ad.id] > 0 && (
                            <span className="ml-0.5 text-sm opacity-80 pointer-events-none">· {shareCounts[ad.id]}</span>
                          )}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 border-white/30 z-20" />
        <CarouselNext className="right-2 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 border-white/30 z-20" />
        
        {/* Swipe indicator - Mobile hint */}
        <div className="md:hidden flex items-center justify-center mt-6 gap-2 animate-pulse">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white/60">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-white/60 text-sm font-medium">Swipe to explore ads</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white/60">
            <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        
        {/* Slide indicators */}
        <div className="flex justify-center mt-4 space-x-2">
          {optimizedAds.map((_, index) => (
            <button
              key={index}
              className={`h-2 rounded-full transition-all duration-300 active:scale-90 touch-manipulation ${
                index === currentSlide ? 'bg-white w-8' : 'bg-white/40 w-2 hover:bg-white/60'
              }`}
              onClick={() => handleSlideChange(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </Carousel>

      {/* Share Dialog */}
      {selectedAd && (
        <ShareDialog
          open={shareDialog}
          onOpenChange={setShareDialog}
          postId={selectedAd.id}
          postContent={`${selectedAd.title} - ${selectedAd.description}`}
          onShareComplete={handleShareComplete}
        />
      )}

      {/* Full Image Preview Dialog */}
      <Dialog open={!!imagePreview} onOpenChange={() => setImagePreview(null)}>
        <DialogContent className="!fixed !inset-0 !left-0 !top-0 !translate-x-0 !translate-y-0 !max-w-none !w-screen !h-screen !p-0 !border-none !bg-black/95 !rounded-none flex items-center justify-center">
          <VisuallyHidden.Root>
            <DialogTitle>{imagePreview?.title || "Image Preview"}</DialogTitle>
          </VisuallyHidden.Root>
          {imagePreview && (
            <ZoomableImage
              src={imagePreview.url}
              alt={imagePreview.title}
              onClose={() => setImagePreview(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
});

AdSplash.displayName = 'AdSplash';

export default AdSplash;
