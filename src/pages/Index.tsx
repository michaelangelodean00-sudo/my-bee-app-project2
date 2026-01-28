import { useState, useEffect, useCallback } from "react";
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
import Footer from "../components/Footer";
import CopyrightWatermark from "../components/CopyrightWatermark";
import PullToRefresh from "../components/PullToRefresh";
import GreetingBanner from "../components/GreetingBanner";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

const Index = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };
  
  const handleNewPost = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  const handleRefresh = useCallback(async () => {
    // Simulate a refresh delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast.success("Feed refreshed!", {
      description: "You're all caught up with the latest posts.",
      duration: 2000
    });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

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
    <div className="min-h-screen bg-background transition-colors relative overflow-hidden">
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
      <GreetingBanner />
      
      <div className="flex relative">
        {/* Mobile Sidebar Overlay */}
        {mobileSidebarOpen && (
          <div 
            className="fixed inset-0 bg-foreground/40 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-200"
            onClick={toggleMobileSidebar}
          />
        )}
        
        {/* Mobile Sidebar - Fixed position */}
        <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-card shadow-2xl transform ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-out md:hidden`}>
          <div className="flex justify-between items-center p-4 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">Menu</h2>
            <button
              onClick={toggleMobileSidebar}
              className="p-2 hover:bg-accent rounded-lg transition-colors"
              aria-label="Close menu"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          <div className="h-[calc(100%-65px)] overflow-y-auto">
            <Sidebar />
          </div>
        </div>
        
        {/* Tablet & Desktop Sidebar - Sticky position relative to flex container */}
        <aside className="hidden md:block w-64 flex-shrink-0 sticky top-0 self-start h-fit">
          <div className="bg-card border-r border-border overflow-y-auto max-h-[calc(100vh-2rem)]">
            <Sidebar className="h-full" />
          </div>
        </aside>
        
        {/* Main Content */}
        {/* Sticky Navigation Section - Business, Events, E-commerce */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Primary: Ad Carousel */}
          <div className="w-full">
            <AdSplash />
          </div>
          
          {/* Secondary: Category Navigation */}
          <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-border flex-shrink-0">
            <div className="w-full max-w-3xl mx-auto px-4 md:px-6 py-3">
              <section aria-label="Navigate to sections">
                <CreatePost onPostCreated={handleNewPost} />
              </section>
            </div>
          </div>
          
          <PullToRefresh onRefresh={handleRefresh} className="flex-1 overflow-y-auto">
            <main className="w-full max-w-3xl mx-auto py-6 md:py-10 px-4 md:px-6 relative z-10 space-y-6 md:space-y-8" role="main" id="main-content">
          
          {/* Video Upload Button */}
          <ScrollReveal direction="up" delay={100}>
            <section aria-label="Upload video content">
              <Card 
                className="p-4 cursor-pointer hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 bg-card border-primary/15 w-fit mx-auto group"
                onClick={() => navigate('/upload-video')}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Plus size={24} className="text-primary" />
                  </div>
                  <span className="text-sm font-medium text-primary">Upload Video</span>
                </div>
              </Card>
            </section>
          </ScrollReveal>
          
          {/* Ad Widget */}
          <ScrollReveal direction="fade" delay={150}>
            <section aria-label="Sponsored content">
              <p className="text-xs text-muted-foreground mb-3 md:mb-4 text-center font-medium tracking-wide uppercase">Sponsored</p>
              <EnhancedCard variant="default" className="p-4 md:p-5">
                <McdonaldsAdWidget />
              </EnhancedCard>
            </section>
          </ScrollReveal>
          
          {/* Posts Section */}
          <section aria-label="Social media posts" className="space-y-5 md:space-y-6">
            {isLoading ? (
              <PageLoader type="posts" />
            ) : (
              <>
                {samplePosts.map((post, index) => (
                  <ScrollReveal 
                    key={post.id}
                    direction="up"
                    delay={200 + (index * 100)}
                  >
                    <article>
                      <EnhancedCard variant="default" hover>
                        <Post {...post} />
                      </EnhancedCard>
                    </article>
                  </ScrollReveal>
                ))}
                
                {posts.map((post, index) => (
                  <ScrollReveal 
                    key={`user-${index}`}
                    direction="up"
                    delay={50}
                  >
                    <article>
                      <EnhancedCard variant="premium" hover>
                        <Post {...post} />
                      </EnhancedCard>
                    </article>
                  </ScrollReveal>
                ))}
              </>
            )}
          </section>
          </main>
        </PullToRefresh>
        </div>
        
        {/* Right Sidebar */}
        <aside aria-label="Additional content and widgets">
          <RightSidebar />
        </aside>
      </div>
      
      <Footer />
    </div>
  );
};

export default Index;
