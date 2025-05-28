import React from 'react';
import { 
  FaGuitar, 
  FaUsers, 
  FaCalendarAlt, 
  FaMapMarkerAlt 
} from 'react-icons/fa';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
          <Tabs defaultValue="popular" className="w-full max-w-6xl mx-auto">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="popular">Popular</TabsTrigger>
              <TabsTrigger value="videos">Event Videos</TabsTrigger>
            </TabsList>
            
            <TabsContent value="popular" className="space-y-4 mt-6">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="md:flex">
                  <div className="md:shrink-0">
                    <img className="h-48 w-full object-cover md:w-48" 
                      src="https://images.unsplash.com/photo-1493962853295-0fd70327578a" 
                      alt="Event venue" />
                  </div>
                  <div className="p-4">
                    <div className="uppercase tracking-wide text-sm text-bee-blue font-semibold">Festival</div>
                    <h2 className="mt-1 text-xl font-medium text-gray-900">Bahamas Carnival</h2>
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <FaCalendarAlt className="mr-1 h-4 w-4"/> May 3, 2025 • 12:00 PM
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <FaMapMarkerAlt className="mr-1 h-4 w-4"/> Various Locations
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <FaUsers className="mr-1 h-4 w-4"/> 2000+ Attending
                    </div>
                    <button className="mt-4 bg-bee-blue text-white px-4 py-2 rounded hover:bg-bee-darkblue transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="videos" className="mt-6">
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
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Events;
