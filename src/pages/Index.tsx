
import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import AdSplash from "../components/AdSplash";
import CreatePost from "../components/CreatePost";
import RightSidebar from "../components/RightSidebar";
import Post from "../components/Post";
import PageLoader from "../components/PageLoader";
import StickyAdBanner from "../components/StickyAdBanner";
import InFeedAdWidget from "../components/InFeedAdWidget";

const Index = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };
  
  const handleNewPost = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
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
        <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 transform ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-200 ease-in-out md:hidden`}>
          <Sidebar />
        </div>
        
        {/* Desktop Sidebar */}
        <Sidebar className="hidden md:block" />
        
        {/* Main Content */}
        <div className="flex-1 w-full max-w-5xl mx-auto py-6 px-4">
          <div data-create-post>
            <CreatePost onPostCreated={handleNewPost} />
          </div>
          
          {/* Posts Section */}
          {isLoading ? (
            <PageLoader type="posts" />
          ) : (
            <div className="space-y-4">
              {/* Sample Posts */}
              {samplePosts.map((post, index) => (
                <div key={post.id}>
                  <div 
                    className="animate-stagger-fade"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <Post {...post} />
                  </div>
                  
                  {/* Insert ad after first post */}
                  {index === 0 && (
                    <div className="my-6 animate-stagger-fade" style={{ animationDelay: '0.3s' }}>
                      <InFeedAdWidget />
                    </div>
                  )}
                </div>
              ))}
              
              {/* User Created Posts */}
              {posts.map((post, index) => (
                <div 
                  key={`user-${index}`} 
                  className="animate-content-fade-in"
                >
                  <Post {...post} />
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Sticky Ad Banner */}
        <StickyAdBanner position="bottom" />
        
        {/* Right Sidebar - now visible on larger mobile screens */}
        <RightSidebar />
      </div>
    </div>
  );
};

export default Index;
