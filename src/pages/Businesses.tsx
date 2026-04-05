import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Play, Pause, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import VideoPlayerWithAds from "../components/VideoPlayerWithAds";
import PageTransition from "../components/PageTransition";
import MobileBottomNav from "../components/MobileBottomNav";
import BusinessProfileCard from "../components/BusinessProfileCard";
import { useNotifications } from "../contexts/NotificationContext";
import { useContentFilter } from "../contexts/ContentFilterContext";
import { useAdAnalytics } from "../hooks/useAdAnalytics";
import { VideoAd, SponsoredContent } from "@/types/ads";
import { mockBusinessProfiles } from "@/data/businessProfiles";
import { useNavigate } from "react-router-dom";
import {
  UtensilsCrossed, Sparkles, ShoppingBag, Wrench,
  Car, CalendarDays, BriefcaseBusiness
} from "lucide-react";

const CATEGORIES = [
  { id: "food-dining",           label: "Food & Dining",         icon: UtensilsCrossed },
  { id: "beauty-wellness",       label: "Beauty & Wellness",     icon: Sparkles },
  { id: "retail-shopping",       label: "Retail & Shopping",     icon: ShoppingBag },
  { id: "home-trade-services",   label: "Home & Trade Services", icon: Wrench },
  { id: "auto-transport",        label: "Auto & Transport",      icon: Car },
  { id: "events",                label: "Events",                icon: CalendarDays },
  { id: "professional-services", label: "Professional Services", icon: BriefcaseBusiness },
] as const;

interface BusinessVideo {
  id: string;
  platform: string;
  videoUrl: string;
  title: string;
  description: string;
  isNew: boolean;
}

interface VideoWithAd extends VideoAd {
  isAd: true;
}

type FeedItem = BusinessVideo | VideoWithAd;

const businessVideos: BusinessVideo[] = [
  { id: "1", platform: "instagram", videoUrl: "https://instagram.com/reel/example1", title: "Ocean View Restaurant Tour", description: "Take a virtual tour of our beautiful oceanfront dining experience with stunning sunset views", isNew: true },
  { id: "2", platform: "youtube",   videoUrl: "https://youtube.com/watch?v=example2", title: "Island Tours Adventure",    description: "See what makes our tours special and unforgettable. Join us for the adventure of a lifetime!", isNew: false },
  { id: "3", platform: "tiktok",    videoUrl: "https://tiktok.com/@example",          title: "Spa Relaxation Tips",      description: "Quick relaxation techniques you can try at home for instant stress relief", isNew: true },
  { id: "4", platform: "facebook",  videoUrl: "https://facebook.com/video/example",   title: "Local Craft Brewery",      description: "Behind the scenes at Nassau's finest craft brewery. Fresh beer, great vibes!", isNew: false },
  { id: "5", platform: "youtube",   videoUrl: "https://youtube.com/watch?v=example5", title: "Conch Shell Art Workshop", description: "Learn how local artisans create beautiful decorations from conch shells found on Bahamian beaches", isNew: true },
  { id: "6", platform: "instagram", videoUrl: "https://instagram.com/reel/example6", title: "Nassau Fish Market Tour",  description: "Experience the vibrant fish market and see the fresh catch that makes Bahamian cuisine so special", isNew: false },
];

const businessAds: VideoAd[] = [
  { id: "business-ad-1", title: "Best Restaurant in Nassau", description: "Try our award-winning conch fritters and fresh seafood daily", videoUrl: "https://youtube.com/watch?v=restaurant-ad", advertiser: "Conch Palace Restaurant", category: "business", targetSection: "businesses", duration: 30, clickUrl: "https://conchpalace.com", impressions: 0, clicks: 0, isActive: true, createdAt: "2024-01-15T10:00:00Z" },
];

const sponsoredContent: SponsoredContent[] = [
  { videoId: "1", advertiser: "Nassau Tourism Board", sponsorshipType: "promoted", startDate: "2024-01-01", endDate: "2024-12-31", isActive: true },
];

