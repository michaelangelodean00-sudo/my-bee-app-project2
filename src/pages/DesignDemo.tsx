import { lazy, Suspense, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import MobileBottomNav from "../components/MobileBottomNav";
import BeeNowSection from "../components/beenow/BeeNowSection";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { isDesignDemoHost } from "@/lib/designDemoHost";
import NotFound from "./NotFound";

const AdSplash = lazy(() => import("../components/AdSplash"));

/**
 * Fictional design demonstration. Renders only on the allowlisted preview host
 * (and localhost); every other host gets Not Found. No data reads, no analytics.
 */
const DesignDemo = ({ feed = false }: { feed?: boolean }) => {
  const [open, setOpen] = useState(false);
  if (!isDesignDemoHost()) return <NotFound />;

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-0 overflow-x-hidden">
      <meta name="robots" content="noindex, nofollow" />
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-[280px] p-0">
          <SheetHeader className="px-4 pt-4 pb-2 border-b border-border">
            <SheetTitle className="text-lg font-heading">Menu</SheetTitle>
          </SheetHeader>
          <Sidebar className="h-full" onLinkClick={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
      <Header toggleMobileSidebar={() => setOpen((o) => !o)} />

      <div role="status" className="border-y border-primary/40 bg-primary/15 px-4 py-2">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-x-3 gap-y-1">
          <p className="text-xs font-bold tracking-wide text-foreground">
            DESIGN DEMONSTRATION · Fictional ads and example BeeNow media · Not live
          </p>
          <Link
            to={feed ? "/design-demo" : "/"}
            className="inline-flex min-h-[44px] items-center text-xs font-semibold text-primary underline-offset-2 hover:underline touch-manipulation active:scale-95"
          >
            {feed ? "← Back to demo home" : "← Exit to real Home"}
          </Link>
        </div>
      </div>

      {!feed && (
        <Suspense fallback={<div className="h-[250px] md:h-[360px] bg-secondary" />}>
          <AdSplash variant="compact" forceDemo />
        </Suspense>
      )}

      <main id="main-content" className="w-full max-w-3xl mx-auto px-4 md:px-6 pt-3 pb-6">
        <BeeNowSection layout={feed ? "page" : "home"} forceDemo />
      </main>
      <MobileBottomNav />
    </div>
  );
};

export default DesignDemo;
