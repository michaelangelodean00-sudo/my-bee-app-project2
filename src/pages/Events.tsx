import React, { useEffect, useState, useRef } from 'react';
import { 
  FaGuitar, 
  FaUsers, 
  FaCalendarAlt, 
  FaMapMarkerAlt 
} from 'react-icons/fa';
import { Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import VideoPlayerWithAds from "../components/VideoPlayerWithAds";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { useNotifications } from "../contexts/NotificationContext";
import { useAdAnalytics } from "../hooks/useAdAnalytics";
import { VideoAd, SponsoredContent } from "@/types/ads";

const Events = () => {
  const { markEventsVideosAsViewed } = useNotifications();
  const { trackImpression, trackClick } = useAdAnalytics();
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
  const eventVideos = [
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
    // Insert ad after every 2 videos
    ...eventAds.map(ad => ({ ...ad, isAd: true })),
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
        const nextIndex = (prevIndex + 1) % eventVideos.length;
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

  return (
    <div className="min-h-screen bg-black">
      <Header toggleMobileSidebar={() => {}} />
      
      <div className="flex">
        <Sidebar className="hidden md:block" />
        
        {/* Main Content - TikTok Style Feed */}
        <div className="flex-1 overflow-y-auto h-screen snap-y snap-mandatory" ref={containerRef}>
          <div className="sticky top-0 bg-black z-10">
            <div className="flex items-center justify-between px-4 py-4">
              <h1 className="text-2xl font-bold text-white">Bahamas Event Videos</h1>
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
            <div className="px-4 pb-4">
              <p className="text-sm text-gray-300 text-center italic">
                * Videos are subject to approval by Bee App admin before posting
              </p>
            </div>
          </div>
          
          {/* Vertical TikTok-style feed */}
          <div>
            {eventVideos.map((video) => {
              const isAd = 'isAd' in video && video.isAd;
              const sponsoredData = getSponsoredData(video.id);
              
              return (
                <div key={video.id} className="h-screen snap-start">
                  <VideoPlayerWithAds
                    platform={isAd ? 'ad' : video.platform}
                    videoUrl={video.videoUrl}
                    title={video.title}
                    description={video.description}
                    isAd={isAd}
                    adData={isAd ? video as VideoAd : undefined}
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

export default Events;
