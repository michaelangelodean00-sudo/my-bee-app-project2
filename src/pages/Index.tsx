import { useState, useCallback, lazy, Suspense, memo } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import CreatePost from "../components/CreatePost";
import Post from "../components/Post";
import PageLoader from "../components/PageLoader";
import McdonaldsAdWidget from "../components/McdonaldsAdWidget";
import BurgerAdWidget from "../components/BurgerAdWidget";
import BusinessCategorySection from "../components/BusinessCategorySection";

import EnhancedCard from "../components/EnhancedCard";
import ScrollReveal from "../components/ScrollReveal";
import Footer from "../components/Footer";
import PullToRefresh from "../components/PullToRefresh";
import PageTransition from "../components/PageTransition";
import MobileBottomNav from "../components/MobileBottomNav";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useAuth } from "../hooks/useAuth";

// Lazy load non-critical visual components
const AnimatedBackground = lazy(() => import("../components/AnimatedBackground"));
const AdSplash = lazy(() => import("../components/AdSplash"));
const GreetingBanner = lazy(() => import("../components/GreetingBanner"));

// Static sample posts - defined outside component to prevent recreation
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

// Memoized post list to prevent unnecessary re-renders
const PostList = memo(({ posts, userPosts }: { posts: typeof samplePosts; userPosts: typeof samplePosts }) => (
  <section aria-label="Social media posts" className="space-y-4 md:space-y-4">
    {posts.map((post, index) => (
      <article 
        key={post.id} 
        className="animate-fade-in-up"
        style={{ animationDelay: `${index * 50}ms` }}
      >
        <EnhancedCard variant="default" hover>
          <Post {...post} />
        </EnhancedCard>
      </article>
    ))}
    
    {userPosts.map((post, index) => (
      <article 
        key={`user-${index}`}
        className="animate-fade-in-up"
      >
        <EnhancedCard variant="premium" hover>
          <Post {...post} />
        </EnhancedCard>
      </article>
    ))}
  </section>
));

PostList.displayName = 'PostList';

const Index = () => {
  const [posts, setPosts] = useState<typeof samplePosts>([]);
  // Start with isLoading false for instant render
  const [isLoading] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const navigate = useNavigate();
  
  // Real role from auth context
  const { isAdmin } = useAuth();
  const handleNewPost = useCallback((newPost: typeof samplePosts[0]) => {
    setPosts(prev => [newPost, ...prev]);
  }, []);

  const handleRefresh = useCallback(async () => {
    await new Promise(resolve => setTimeout(resolve, 800));
    toast.success("Feed refreshed!", {
      description: "You're all caught up with the latest posts.",
      duration: 2000
    });
  }, []);

  const toggleMobileSidebar = useCallback(() => {
    setMobileSidebarOpen(prev => !prev);
  }, []);
  
  return (
    <PageTransition>
      <div className="min-h-screen bg-background transition-colors relative overflow-hidden" style={{ contain: 'layout' }}>
        <Suspense fallback={null}>
          <AnimatedBackground />
        </Suspense>
      
      {/* Mobile Sidebar Sheet */}
      <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
        <SheetContent side="right" className="w-[280px] p-0">
          <SheetHeader className="px-4 pt-4 pb-2 border-b border-border">
            <SheetTitle className="text-lg font-heading">Menu</SheetTitle>
          </SheetHeader>
          <Sidebar className="h-full" onLinkClick={() => setMobileSidebarOpen(false)} />
        </SheetContent>
      </Sheet>
      
      {/* SEO Header */}
      <header>
        <h1 className="sr-only">B.E.E App Bahamas - Business, Events & E-commerce Platform</h1>
        <p className="sr-only">Connect with local Bahamian businesses, discover events, and explore e-commerce opportunities in the Caribbean.</p>
      </header>
      
      <Header toggleMobileSidebar={toggleMobileSidebar} />
      <Suspense fallback={null}>
        <GreetingBanner />
      </Suspense>
      <Suspense fallback={<div className="h-[280px] md:h-[360px] bg-secondary animate-pulse" />}>
        <AdSplash showMetrics={isAdmin} />
      </Suspense>
      {/* Video Ad Banner — directly below AdSplash */}
      <div className="w-full px-4 md:px-6 py-2 bg-card/80 border-b border-border">
        <div className="max-w-3xl mx-auto">
          <BurgerAdWidget showMetrics={isAdmin} />
        </div>
      </div>

      {/* Business Category Browse — directly below Video Ad */}
      <BusinessCategorySection />
      
      <div className="flex relative">
        {/* Tablet & Desktop Sidebar */}
        <aside className="hidden md:block w-64 flex-shrink-0 sticky top-0 self-start h-fit">
          <div className="bg-card border-r border-border overflow-y-auto max-h-[calc(100vh-2rem)]">
            <Sidebar className="h-full" />
          </div>
        </aside>
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-border flex-shrink-0">
            <div className="w-full max-w-3xl mx-auto px-4 md:px-6 py-4">
              <section aria-label="Navigate to sections">
                <CreatePost onPostCreated={handleNewPost} />
              </section>
            </div>
          </div>
          
          <PullToRefresh onRefresh={handleRefresh} className="flex-1 overflow-y-auto">
            <main className="w-full max-w-3xl mx-auto py-4 md:py-6 px-4 md:px-6 relative z-10 space-y-4 md:space-y-5" role="main" id="main-content">
          
          
          {/* Ad Widget */}
          <ScrollReveal direction="fade">
            <section aria-label="Sponsored content">
              <p className="text-xs text-muted-foreground mb-3 md:mb-4 text-center font-medium tracking-wide uppercase">Sponsored</p>
              <EnhancedCard variant="default" className="p-4 md:p-5">
                <McdonaldsAdWidget showMetrics={isAdmin} />
              </EnhancedCard>
            </section>
          </ScrollReveal>
          
          {/* Posts Section - Using CSS animations instead of per-post ScrollReveal */}
          {isLoading ? (
            <PageLoader type="posts" />
          ) : (
            <PostList posts={samplePosts} userPosts={posts} />
          )}
          
          </main>
        </PullToRefresh>
        </div>
        
        {/* Right Sidebar - Desktop only */}
        <aside aria-label="Additional content and widgets">
          <RightSidebar />
        </aside>
      </div>
      
        <Footer />
        
        {/* Mobile Bottom Navigation */}
        <MobileBottomNav />
      </div>
    </PageTransition>
  );
};

export default Index;
