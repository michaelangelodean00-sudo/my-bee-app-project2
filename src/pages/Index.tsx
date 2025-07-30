
import { useState } from "react";
import ModernSidebar from "../components/ModernSidebar";
import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import AdSplash from "../components/AdSplash";
import CreatePost from "../components/CreatePost";
import RightSidebar from "../components/RightSidebar";
import Post from "../components/Post";

const Index = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [posts, setPosts] = useState([]);
  
  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };

  const toggleSidebarCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };
  
  const handleNewPost = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  // Sample posts for demonstration
  const samplePosts = [
    {
      id: "1",
      author: {
        id: "user1",
        name: "John Doe",
        avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&auto=format&fit=crop&crop=face",
        avatarFallback: "JD"
      },
      content: "Just launched my new business! Check out our amazing products and services. Excited to be part of the B.E.E community! 🚀",
      timestamp: "2 hours ago",
      likes: 15,
      comments: 3,
      shares: 2
    },
    {
      id: "2",
      author: {
        id: "user2",
        name: "Sarah Wilson",
        avatarUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&auto=format&fit=crop&crop=face",
        avatarFallback: "SW"
      },
      content: "Beautiful sunset from our event venue today! Can't wait to host more amazing events here. 🌅",
      imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&auto=format&fit=crop",
      timestamp: "4 hours ago",
      likes: 28,
      comments: 7,
      shares: 5
    }
  ];
  
  return (
    <div className="min-h-screen bg-background transition-colors">
      {/* Header */}
      <Header toggleMobileSidebar={toggleMobileSidebar} />
      
      {/* Hero Section */}
      <HeroSection />
      
      {/* Ad Splash */}
      <div className="py-8">
        <AdSplash />
      </div>
      
      <div className="flex w-full">
        {/* Mobile Sidebar Overlay */}
        {mobileSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={toggleMobileSidebar}
          />
        )}
        
        {/* Mobile Sidebar */}
        <div className={`fixed inset-y-0 left-0 z-50 transform ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:hidden`}>
          <ModernSidebar />
        </div>
        
        {/* Desktop Sidebar */}
        <ModernSidebar 
          className="hidden lg:block" 
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={toggleSidebarCollapse}
        />
        
        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          <div className="max-w-6xl mx-auto px-4 py-8">
            {/* Content Grid */}
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Feed */}
              <div className="lg:col-span-2 space-y-6">
                {/* Create Post Section */}
                <div className="bee-card p-6" data-create-post>
                  <CreatePost onPostCreated={handleNewPost} />
                </div>
                
                {/* Posts Grid */}
                <div className="space-y-6">
                  {/* Sample Posts */}
                  {samplePosts.map((post) => (
                    <div key={post.id} className="bee-card">
                      <Post {...post} />
                    </div>
                  ))}
                  
                  {/* User Created Posts */}
                  {posts.map((post, index) => (
                    <div key={`user-${index}`} className="bee-card">
                      <Post {...post} />
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Right Sidebar */}
              <div className="hidden lg:block space-y-6">
                <RightSidebar />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
