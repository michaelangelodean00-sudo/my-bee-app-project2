
import React, { useEffect, useState, useRef } from 'react';
import { Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import VideoPlayerWithAds from "../components/VideoPlayerWithAds";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import PageTransition from "../components/PageTransition";
import MobileBottomNav from "../components/MobileBottomNav";
import { useNotifications } from "../contexts/NotificationContext";
import { useContentFilter } from "../contexts/ContentFilterContext";
import { useAdAnalytics } from "../hooks/useAdAnalytics";
import { VideoAd, SponsoredContent } from "@/types/ads";

interface EventVideo {
  id: string;
  platform: string;
  videoUrl: string;
  title: string;
  description: string;
}

interface EventVideoWithAd extends VideoAd {
  isAd: true;
}

type FeedItem = EventVideo | EventVideoWithAd;

const Events = () => {
  const { markEventsVideosAsViewed } = useNotifications();
  const { trackImpression, trackClick } = useAdAnalytics();
  const { isEventVideoBlocked } = useContentFilter();
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const autoScrollInterval = useRef<NodeJS.Timeout | null>(null);

  // Mark events videos as viewed when the component mounts
  useEffect(() => {
    markEventsVideosAsViewed();
  }, [markEventsVideosAsViewed]);

  // Mock ads data
  const eventAds: VideoAd[] = [
    {
      id: "event-ad-1",
      title: "Nassau Music Festival 2024",
      description: "Join us for the biggest music event of the year with local and international artists",
      videoUrl: "https://youtube.com/watch?v=music-festival",
      advertiser: "Nassau Entertainment",
      category: "events",
      targetSection: "events",
      duration: 30,
      clickUrl: "https://nassaumusicfest.com",
      impressions: 0,
      clicks: 0,
      isActive: true,
      createdAt: "2024-01-15T10:00:00Z"
    }
  ];

  // Mock sponsored content
  const sponsoredContent: SponsoredContent[] = [
    {
      videoId: "2",
      advertiser: "Paradise Resort",
      sponsorshipType: "featured",
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      isActive: true
    }
  ];

  // Sample Bahamas event videos
  const eventVideos: EventVideo[] = [
    {
      id: "1",
      platform: "youtube",
      videoUrl: "https://youtube.com/watch?v=example1",
      title: "Bahamas Junkanoo Festival 2024",
      description: "Experience the vibrant colors, music, and energy of Nassau's most spectacular cultural celebration with traditional costumes and rhythms"
    },
    {
      id: "2",
      platform: "instagram",
      videoUrl: "https://instagram.com/reel/example2",
      title: "Paradise Island Beach Festival",
      description: "Join the ultimate beach party featuring local DJs, conch fritters, and the most beautiful sunset views in the Caribbean"
    },
    {
      id: "3",
      platform: "tiktok",
      videoUrl: "https://tiktok.com/@example3",
      title: "Conch Bar Crawl Adventures",
      description: "Explore Nassau's best conch spots and learn traditional Bahamian recipes from local chefs in this food adventure"
    },
    {
      id: "4",
      platform: "facebook",
      videoUrl: "https://facebook.com/video/example4",
      title: "Atlantis Resort Concert Series",
      description: "Behind the scenes at the exclusive resort concert featuring Caribbean artists and international stars"
    },
    {
      id: "5",
      platform: "youtube",
      videoUrl: "https://youtube.com/watch?v=example5",
      title: "Cable Beach Regatta 2024",
      description: "Witness the excitement of traditional Bahamian sailing with colorful boats racing across turquoise waters"
    },
    {
      id: "6",
      platform: "instagram",
      videoUrl: "https://instagram.com/reel/example6",
      title: "Goombay Summer Festival",
      description: "Dance to authentic Goombay rhythms and taste traditional Bahamian cuisine at this annual cultural celebration"
    },
    {
      id: "7",
      platform: "tiktok",
      videoUrl: "https://tiktok.com/@example7",
      title: "Exuma Swimming Pigs Experience",
      description: "Take a boat trip to see the famous swimming pigs of Exuma and enjoy this unique Bahamian adventure"
    },
    {
      id: "8",
      platform: "facebook",
      videoUrl: "https://facebook.com/video/example8",
      title: "Freeport Jazz Festival Highlights",
      description: "Smooth jazz meets island vibes at Grand Bahama's premier music festival featuring local and international artists"
    }
  ];

  // Filter out blocked videos
  const filteredEventVideos = eventVideos.filter(video => !isEventVideoBlocked(video.id));
  
  // Combine filtered videos with ads
  const videosWithAds: FeedItem[] = [...filteredEventVideos];
  
  // Insert ads after every 2 videos
  eventAds.forEach((ad, index) => {
    const insertIndex = (index + 1) * 2; // Insert after every 2 videos
    const adWithFlag: EventVideoWithAd = { ...ad, isAd: true };
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

  // Track scroll to detect visible video
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const videoHeight = window.innerHeight;
      const newIndex = Math.round(scrollTop / videoHeight);
      if (newIndex !== currentVideoIndex && newIndex >= 0 && newIndex < videosWithAds.length) {
        setCurrentVideoIndex(newIndex);
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => {
      container.removeEventListener('scroll', handleScroll);
      if (autoScrollInterval.current) {
        clearInterval(autoScrollInterval.current);
      }
    };
  }, [currentVideoIndex, videosWithAds.length]);

  const isAd = (item: FeedItem): item is EventVideoWithAd => {
    return 'isAd' in item && item.isAd === true;
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Header toggleMobileSidebar={() => {}} />
        
        <div className="flex relative">
        {/* Desktop Sidebar - Fixed position */}
        <div className="hidden md:block md:w-64 flex-shrink-0">
          <div className="fixed top-16 left-0 w-64 h-[calc(100vh-4rem)] overflow-y-auto bg-card/80 backdrop-blur-sm border-r border-border z-20">
            <Sidebar className="h-full" />
          </div>
        </div>
        
        {/* Main Content - TikTok Style Feed */}
        <div className="flex-1 overflow-y-auto h-screen snap-y snap-mandatory scroll-smooth overscroll-none" ref={containerRef} style={{ scrollBehavior: 'smooth' }}>
          {/* Auto-scroll toggle button */}
          <Button
            onClick={toggleAutoScroll}
            variant="outline"
            size="icon"
            className="fixed bottom-24 right-4 z-50 h-12 w-12 rounded-full bg-background/90 backdrop-blur-sm border-2 border-primary shadow-lg touch-manipulation active:scale-95 md:bottom-8"
            aria-label={isAutoScrolling ? "Pause auto-scroll" : "Start auto-scroll"}
          >
            {isAutoScrolling ? (
              <Pause className="h-5 w-5 text-primary" />
            ) : (
              <Play className="h-5 w-5 text-primary ml-0.5" />
            )}
          </Button>
          
          {/* Vertical TikTok-style feed */}
          <div>
            {videosWithAds.map((video, index) => {
              const videoIsAd = isAd(video);
              const sponsoredData = getSponsoredData(video.id);
              
              return (
                <div key={video.id} className="h-screen snap-start snap-always will-change-scroll">
                  <VideoPlayerWithAds
                    videoId={video.id}
                    platform={videoIsAd ? 'ad' : video.platform}
                    videoUrl={video.videoUrl}
                    title={video.title}
                    description={video.description}
                    isAd={videoIsAd}
                    adData={videoIsAd ? video : undefined}
                    sponsoredData={sponsoredData}
                    contentType="event"
                    onAdImpression={trackImpression}
                    onAdClick={trackClick}
                    autoPlay={true}
                    isVisible={currentVideoIndex === index}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <MobileBottomNav />
      </div>
    </PageTransition>
  );
};

export default Events;
