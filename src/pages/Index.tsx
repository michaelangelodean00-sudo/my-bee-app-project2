
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import AdSplash from "../components/AdSplash";
import CreatePost from "../components/CreatePost";
import RightSidebar from "../components/RightSidebar";
import Logo from "../components/Logo";

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
      
      <div className="flex justify-center my-4">
        <Logo className="scale-100" />
      </div>
      
      <div className="flex">
        {/* Mobile Sidebar */}
        <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white transform ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-200 ease-in-out md:hidden`}>
          <Sidebar />
        </div>
        
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