// ─── Category Profile View ──────────────────────────────────────────────────
const CategoryProfileView = ({ categoryId }: { categoryId: string }) => {
  const navigate = useNavigate();
  const category = CATEGORIES.find(c => c.id === categoryId);
  const profiles = mockBusinessProfiles.filter(b => b.category === categoryId);
  const Icon = category?.icon;

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Category Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border px-4 py-3 flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full"
          onClick={() => navigate("/businesses")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        {Icon && <Icon className="h-5 w-5 text-primary" />}
        <h2 className="font-semibold text-foreground">{category?.label ?? "Businesses"}</h2>
        <span className="text-xs text-muted-foreground ml-auto">{profiles.length} listings</span>
      </div>

      {/* Profile Grid */}
      <div className="p-4 max-w-4xl mx-auto">
        {profiles.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-sm">No businesses listed in this category yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {profiles.map(business => (
              <BusinessProfileCard key={business.id} business={business} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── TikTok-style Video Feed ────────────────────────────────────────────────
const VideoFeed = () => {
  const { trackImpression, trackClick } = useAdAnalytics();
  const { isBusinessVideoBlocked } = useContentFilter();
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const autoScrollInterval = useRef<ReturnType<typeof setTimeout> | null>(null);

  const filteredVideos = businessVideos.filter(v => !isBusinessVideoBlocked(v.id));

  const videosWithAds: FeedItem[] = [...filteredVideos];
  businessAds.forEach((ad, index) => {
    const insertIndex = (index + 1) * 3;
    const adWithFlag: VideoWithAd = { ...ad, isAd: true };
    if (insertIndex < videosWithAds.length) {
      videosWithAds.splice(insertIndex, 0, adWithFlag);
    } else {
      videosWithAds.push(adWithFlag);
    }
  });

  const getSponsoredData = (videoId: string) =>
    sponsoredContent.find(s => s.videoId === videoId && s.isActive);

  const scrollToVideo = (index: number) => {
    if (containerRef.current) {
      const el = containerRef.current.children[index] as HTMLElement;
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
      setCurrentVideoIndex(index);
    }
  };

  const startAutoScroll = () => {
    setIsAutoScrolling(true);
    autoScrollInterval.current = setInterval(() => {
      setCurrentVideoIndex(prev => {
        const next = (prev + 1) % videosWithAds.length;
        scrollToVideo(next);
        return next;
      });
    }, 8000);
  };

  const stopAutoScroll = () => {
    setIsAutoScrolling(false);
    if (autoScrollInterval.current) {
      clearInterval(autoScrollInterval.current);
      autoScrollInterval.current = null;
    }
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handleScroll = () => {
      const newIndex = Math.round(el.scrollTop / window.innerHeight);
      if (newIndex !== currentVideoIndex && newIndex >= 0 && newIndex < videosWithAds.length) {
        setCurrentVideoIndex(newIndex);
      }
    };
    el.addEventListener("scroll", handleScroll);
    return () => {
      el.removeEventListener("scroll", handleScroll);
      if (autoScrollInterval.current) clearInterval(autoScrollInterval.current);
    };
  }, [currentVideoIndex, videosWithAds.length]);

  const isAdItem = (item: FeedItem): item is VideoWithAd =>
    "isAd" in item && item.isAd === true;

  return (
    <div className="flex-1 overflow-y-auto h-screen snap-y snap-mandatory scroll-smooth overscroll-none relative" ref={containerRef}>
      <Button
        onClick={isAutoScrolling ? stopAutoScroll : startAutoScroll}
        className="fixed top-1/2 right-4 z-50 h-12 px-4 rounded-full shadow-lg touch-manipulation active:scale-95 flex items-center gap-2 font-medium bg-black/60 text-white hover:bg-black/80 backdrop-blur-sm border border-white/20"
        aria-label={isAutoScrolling ? "Pause auto-scroll" : "Start auto-scroll"}
      >
        {isAutoScrolling ? <><Pause className="h-5 w-5" /><span className="text-sm">Auto</span></> : <><Play className="h-5 w-5" /><span className="text-sm">Auto</span></>}
      </Button>

      {videosWithAds.map((video, index) => {
        const videoIsAd = isAdItem(video);
        return (
          <div key={video.id} className="h-screen snap-start snap-always will-change-scroll">
            <VideoPlayerWithAds
              videoId={video.id}
              videoUrl={video.videoUrl}
              title={video.title}
              description={video.description}
              isNew={!videoIsAd ? video.isNew : false}
              platform={videoIsAd ? "ad" : video.platform}
              isAd={videoIsAd}
              adData={videoIsAd ? video : undefined}
              sponsoredData={getSponsoredData(video.id)}
              contentType="business"
              onAdImpression={trackImpression}
              onAdClick={trackClick}
              autoPlay={true}
              isVisible={currentVideoIndex === index}
              showMetrics={false}
            />
          </div>
        );
      })}
    </div>
  );
};

// ─── Main Page ───────────────────────────────────────────────────────────────
const Businesses = () => {
  const { markBusinessVideosAsViewed } = useNotifications();
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");

  useEffect(() => {
    markBusinessVideosAsViewed();
  }, [markBusinessVideosAsViewed]);

  return (
    <PageTransition>
      <div className="min-h-screen bg-background flex flex-col">
        <Header toggleMobileSidebar={() => {}} />

        <div className="flex flex-1 relative overflow-hidden">
          {/* Desktop Sidebar */}
          <div className="hidden md:block md:w-64 flex-shrink-0">
            <div className="fixed top-16 left-0 w-64 h-[calc(100vh-4rem)] overflow-y-auto bg-card/80 backdrop-blur-sm border-r border-border z-20">
              <Sidebar className="h-full" />
            </div>
          </div>

          {/* Content area */}
          {categoryParam ? (
            <CategoryProfileView categoryId={categoryParam} />
          ) : (
            <VideoFeed />
          )}
        </div>

        <MobileBottomNav />
      </div>
    </PageTransition>
  );
};

export default Businesses;
