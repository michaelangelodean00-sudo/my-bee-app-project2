import { useEffect, useState, useRef } from "react";
import { Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import VideoPlayer from "../components/VideoPlayer";
import { useNotifications } from "../contexts/NotificationContext";

// Mock approved videos for businesses
const businessVideos = [
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

const Businesses = () => {
  const { markBusinessVideosAsViewed } = useNotifications();
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const autoScrollInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Mark business videos as viewed when component mounts
    markBusinessVideosAsViewed();
  }, [markBusinessVideosAsViewed]);

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
        const nextIndex = (prevIndex + 1) % businessVideos.length;
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
            <div className="px-4 pb-4">
              <p className="text-sm text-gray-300 text-center italic">
                * Videos are subject to approval by Bee App admin before posting
              </p>
            </div>
          </div>
          
          {/* Vertical TikTok-style feed */}
          <div>
            {businessVideos.map((video, index) => (
              <div key={video.id} className="h-screen snap-start">
                <VideoPlayer
                  platform={video.platform}
                  videoUrl={video.videoUrl}
                  title={video.title}
                  description={video.description}
                  isNew={video.isNew}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Businesses;
