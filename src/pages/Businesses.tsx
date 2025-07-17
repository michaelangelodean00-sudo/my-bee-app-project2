
import { useEffect, useState, useRef } from "react";
import { Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import VideoPlayerWithAds from "../components/VideoPlayerWithAds";
import { useNotifications } from "../contexts/NotificationContext";
import { useAdAnalytics } from "../hooks/useAdAnalytics";
import { VideoAd, SponsoredContent } from "@/types/ads";

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

// Mock approved videos for businesses
const businessVideos: BusinessVideo[] = [
  {
    id: "1",
    platform: "instagram",
    videoUrl: "https://instagram.com/reel/example1",
    title: "Ocean View Restaurant Tour",
    description: "Take a virtual tour of our beautiful oceanfront dining experience with stunning sunset views",
    isNew: true
  },
  {
    id: "2",
    platform: "youtube",
    videoUrl: "https://youtube.com/watch?v=example2",
    title: "Island Tours Adventure",
    description: "See what makes our tours special and unforgettable. Join us for the adventure of a lifetime!",
    isNew: false
  },
  {
    id: "3",
    platform: "tiktok",
    videoUrl: "https://tiktok.com/@example",
    title: "Spa Relaxation Tips",
    description: "Quick relaxation techniques you can try at home for instant stress relief",
    isNew: true
  },
  {
    id: "4",
    platform: "facebook",
    videoUrl: "https://facebook.com/video/example",
    title: "Local Craft Brewery",
    description: "Behind the scenes at Nassau's finest craft brewery. Fresh beer, great vibes!",
    isNew: false
  },
  {
    id: "5",
    platform: "youtube",
    videoUrl: "https://youtube.com/watch?v=example5",
    title: "Conch Shell Art Workshop",
    description: "Learn how local artisans create beautiful decorations from conch shells found on Bahamian beaches",
    isNew: true
  },
  {
    id: "6",
    platform: "instagram",
    videoUrl: "https://instagram.com/reel/example6",
    title: "Nassau Fish Market Tour",
    description: "Experience the vibrant fish market and see the fresh catch that makes Bahamian cuisine so special",
    isNew: false
  }
];

// Mock business ads
const businessAds: VideoAd[] = [
  {
    id: "business-ad-1",
    title: "Best Restaurant in Nassau",
    description: "Try our award-winning conch fritters and fresh seafood daily",
    videoUrl: "https://youtube.com/watch?v=restaurant-ad",
    advertiser: "Conch Palace Restaurant",
    category: "business",
    targetSection: "businesses",
    duration: 30,
    clickUrl: "https://conchpalace.com",
    impressions: 0,
    clicks: 0,
    isActive: true,
    createdAt: "2024-01-15T10:00:00Z"
  }
];

// Mock sponsored content
const sponsoredContent: SponsoredContent[] = [
  {
    videoId: "1",
    advertiser: "Nassau Tourism Board",
    sponsorshipType: "promoted",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    isActive: true
  }
];

const Businesses = () => {
  const { markBusinessVideosAsViewed } = useNotifications();
  const { trackImpression, trackClick } = useAdAnalytics();
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const autoScrollInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Mark business videos as viewed when component mounts
    markBusinessVideosAsViewed();
  }, [markBusinessVideosAsViewed]);

  // Combine regular videos with ads (insert ads every 3 videos)
  const videosWithAds: FeedItem[] = [...businessVideos];
  businessAds.forEach((ad, index) => {
    const insertIndex = (index + 1) * 3; // Insert after every 3 videos
    const adWithFlag: VideoWithAd = { ...ad, isAd: true };
    if (insertIndex < videosWithAds.length) {
      videosWithAds.splice(insertIndex, 0, adWithFlag);
    } else {
      videosWithAds.push(adWithFlag);
    }
  });

  const getSponsoredData = (videoId: string) => {
    return sponsoredContent.find(s => s.videoId === videoId && s.isActive);
  };

  const scrollToVideo = (index: number) => {
    if (containerRef.current) {
      const videoElement = containerRef.current.children[index + 1] as HTMLElement; // +1 to account for header
      if (videoElement) {
        videoElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setCurrentVideoIndex(index);
      }
    }
  };

  const startAutoScroll = () => {
    setIsAutoScrolling(true);
    autoScrollInterval.current = setInterval(() => {
      setCurrentVideoIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % videosWithAds.length;
        scrollToVideo(nextIndex);
        return nextIndex;
      });
    }, 8000); // 8 seconds per video
  };

  const stopAutoScroll = () => {
    setIsAutoScrolling(false);
    if (autoScrollInterval.current) {
      clearInterval(autoScrollInterval.current);
      autoScrollInterval.current = null;
    }
  };

  const toggleAutoScroll = () => {
    if (isAutoScrolling) {
      stopAutoScroll();
    } else {
      startAutoScroll();
    }
  };

  useEffect(() => {
    return () => {
      if (autoScrollInterval.current) {
        clearInterval(autoScrollInterval.current);
      }
    };
  }, []);

  const isAd = (item: FeedItem): item is VideoWithAd => {
    return 'isAd' in item && item.isAd === true;
  };

  return (
    <div className="min-h-screen bg-black">
      <Header toggleMobileSidebar={() => {}} />
      
      <div className="flex">
        <Sidebar className="hidden md:block" />
        
        {/* Main Content - TikTok Style Feed */}
        <div className="flex-1 overflow-y-auto h-screen snap-y snap-mandatory" ref={containerRef}>
          <div className="sticky top-0 bg-black z-10">
            <div className="flex items-center justify-between px-4 py-4">
              <h1 className="text-2xl font-bold text-white">Business Videos</h1>
              <Button
                onClick={toggleAutoScroll}
                variant="outline"
                size="sm"
                className="bg-black text-white border-gray-600 hover:bg-gray-800"
              >
                {isAutoScrolling ? (
                  <>
                    <Pause size={16} className="mr-2" />
                    Stop Auto
                  </>
                ) : (
                  <>
                    <Play size={16} className="mr-2" />
                    Auto Scroll
                  </>
                )}
              </Button>
            </div>
            {/* Platform badge below header, left-aligned */}
            <div className="px-4 pb-2 flex gap-2">
              <span className={`font-semibold px-3 py-1 rounded ${(() => {
                const currentVideo = videosWithAds[currentVideoIndex];
                if (!currentVideo) return 'bg-gray-600 text-white';
                
                const currentIsAd = isAd(currentVideo);
                const platform = currentIsAd ? 'ad' : currentVideo.platform;
                
                switch (platform) {
                  case 'youtube': return 'bg-red-500 text-white';
                  case 'instagram': return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white';
                  case 'tiktok': return 'bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 text-white';
                  case 'facebook': return 'bg-blue-600 text-white';
                  case 'ad': return 'bg-green-500 text-white';
                  default: return 'bg-gray-600 text-white';
                }
              })()}`}>
                {(() => {
                  const currentVideo = videosWithAds[currentVideoIndex];
                  if (!currentVideo) return 'UNKNOWN';
                  const currentIsAd = isAd(currentVideo);
                  return currentIsAd ? 'AD' : currentVideo.platform.toUpperCase();
                })()}
              </span>
              {videosWithAds[currentVideoIndex] && !isAd(videosWithAds[currentVideoIndex]) && (videosWithAds[currentVideoIndex] as BusinessVideo).isNew && (
                <span className="bg-green-500 text-white font-semibold px-3 py-1 rounded animate-pulse">NEW</span>
              )}
            </div>
            <div className="px-4 pb-4">
              <p className="text-sm text-gray-300 text-center italic">
                * Videos are subject to approval by Bee App admin before posting
              </p>
            </div>
          </div>
          {/* Vertical TikTok-style feed */}
          <div>
            {videosWithAds.map((video, index) => {
              const videoIsAd = isAd(video);
              const sponsoredData = getSponsoredData(video.id);
              
              return (
                <div key={video.id} className="h-screen snap-start">
                  <VideoPlayerWithAds
                    videoUrl={video.videoUrl}
                    title={video.title}
                    description={video.description}
                    isNew={!videoIsAd ? video.isNew : false}
                    platform={videoIsAd ? 'ad' : video.platform}
                    isAd={videoIsAd}
                    adData={videoIsAd ? video : undefined}
                    sponsoredData={sponsoredData}
                    onAdImpression={trackImpression}
                    onAdClick={trackClick}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Businesses;
