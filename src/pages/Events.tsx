
import React from 'react';
import { 
  FaGuitar, 
  FaUsers, 
  FaCalendarAlt, 
  FaMapMarkerAlt 
} from 'react-icons/fa';
import VideoPlayer from "../components/VideoPlayer";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

const Events = () => {
  // Mock approved videos for events
  const eventVideos = [
    {
      id: "1",
      platform: "youtube",
      videoUrl: "https://youtube.com/watch?v=example1",
      title: "Bahamas Summer Jam Highlights",
      description: "Check out the best moments from last year's festival with amazing performances and vibes"
    },
    {
      id: "2",
      platform: "instagram",
      videoUrl: "https://instagram.com/reel/example2",
      title: "Junkanoo Behind the Scenes",
      description: "See how the amazing costumes are made and the preparation that goes into this cultural celebration"
    },
    {
      id: "3",
      platform: "tiktok",
      videoUrl: "https://tiktok.com/@example3",
      title: "Dance Workshop Preview",
      description: "Learn some moves before the big festival! Quick tutorial for everyone to enjoy"
    },
    {
      id: "4",
      platform: "facebook",
      videoUrl: "https://facebook.com/video/example4",
      title: "Local Artist Spotlight",
      description: "Meet the talented artists performing at upcoming events around Nassau"
    }
  ];

  return (
    <div className="min-h-screen bg-black">
      <Header toggleMobileSidebar={() => {}} />
      
      <div className="flex">
        <Sidebar className="hidden md:block" />
        
        {/* Main Content */}
        <div className="flex-1 py-6 px-4">
          <h1 className="text-2xl font-bold mb-6 text-white text-center">Event Videos</h1>
          
          {/* TikTok-style grid - responsive */}
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {eventVideos.map((video) => (
                <VideoPlayer
                  key={video.id}
                  platform={video.platform}
                  videoUrl={video.videoUrl}
                  title={video.title}
                  description={video.description}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Events;
