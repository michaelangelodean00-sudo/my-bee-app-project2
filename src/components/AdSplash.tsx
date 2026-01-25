import { useState, useEffect, useRef, useCallback } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import bambooAd from "../images/bamboo-ad.jpeg";
import { optimizeAds, preloadImage } from "@/utils/adUtils";
import type { Ad } from "@/utils/adUtils";
import { useAdAnalytics } from "@/hooks/useAdAnalytics";
import ShareDialog from "./ShareDialog";
import { Share2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogClose,
} from "@/components/ui/dialog";


// Expanded ads array with more examples
const ads: Ad[] = [
  {
    id: "ad1",
    title: "Summer Festival Weekend",
    description: "Join us for the biggest summer celebration with live music, food, and activities for the whole family.",
    imageUrl: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1920&h=1080&q=90&fm=webp&fit=crop",
    linkUrl: "https://www.facebook.com/summerfestival"
  },
  {
    id: "ad2",
    title: "Local Business Spotlight",
    description: "Discover the best local businesses and exclusive deals just for B.E.E App members.",
    imageUrl: "https://images.unsplash.com/photo-1525328437458-0c4d4db7cab4?w=1920&h=1080&q=90&fm=webp&fit=crop",
    linkUrl: "https://www.instagram.com/localbusiness"
  },
  {
    id: "ad3",
    title: "Island Tour Specials",
    description: "Explore the beauty of our islands with special discounts on tours and excursions.",
    imageUrl: "https://images.unsplash.com/photo-1548574505-5e239809ee19?w=1920&h=1080&q=90&fm=webp&fit=crop",
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
    imageUrl: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=1920&h=1080&q=90&fm=webp&fit=crop",
    linkUrl: "https://www.adventuresports.com"
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
    id: "ad9",
    title: "Oceanfront Restaurant",
    description: "Experience fine dining with breathtaking ocean views. Fresh seafood and local cuisine daily.",
    imageUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&h=1080&q=90&fm=webp&fit=crop",
    linkUrl: "https://www.oceanfrontdining.com"
  }
];

