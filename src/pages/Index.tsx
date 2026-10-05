import { useState, useCallback, lazy, Suspense, memo } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import CreatePost from "../components/CreatePost";
import Post from "../components/Post";
import PageLoader from "../components/PageLoader";
import FeaturedVideoAdWidget from "../components/FeaturedVideoAdWidget";
import SponsoredVideoWidget from "../components/SponsoredVideoWidget";
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

const LOGO_URL = "/brand/bee-app-bahamas-logo.png";

// Lazy load non-critical visual components
const AnimatedBackground = lazy(() => import("../components/AnimatedBackground"));
const AdSplash = lazy(() => import("../components/AdSplash"));
const GreetingBanner = lazy(() => import("../components/GreetingBanner"));

interface FeedPost {
  id: string;
  author: {
    id: string;
    name: string;
    avatarUrl: string;
    avatarFallback: string;
  };
  content: string;
  imageUrl?: string;
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
}

const PostList = memo(({ userPosts }: { userPosts: FeedPost[] }) => {
  if (userPosts.length === 0) {
    return (
      <div className="flex flex-col items-center text-center py-12 px-4">
        <img
          src={LOGO_URL}
          alt="Bee App Bahamas"
          width={240}
          height={90}
          className="w-60 h-auto mb-4 select-none"
          draggable={false}
        />
        <h3 className="font-heading text-lg font-semibold text-foreground mb-1">The hive is quiet</h3>
        <p className="text-sm text-muted-foreground mb-4">Be the first to share something with the community.</p>
        <button
          type="button"
          onClick={() => {
            const target = document.getElementById('main-content');
            target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
          className="bee-btn px-5 py-2.5 min-h-[44px]"
        >
          Create a post
        </button>
      </div>
    );
  }
  return (
    <section aria-label="Community posts" className="space-y-4 md:space-y-4">
      {userPosts.map((post, index) => (
        <article
          key={post.id}
          className="animate-fade-in-up"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <EnhancedCard variant="premium" hover>
            <Post {...post} />
          </EnhancedCard>
        </article>
      ))}
    </section>
  );
});

PostList.displayName = 'PostList';

const Index = () => {
  const [posts, setPosts] = useState<FeedPost[]>([]);
  // Start with isLoading false for instant render
  const [isLoading] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // Real role from auth context
  const { isAdmin } = useAuth();
  const handleNewPost = useCallback((newPost: FeedPost) => {
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
      {/* Business Category Browse */}
      <BusinessCategorySection />

      {/* Video Ad Banner — below categories */}
      <div className="w-full px-4 md:px-6 py-2 bg-card/80 border-b border-border">
        <div className="max-w-3xl mx-auto">
          <SponsoredVideoWidget showMetrics={isAdmin} />
        </div>
      </div>
      
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
                <FeaturedVideoAdWidget showMetrics={isAdmin} />
              </EnhancedCard>
            </section>
          </ScrollReveal>
          
          {/* Posts Section - Using CSS animations instead of per-post ScrollReveal */}
          {isLoading ? (
            <PageLoader type="posts" />
          ) : (
            <PostList userPosts={posts} />
          )}
          
          </main>
        </PullToRefresh>
        </div>
      </div>
      
        <Footer />
        
        {/* Mobile Bottom Navigation */}
        <MobileBottomNav />
      </div>
    </PageTransition>
  );
};

export default Index;
