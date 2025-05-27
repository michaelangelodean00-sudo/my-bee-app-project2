
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
          <h1 className="text-2xl font-bold mb-6 text-bee-black">Business Videos</h1>
          
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
        </div>
      </div>
    </div>
  );
};

export default Businesses;
