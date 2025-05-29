
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import AdSplash from "../components/AdSplash";
import CreatePost from "../components/CreatePost";
import RightSidebar from "../components/RightSidebar";
import { useNotifications } from "../contexts/NotificationContext";
import { Badge } from "@/components/ui/badge";

const Index = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const { hasNewBusinessVideos } = useNotifications();
  
  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };
  
  const handleNewPost = (newPost) => {
    setPosts([newPost, ...posts]);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header toggleMobileSidebar={toggleMobileSidebar} />
      <AdSplash />
      
      <div className="flex">
        {/* Mobile Sidebar Overlay */}
        {mobileSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={toggleMobileSidebar}
          />
        )}
        
        {/* Mobile Sidebar */}
        <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white transform ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-200 ease-in-out md:hidden`}>
          <Sidebar />
        </div>
        
        {/* Desktop Sidebar */}
        <Sidebar className="hidden md:block" />
        
        {/* Main Content */}
        <div className="flex-1 w-full max-w-5xl mx-auto py-6 px-4">
          <CreatePost onPostCreated={handleNewPost} />
          
          {/* Local Businesses Section with NEW badge */}
          <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Local Businesses Directory</h2>
              {hasNewBusinessVideos && (
                <Badge className="bg-red-500 text-white font-semibold px-3 py-1 animate-pulse">
                  NEW VIDEOS
                </Badge>
              )}
            </div>
            <p className="text-gray-600 mb-4">Discover amazing local businesses in Nassau</p>
            
            {/* Business Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Ocean View Restaurant */}
              <div className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="w-full h-32 bg-blue-200 rounded-lg mb-3 flex items-center justify-center">
                  <span className="text-blue-600 font-medium">Ocean View Restaurant</span>
                </div>
                <h3 className="font-semibold text-gray-900">Ocean View Restaurant</h3>
                <p className="text-sm text-gray-600">Fine dining with stunning ocean views</p>
              </div>
              
              {/* Island Tours */}
              <div className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="w-full h-32 bg-green-200 rounded-lg mb-3 flex items-center justify-center">
                  <span className="text-green-600 font-medium">Island Tours</span>
                </div>
                <h3 className="font-semibold text-gray-900">Island Tours Adventure</h3>
                <p className="text-sm text-gray-600">Explore the beautiful Bahamas</p>
              </div>
              
              {/* Spa & Wellness */}
              <div className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="w-full h-32 bg-purple-200 rounded-lg mb-3 flex items-center justify-center">
                  <span className="text-purple-600 font-medium">Relaxation Spa</span>
                </div>
                <h3 className="font-semibold text-gray-900">Paradise Spa & Wellness</h3>
                <p className="text-sm text-gray-600">Rejuvenate your mind and body</p>
              </div>
            </div>
          </div>
          
          {/* Posts will appear here */}
          {posts.map((post, index) => (
            <div key={index} className="mt-4">{/* Post component */}</div>
          ))}
        </div>
        
        {/* Right Sidebar */}
        <RightSidebar />
      </div>
    </div>
  );
};

export default Index;
