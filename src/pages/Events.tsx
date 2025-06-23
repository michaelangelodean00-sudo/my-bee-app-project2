import React, { useEffect, useState, useRef } from 'react';
import { 
  FaGuitar, 
  FaUsers, 
  FaCalendarAlt, 
  FaMapMarkerAlt 
} from 'react-icons/fa';
import { Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import VideoPlayer from "../components/VideoPlayer";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { useNotifications } from "../contexts/NotificationContext";

const Events = () => {
  const { markEventsVideosAsViewed } = useNotifications();
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const autoScrollInterval = useRef<NodeJS.Timeout | null>(null);

  // Mark events videos as viewed when the component mounts
  useEffect(() => {
    markEventsVideosAsViewed();
  }, [markEventsVideosAsViewed]);

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
            {eventVideos.map((video) => (
              <div key={video.id} className="h-screen snap-start">
                <VideoPlayer
                  platform={video.platform}
                  videoUrl={video.videoUrl}
                  title={video.title}
                  description={video.description}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Events;
