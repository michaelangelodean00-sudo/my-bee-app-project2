
import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import AdSplash from "../components/AdSplash";
import CreatePost from "../components/CreatePost";
import RightSidebar from "../components/RightSidebar";
import Post from "../components/Post";
import PageLoader from "../components/PageLoader";
import McdonaldsAdWidget from "../components/McdonaldsAdWidget";
import AnimatedBackground from "../components/AnimatedBackground";
import EnhancedCard from "../components/EnhancedCard";
import ScrollReveal from "../components/ScrollReveal";
import LazyImage from "../components/LazyImage";
import Footer from "../components/Footer";
import CopyrightWatermark from "../components/CopyrightWatermark";

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
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/5 pattern-bee-subtle transition-colors relative">
      <AnimatedBackground />
      
      {/* Copyright Watermark */}
      <CopyrightWatermark 
        className="fixed top-4 right-4 z-50" 
        variant="subtle" 
      />
      
      {/* SEO Header */}
      <header>
        <h1 className="sr-only">B.E.E App Bahamas - Business, Events & E-commerce Platform</h1>
        <p className="sr-only">Connect with local Bahamian businesses, discover events, and explore e-commerce opportunities in the Caribbean.</p>
      </header>
      
      <Header toggleMobileSidebar={toggleMobileSidebar} />
      <AdSplash />
      
      <div className="flex">
        {/* Mobile Sidebar Overlay */}
        {mobileSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-300"
            onClick={toggleMobileSidebar}
          />
        )}
        
        {/* Mobile Sidebar */}
        <div className={`fixed inset-y-0 left-0 z-50 w-64 glass-sidebar shadow-2xl transform ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-out md:hidden`}>
          <div className="flex justify-between items-center p-4 border-b border-border/50">
            <h2 className="text-lg font-semibold">Menu</h2>
            <button
              onClick={toggleMobileSidebar}
              className="p-2 hover:bg-accent rounded-lg transition-colors active:scale-90 touch-manipulation"
              aria-label="Close menu"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          <Sidebar />
        </div>
        
        {/* Desktop Sidebar */}
        <Sidebar className="hidden md:block" />
        
        {/* Main Content */}
        <main className="flex-1 w-full max-w-5xl mx-auto py-6 px-4 relative z-10" role="main" id="main-content">
          <ScrollReveal direction="up" delay={100}>
            <section aria-label="Create new post">
              <CreatePost onPostCreated={handleNewPost} />
            </section>
          </ScrollReveal>
          
          {/* Ad Widget between CreatePost and posts */}
          <ScrollReveal direction="fade" delay={200}>
            <section className="my-6" aria-label="Sponsored content">
              <div className="text-xs text-muted-foreground mb-2 text-center font-medium">Sponsored</div>
              <EnhancedCard variant="glow" className="p-3">
                <McdonaldsAdWidget />
              </EnhancedCard>
            </section>
          </ScrollReveal>
          
          {/* Posts Section */}
          <section aria-label="Social media posts">
            {isLoading ? (
              <PageLoader type="posts" />
            ) : (
              <div className="space-y-4">
                {/* Sample Posts */}
                {samplePosts.map((post, index) => (
                  <ScrollReveal 
                    key={post.id}
                    direction="up"
                    delay={300 + (index * 150)}
                  >
                    <article>
                      <EnhancedCard variant="floating" hover>
                        <Post {...post} />
                      </EnhancedCard>
                    </article>
                  </ScrollReveal>
                ))}
                
                {/* User Created Posts */}
                {posts.map((post, index) => (
                  <ScrollReveal 
                    key={`user-${index}`}
                    direction="up"
                    delay={100}
                  >
                    <article>
                      <EnhancedCard variant="premium" hover>
                        <Post {...post} />
                      </EnhancedCard>
                    </article>
                  </ScrollReveal>
                ))}
              </div>
            )}
          </section>
        </main>
        
        {/* Right Sidebar - now visible on larger mobile screens */}
        <aside aria-label="Additional content and widgets">
          <RightSidebar />
        </aside>
      </div>
      
      {/* Footer with Copyright */}
      <Footer />
    </div>
  );
};

export default Index;
