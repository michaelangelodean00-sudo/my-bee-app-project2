
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import AdSplash from "../components/AdSplash";
import CreatePost from "../components/CreatePost";
import RightSidebar from "../components/RightSidebar";

const Index = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  
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
        <div className="flex-1 max-w-2xl mx-auto py-6 px-4 sm:px-6 lg:px-4">
          <CreatePost onPostCreated={handleNewPost} />
          
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
