import { useState, useCallback, lazy, Suspense } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PageTransition from "../components/PageTransition";
import MobileBottomNav from "../components/MobileBottomNav";
import BeeNowSection from "../components/beenow/BeeNowSection";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

// Home = Header -> compact Splash Ads -> BeeNow.
// GreetingBanner, BusinessCategorySection, SponsoredVideoWidget, CreatePost,
// FeaturedVideoAdWidget and the in-memory post list are intentionally no longer
// rendered on Home (files kept for reuse).
const AnimatedBackground = lazy(() => import("../components/AnimatedBackground"));
const AdSplash = lazy(() => import("../components/AdSplash"));

const Index = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const toggleMobileSidebar = useCallback(() => setMobileSidebarOpen((p) => !p), []);

  return (
    <PageTransition>
      <div className="min-h-screen bg-background transition-colors relative overflow-hidden pb-20 md:pb-0" style={{ contain: "layout" }}>
        <Suspense fallback={null}>
          <AnimatedBackground />
        </Suspense>

        <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
          <SheetContent side="right" className="w-[280px] p-0">
            <SheetHeader className="px-4 pt-4 pb-2 border-b border-border">
              <SheetTitle className="text-lg font-heading">Menu</SheetTitle>
            </SheetHeader>
            <Sidebar className="h-full" onLinkClick={() => setMobileSidebarOpen(false)} />
          </SheetContent>
        </Sheet>

        <header>
          <h1 className="sr-only">B.E.E App Bahamas - Business, Events & E-commerce Platform</h1>
          <p className="sr-only">See what's happening in The Bahamas and discover local businesses and events.</p>
        </header>

        <Header toggleMobileSidebar={toggleMobileSidebar} />

        <Suspense fallback={<div className="h-[250px] md:h-[360px] bg-secondary" />}>
          <AdSplash variant="compact" />
        </Suspense>

        <div className="flex relative">
          <aside className="hidden md:block w-64 flex-shrink-0 sticky top-0 self-start h-fit">
            <div className="bg-card border-r border-border overflow-y-auto max-h-[calc(100vh-2rem)]">
              <Sidebar className="h-full" />
            </div>
          </aside>

          <main id="main-content" role="main" className="flex-1 w-full max-w-3xl mx-auto px-4 md:px-6 pt-3 pb-6 relative z-10">
            <BeeNowSection layout="home" />
          </main>
        </div>

        <Footer />
        <MobileBottomNav />
      </div>
    </PageTransition>
  );
};

export default Index;