const AdSplash = () => {
  // Automatically optimize all ad images on load
  const optimizedAds = optimizeAds(ads, 'splash');
  
  const [autoplay, setAutoplay] = useState(false); // Start with autoplay off
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loadedImages, setLoadedImages] = useState(new Set([0])); // Start with first image loaded
  const [api, setApi] = useState<CarouselApi>();
  const [isReady, setIsReady] = useState(false);
  const [shareDialog, setShareDialog] = useState(false);
  const [selectedAd, setSelectedAd] = useState<Ad | null>(null);
  const [shareCounts, setShareCounts] = useState<Record<string, number>>({});
  const [magnifyAd, setMagnifyAd] = useState<Ad | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isGesturing, setIsGesturing] = useState(false);
  const lastTouchDistance = useRef<number | null>(null);
  const lastTouchCenter = useRef<{ x: number; y: number } | null>(null);
  const lastSingleTouch = useRef<{ x: number; y: number } | null>(null);
  const velocity = useRef({ x: 0, y: 0 });
  const animationFrame = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const initialZoomRef = useRef(1);

  // Calculate distance between two touch points
  const getTouchDistance = useCallback((touches: React.TouchList) => {
    if (touches.length < 2) return null;
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }, []);

  // Calculate center point between two touches
  const getTouchCenter = useCallback((touches: React.TouchList) => {
    if (touches.length < 2) return null;
    return {
      x: (touches[0].clientX + touches[1].clientX) / 2,
      y: (touches[0].clientY + touches[1].clientY) / 2
    };
  }, []);

  // Smooth momentum animation for panning
  const applyMomentum = useCallback(() => {
    const friction = 0.92;
    const minVelocity = 0.5;
    
    if (Math.abs(velocity.current.x) < minVelocity && Math.abs(velocity.current.y) < minVelocity) {
      velocity.current = { x: 0, y: 0 };
      return;
    }
    
    velocity.current.x *= friction;
    velocity.current.y *= friction;
    
    setPosition(prev => ({
      x: prev.x + velocity.current.x,
      y: prev.y + velocity.current.y
    }));
    
    animationFrame.current = requestAnimationFrame(applyMomentum);
  }, []);

  // Handle touch start for pinch-to-zoom and pan
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    // Cancel any ongoing momentum animation
    if (animationFrame.current) {
      cancelAnimationFrame(animationFrame.current);
      animationFrame.current = null;
    }
    velocity.current = { x: 0, y: 0 };
    
    if (e.touches.length === 2) {
      e.preventDefault();
      setIsGesturing(true);
      lastTouchDistance.current = getTouchDistance(e.touches);
      lastTouchCenter.current = getTouchCenter(e.touches);
      initialZoomRef.current = zoomLevel;
    } else if (e.touches.length === 1 && zoomLevel > 1) {
      // Single finger pan when zoomed in
      lastSingleTouch.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      };
      setIsGesturing(true);
    }
  }, [getTouchDistance, getTouchCenter, zoomLevel]);

  // Handle touch move for pinch-to-zoom and pan
  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2 && lastTouchDistance.current !== null) {
      e.preventDefault();
      const newDistance = getTouchDistance(e.touches);
      const newCenter = getTouchCenter(e.touches);
      
      if (newDistance && newCenter) {
        // Smoother zoom scaling with dampening
        const rawScale = newDistance / lastTouchDistance.current;
        const dampedScale = 1 + (rawScale - 1) * 0.6; // Dampen the scale change for smoother feel
        const newZoom = Math.min(Math.max(zoomLevel * dampedScale, 1), 4);
        
        // Calculate pan offset with smoother transitions
        if (lastTouchCenter.current) {
          const deltaX = (newCenter.x - lastTouchCenter.current.x) * 1.2;
          const deltaY = (newCenter.y - lastTouchCenter.current.y) * 1.2;
          
          velocity.current = { x: deltaX, y: deltaY };
          
          setPosition(prev => ({
            x: prev.x + deltaX,
            y: prev.y + deltaY
          }));
        }
        
        setZoomLevel(newZoom);
        lastTouchDistance.current = newDistance;
        lastTouchCenter.current = newCenter;
      }
    } else if (e.touches.length === 1 && lastSingleTouch.current && zoomLevel > 1) {
      // Single finger pan when zoomed
      e.preventDefault();
      const touch = e.touches[0];
      const deltaX = (touch.clientX - lastSingleTouch.current.x) * 1.5;
      const deltaY = (touch.clientY - lastSingleTouch.current.y) * 1.5;
      
      velocity.current = { x: deltaX * 0.8, y: deltaY * 0.8 };
      
      setPosition(prev => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }));
      
      lastSingleTouch.current = {
        x: touch.clientX,
        y: touch.clientY
      };
    }
  }, [zoomLevel, getTouchDistance, getTouchCenter]);

  // Handle touch end with auto-reset
  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    // Cancel any ongoing momentum animation
    if (animationFrame.current) {
      cancelAnimationFrame(animationFrame.current);
      animationFrame.current = null;
    }
    
    // Reset refs based on remaining touches
    if (e.touches.length < 2) {
      lastTouchDistance.current = null;
      lastTouchCenter.current = null;
    }
    if (e.touches.length < 1) {
      lastSingleTouch.current = null;
      setIsGesturing(false);
      
      // Auto-reset zoom after a brief moment
      setTimeout(() => {
        setZoomLevel(1);
        setPosition({ x: 0, y: 0 });
      }, 800);
    }
  }, []);

  // Cleanup animation frame on unmount
  useEffect(() => {
    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, []);

  // Reset zoom when dialog closes
  useEffect(() => {
    if (!magnifyAd) {
      setZoomLevel(1);
      setPosition({ x: 0, y: 0 });
    }
  }, [magnifyAd]);

  // Double-tap to zoom
  const lastTap = useRef<number>(0);
  const handleDoubleTap = useCallback((e: React.TouchEvent) => {
    const now = Date.now();
    if (now - lastTap.current < 300) {
      e.preventDefault();
      if (zoomLevel > 1) {
        setZoomLevel(1);
        setPosition({ x: 0, y: 0 });
      } else {
        setZoomLevel(2.5);
      }
    }
    lastTap.current = now;
  }, [zoomLevel]);
  
  // Analytics tracking
  const { trackImpression, trackClick, getAdPerformance } = useAdAnalytics();
  
  // Enable autoplay after initial load
  useEffect(() => {
    let isMounted = true;
    const warmup = async () => {
      try {
        // Preload the first ad image (and start the next) to avoid initial paint flicker
        if (optimizedAds[0]?.imageUrl) {
          await preloadImage(optimizedAds[0].imageUrl);
        }
        if (optimizedAds[1]?.imageUrl) {
          // Fire-and-forget for the next slide
          preloadImage(optimizedAds[1].imageUrl).catch(() => {});
        }
      } finally {
        if (isMounted) {
          setIsReady(true);
          setAutoplay(true);
        }
      }
    };
    const timer = window.setTimeout(warmup, 100);
    return () => {
      isMounted = false;
      window.clearTimeout(timer);
    };
  }, [optimizedAds]);
  
  useEffect(() => {
    let interval: number;
    
    if (autoplay && api && isReady) {
      interval = window.setInterval(() => {
        api.scrollNext();
      }, 5000); // Auto rotate every 5 seconds
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [autoplay, api, isReady]);

  useEffect(() => {
    if (!api) {
      return;
    }

    api.on("select", () => {
      const newSlide = api.selectedScrollSnap();
      setCurrentSlide(newSlide);
      
      // Track impression when slide changes
      if (optimizedAds[newSlide]) {
        trackImpression(optimizedAds[newSlide].id);
      }
    });
  }, [api, optimizedAds, trackImpression]);
  
  // Track initial impression - only once when component mounts
  useEffect(() => {
    if (isReady && optimizedAds[0]) {
      trackImpression(optimizedAds[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady]);

  // Lazy load images for current and next/previous slides
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

  const handleGetMoreInfo = (adId: string, linkUrl: string) => {
    // Track click before opening link
    trackClick(adId);
    
    // Log performance data for debugging
    const performance = getAdPerformance(adId, 7);
    console.log(`Ad Performance for ${adId} (last 7 days):`, performance);
    
    window.open(linkUrl, '_blank', 'noopener,noreferrer');
  };

  const handleSlideChange = (index: number) => {
    if (api) {
      api.scrollTo(index);
    }
  };

  const handleShare = (ad: Ad) => {
    setSelectedAd(ad);
    setShareDialog(true);
  };

  const handleShareComplete = () => {
    if (selectedAd) {
      setShareCounts(prev => ({
        ...prev,
        [selectedAd.id]: (prev[selectedAd.id] || 0) + 1
      }));
    }
    setShareDialog(false);
  };
  
  return (
    <div className="relative bg-bee-blue/90 text-white overflow-visible flex justify-center">
      <Carousel 
        className="w-full max-w-7xl mx-auto py-8" 
        opts={{ 
          loop: true,
          align: "center",
        }}
        setApi={setApi}
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {optimizedAds.map((ad, index) => (
            <CarouselItem key={ad.id} className="pl-2 md:pl-4 basis-[80%] md:basis-[85%]">
              <div 
                className={`flex flex-col md:flex-row items-center gap-8 px-4 will-change-transform transform-gpu ${
                  isReady ? 'transition-transform duration-500' : ''
                } ${
                  index === currentSlide 
                    ? 'scale-100' 
                    : isReady ? 'scale-95' : 'scale-100'
                }`}
              >
                <div className="w-full md:w-1/2 relative group">
                  {loadedImages.has(index) ? (
                    <div 
                      className="relative overflow-hidden rounded-2xl cursor-zoom-in"
                      onClick={() => setMagnifyAd(ad)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === 'Enter' && setMagnifyAd(ad)}
                      aria-label={`Tap to magnify ${ad.title} image`}
                    >
                      {/* Gradient overlay for depth */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      {/* Decorative border glow */}
                      <div className="absolute inset-0 rounded-2xl border-2 border-white/20 group-hover:border-white/40 transition-colors duration-300" />
                      
                      <img 
                        src={ad.imageUrl} 
                        alt={ad.title} 
                        className="rounded-2xl w-full h-64 md:h-80 lg:h-96 object-cover transform-gpu will-change-transform transition-transform duration-700 group-hover:scale-110 shadow-2xl shadow-primary/30"
                        loading={index === 0 ? "eager" : "lazy"}
                        decoding="async"
                        fetchPriority={index === 0 ? "high" : "auto"}
                      />
                      
                      
                      {/* Shine effect on hover */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                    </div>
                  ) : (
                    <div className="rounded-2xl w-full h-64 md:h-80 lg:h-96 bg-gradient-to-br from-muted/50 to-muted animate-pulse flex items-center justify-center shadow-2xl">
                      <span className="text-muted-foreground text-sm">Loading...</span>
                    </div>
                  )}
                </div>
                <div className="w-full md:w-1/2">
                  <h3 className="text-2xl md:text-3xl font-bold mb-4">{ad.title}</h3>
                  <p className="text-lg mb-6 leading-relaxed">{ad.description}</p>
                  <div className="flex flex-wrap gap-3 items-center">
                    <button 
                      onClick={() => handleGetMoreInfo(ad.id, ad.linkUrl)}
                      className="bg-bee-yellow text-bee-black px-6 py-3 rounded-lg font-semibold text-lg hover:bg-bee-yellow/90 active:scale-95 transition-all cursor-pointer shadow-md touch-manipulation min-h-[44px]"
                    >
                      Get More Info
                    </button>
                    <Button
                      variant="ghost"
                      size="lg"
                      onClick={() => handleShare(ad)}
                      className="text-white hover:bg-white/10 border border-white/20 hover:border-white/40 backdrop-blur-sm min-h-[44px] gap-2 px-5 transition-all active:scale-95 font-medium"
                    >
                      <Share2 size={18} className="transition-transform group-hover:scale-110" />
                      <span>Share</span>
                      {shareCounts[ad.id] > 0 && (
                        <span className="ml-0.5 text-sm opacity-80">· {shareCounts[ad.id]}</span>
                      )}
                    </Button>
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
                index === currentSlide 
                  ? 'bg-white w-8' 
                  : 'bg-white/40 w-2 hover:bg-white/60'
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

      {/* Magnify Dialog */}
      <Dialog open={!!magnifyAd} onOpenChange={(open) => !open && setMagnifyAd(null)}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black/95 border-none overflow-hidden">
          <DialogClose className="absolute top-4 right-4 z-50 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm p-2 transition-colors">
            <X size={24} className="text-white" />
            <span className="sr-only">Close</span>
          </DialogClose>
          
          {magnifyAd && (
            <div className="relative w-full h-[95vh] flex flex-col">
              {/* Pinch-to-zoom image container */}
              <div 
                ref={containerRef}
                className="flex-1 overflow-hidden touch-none overscroll-contain cursor-grab active:cursor-grabbing relative"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onTouchCancel={handleTouchEnd}
              >
                <div 
                  className={`w-full h-full flex items-center justify-center ${
                    isGesturing ? '' : 'transition-transform duration-200 ease-out'
                  }`}
                  style={{ 
                    transform: `scale(${zoomLevel}) translate(${position.x / zoomLevel}px, ${position.y / zoomLevel}px)`,
                    willChange: isGesturing ? 'transform' : 'auto',
                  }}
                  onTouchEnd={handleDoubleTap}
                >
                  <img 
                    src={magnifyAd.imageUrl} 
                    alt={magnifyAd.title}
                    className="max-w-[95vw] max-h-[75vh] object-contain rounded-lg animate-scale-in select-none pointer-events-none"
                    draggable={false}
                  />
                </div>
              </div>
              
              {/* Zoom level indicator */}
              {zoomLevel > 1 && (
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                  {zoomLevel.toFixed(1)}x
                </div>
              )}
              
              {/* Gesture hints */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/40 text-center pointer-events-none">
                {zoomLevel === 1 && (
                  <p className="text-xs animate-pulse">Pinch to zoom • Double-tap to zoom</p>
                )}
              </div>
              
              {/* Ad info overlay - fixed at bottom */}
              <div className="shrink-0 p-4 bg-gradient-to-t from-black via-black/80 to-transparent text-center text-white">
                <h3 className="text-lg md:text-xl font-bold mb-1">{magnifyAd.title}</h3>
                <p className="text-xs md:text-sm text-white/80 max-w-lg mx-auto line-clamp-2">{magnifyAd.description}</p>
                <div className="flex items-center justify-center gap-3 mt-3">
                  {zoomLevel > 1 && (
                    <button 
                      onClick={() => {
                        setZoomLevel(1);
                        setPosition({ x: 0, y: 0 });
                      }}
                      className="bg-white/20 text-white px-4 py-2 rounded-lg font-medium hover:bg-white/30 active:scale-95 transition-all text-sm"
                    >
                      Reset Zoom
                    </button>
                  )}
                  <button 
                    onClick={() => {
                      handleGetMoreInfo(magnifyAd.id, magnifyAd.linkUrl);
                      setMagnifyAd(null);
                    }}
                    className="bg-bee-yellow text-bee-black px-5 py-2 rounded-lg font-semibold hover:bg-bee-yellow/90 active:scale-95 transition-all text-sm"
                  >
                    Get More Info
                  </button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdSplash;
