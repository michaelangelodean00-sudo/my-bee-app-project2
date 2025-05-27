
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import VideoPlayer from "../components/VideoPlayer";

// Mock approved videos for businesses
const businessVideos = [
  {
    id: "1",
    platform: "instagram",
    videoUrl: "https://instagram.com/reel/example1",
    title: "Ocean View Restaurant Tour",
    description: "Take a virtual tour of our beautiful oceanfront dining experience with stunning sunset views"
  },
  {
    id: "2",
    platform: "youtube",
    videoUrl: "https://youtube.com/watch?v=example2",
    title: "Island Tours Adventure",
    description: "See what makes our tours special and unforgettable. Join us for the adventure of a lifetime!"
  },
  {
    id: "3",
    platform: "tiktok",
    videoUrl: "https://tiktok.com/@example",
    title: "Spa Relaxation Tips",
    description: "Quick relaxation techniques you can try at home for instant stress relief"
  },
  {
    id: "4",
    platform: "facebook",
    videoUrl: "https://facebook.com/video/example",
    title: "Local Craft Brewery",
    description: "Behind the scenes at Nassau's finest craft brewery. Fresh beer, great vibes!"
  }
];

const Businesses = () => {
  return (
    <div className="min-h-screen bg-black">
      <Header toggleMobileSidebar={() => {}} />
      
      <div className="flex">
        <Sidebar className="hidden md:block" />
        
        {/* Main Content */}
        <div className="flex-1 py-6 px-4">
          <h1 className="text-2xl font-bold mb-6 text-white text-center">Business Videos</h1>
          
          {/* TikTok-style grid - responsive */}
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Businesses;
