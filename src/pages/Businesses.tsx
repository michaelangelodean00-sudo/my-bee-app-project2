
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, MapPin, Phone, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import VideoPlayer from "../components/VideoPlayer";

const businessData = [
  {
    id: "biz1",
    name: "Ocean View Restaurant",
    type: "Restaurant",
    location: "Nassau, Paradise Island",
    phone: "+1 (242) 555-1234",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1000",
    description: "Enjoy fresh seafood and breathtaking ocean views at this popular local restaurant."
  },
  {
    id: "biz2",
    name: "Island Tours & Excursions",
    type: "Tourism",
    location: "Downtown Nassau",
    phone: "+1 (242) 555-5678",
    image: "https://images.unsplash.com/photo-1596627116790-af6f46bddbf8?q=80&w=1000",
    description: "Discover the beauty of the Bahamas with our guided tours and excursions."
  },
  {
    id: "biz3",
    name: "Tropical Spa & Wellness",
    type: "Health & Beauty",
    location: "Cable Beach",
    phone: "+1 (242) 555-9012",
    image: "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?q=80&w=1000",
    description: "Relax and rejuvenate with our range of spa treatments inspired by local traditions."
  }
];

// Mock approved videos for businesses
const businessVideos = [
  {
    id: "1",
    platform: "instagram",
    videoUrl: "https://instagram.com/reel/example1",
    title: "Ocean View Restaurant Tour",
    description: "Take a virtual tour of our beautiful oceanfront dining experience"
  },
  {
    id: "2",
    platform: "youtube",
    videoUrl: "https://youtube.com/watch?v=example2",
    title: "Island Tours Adventure",
    description: "See what makes our tours special and unforgettable"
  },
  {
    id: "3",
    platform: "tiktok",
    videoUrl: "https://tiktok.com/@example",
    title: "Spa Relaxation Tips",
    description: "Quick relaxation techniques you can try at home"
  }
];

const Businesses = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header toggleMobileSidebar={() => {}} />
      
      <div className="flex">
        <Sidebar className="hidden md:block" />
        
        {/* Main Content */}
        <div className="flex-1 max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold mb-6 text-bee-black">Local Businesses</h1>
          
          <Tabs defaultValue="directory" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="directory">Business Directory</TabsTrigger>
              <TabsTrigger value="videos">Business Videos</TabsTrigger>
            </TabsList>
            
            <TabsContent value="directory" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {businessData.map((business) => (
                  <Card key={business.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={business.image} 
                        alt={business.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2">
                        <Building2 size={18} className="text-bee-blue" />
                        {business.name}
                      </CardTitle>
                      <CardDescription>{business.type}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-4 text-sm text-gray-600">{business.description}</p>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin size={16} className="text-gray-500" />
                          <span>{business.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone size={16} className="text-gray-500" />
                          <span>{business.phone}</span>
                        </div>
                      </div>
                      <div className="mt-4">
                        <Button variant="outline" size="sm" className="w-full">
                          <ExternalLink size={16} className="mr-2" />
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="videos" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {businessVideos.map((video) => (
                  <VideoPlayer
                    key={video.id}
                    platform={video.platform}
                    videoUrl={video.videoUrl}
                    title={video.title}
                    description={video.description}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Businesses;
