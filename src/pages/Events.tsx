import React from 'react';
import { 
  FaGuitar, 
  FaUsers, 
  FaCalendarAlt, 
  FaMapMarkerAlt 
} from 'react-icons/fa';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import VideoPlayer from "../components/VideoPlayer";

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
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center justify-center space-y-6">
        <h1 className="text-3xl font-bold text-center">Discover Amazing Events</h1>
        
        <div className="w-full max-w-2xl">
          <img 
            src="https://images.unsplash.com/photo-1519671482749-fd09be7ccebf" 
            alt="People dancing" 
            className="w-full h-96 object-cover rounded-lg shadow-lg"
          />
        </div>
        
        <div className="text-center max-w-xl">
          <p className="text-lg text-gray-600">
            Get ready to move, groove, and make unforgettable memories at our exciting events!
          </p>
        </div>
        
        <div className="w-full max-w-3xl flex justify-center mb-4">
          <img 
            src="/lovable-uploads/499d5d4c-881b-465a-8e8e-8316c1110d07.png" 
            alt="Silhouette of performers" 
            className="h-32 object-contain"
          />
        </div>
        
        <Tabs defaultValue="upcoming" className="w-full max-w-6xl">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
            <TabsTrigger value="popular">Popular</TabsTrigger>
            <TabsTrigger value="videos">Event Videos</TabsTrigger>
            <TabsTrigger value="create">Create Event</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming" className="space-y-4 mt-6">
            {/* Event Card 1 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="md:flex">
                <div className="md:shrink-0">
                  <img className="h-48 w-full object-cover md:w-48" 
                    src="https://images.unsplash.com/photo-1472396961693-142e6e269027" 
                    alt="Event venue" />
                </div>
                <div className="p-4">
                  <div className="uppercase tracking-wide text-sm text-bee-blue font-semibold">Music Festival</div>
                  <h2 className="mt-1 text-xl font-medium text-gray-900">Bahamas Summer Jam</h2>
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <FaCalendarAlt className="mr-1 h-4 w-4"/> June 15, 2025 • 4:00 PM
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <FaMapMarkerAlt className="mr-1 h-4 w-4"/> Paradise Island, Nassau
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <FaUsers className="mr-1 h-4 w-4"/> 350+ Attending
                  </div>
                  <button className="mt-4 bg-bee-blue text-white px-4 py-2 rounded hover:bg-bee-darkblue transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            </div>
            
            {/* Event Card 2 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="md:flex">
                <div className="md:shrink-0">
                  <img className="h-48 w-full object-cover md:w-48" 
                    src="https://images.unsplash.com/photo-1466721591366-2d5fba72006d" 
                    alt="Cultural event" />
                </div>
                <div className="p-4">
                  <div className="uppercase tracking-wide text-sm text-bee-blue font-semibold">Cultural</div>
                  <h2 className="mt-1 text-xl font-medium text-gray-900">Junkanoo Celebration</h2>
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <FaCalendarAlt className="mr-1 h-4 w-4"/> July 10, 2025 • 8:00 PM
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <FaMapMarkerAlt className="mr-1 h-4 w-4"/> Downtown Nassau
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <FaUsers className="mr-1 h-4 w-4"/> 500+ Attending
                  </div>
                  <button className="mt-4 bg-bee-blue text-white px-4 py-2 rounded hover:bg-bee-darkblue transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </TabsContent>
          
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
            <div className="bg-black rounded-lg p-6">
              <h2 className="text-2xl font-bold text-white text-center mb-6">Event Videos</h2>
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
          
          <TabsContent value="create" className="mt-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Create Your Own Event</h2>
              <p className="text-gray-600 mb-4">
                Share your event with the community and invite people to join in on the fun!
              </p>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Event Name</label>
                  <input type="text" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-bee-blue focus:border-bee-blue" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Event Type</label>
                  <select className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-bee-blue focus:border-bee-blue">
                    <option>Music</option>
                    <option>Cultural</option>
                    <option>Sports</option>
                    <option>Food & Drink</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date & Time</label>
                  <input type="datetime-local" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-bee-blue focus:border-bee-blue" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Location</label>
                  <input type="text" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-bee-blue focus:border-bee-blue" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea rows={4} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-bee-blue focus:border-bee-blue"></textarea>
                </div>
                <div>
                  <button type="submit" className="w-full bg-bee-blue text-white px-4 py-2 rounded-md hover:bg-bee-darkblue transition-colors">
                    Create Event
                  </button>
                </div>
              </form>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Events;
