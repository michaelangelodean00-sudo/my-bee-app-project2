import { useState } from "react";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useBeeNowFeed } from "@/lib/beenow";
import { filterDemoByTab, type BeeNowTab } from "@/lib/demoContent";
import { usePreviewMode } from "@/hooks/usePreviewMode";
import { isDesignDemoHost } from "@/lib/designDemoHost";
import { useAuth } from "@/hooks/useAuth";
import BeeNowCard from "./BeeNowCard";
import { cn } from "@/lib/utils";

const TABS: { value: BeeNowTab; label: string; empty: string }[] = [
  { value: "for-you", label: "For You", empty: "Local businesses and events will appear here soon." },
  { value: "businesses", label: "Businesses", empty: "No business videos yet — Bahamian entrepreneurs are coming soon." },
  { value: "events", label: "Events", empty: "No event videos yet — what's happening will show here." },
];

const EmptyState = ({ message, tall }: { message: string; tall?: boolean }) => {
  const { isBusiness } = useAuth();
  return (
    <div className={cn("flex flex-col items-center justify-center text-center px-6", tall ? "py-20" : "py-10")}>
      <img src="/icons/app-icon-192.png" alt="" width={72} height={72} className="mb-3 h-[72px] w-[72px] rounded-2xl select-none" draggable={false} />
      <h3 className="font-heading text-lg font-semibold text-foreground">BeeNow is warming up</h3>
      <p className="mt-1 max-w-xs text-sm text-muted-foreground">{message}</p>
      {isBusiness && (
        <Link to="/upload-video" className="bee-btn mt-4 inline-flex min-h-[44px] items-center px-5 touch-manipulation active:scale-95">
          Upload your first video
        </Link>
      )}
    </div>
  );
};

const TabBody = ({ tab, empty, layout, demoRoute }: { tab: BeeNowTab; empty: string; layout: "home" | "page"; demoRoute: boolean }) => {
  const { videos } = useBeeNowFeed(tab);
  const { isPreview: adminPreview } = usePreviewMode();
  const isPreview = adminPreview || demoRoute;

  if (videos.length === 0 && !isPreview) return <EmptyState message={empty} tall={layout === "page"} />;

  // This preview is isolated from the real feed and never claims recorded playback.
  const demo = isPreview ? filterDemoByTab(tab) : [];
  return (
    <div>
      <p role="note" className="mb-2 text-[11px] text-muted-foreground">
        {demoRoute ? "Design demo" : "Admin preview"} · Fictional stories · Generated-photo motion, not recorded video
      </p>
      <div className={cn("bee-demo-feed mx-auto grid w-full max-w-[440px] grid-cols-1 gap-4", layout === "page" && "bee-demo-feed-immersive")}>
        {demo.map((item) => (
          <BeeNowCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

const BeeNowSection = ({ layout = "home", forceDemo = false }: { layout?: "home" | "page"; forceDemo?: boolean }) => {
  const [tab, setTab] = useState<BeeNowTab>("for-you");
  const demoRoute = forceDemo && isDesignDemoHost();
  return (
    <section aria-labelledby="beenow-heading" className="w-full">
      <div className="flex items-center justify-between mb-2">
        <h2 id="beenow-heading" className="font-heading text-xl font-bold text-foreground">
          BeeNow
        </h2>
        {layout === "home" && (
          <Link to={demoRoute ? "/design-demo/beenow" : "/beenow"} className="inline-flex min-h-[44px] items-center px-2 text-sm font-semibold text-primary touch-manipulation active:scale-95">
            Watch BeeNow →
          </Link>
        )}
      </div>
      <Tabs value={tab} onValueChange={(v) => setTab(v as BeeNowTab)}>
        <TabsList className="grid w-full grid-cols-3 h-11">
          {TABS.map((t) => (
            <TabsTrigger key={t.value} value={t.value} className="min-h-[44px] touch-manipulation">
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {TABS.map((t) => (
          <TabsContent key={t.value} value={t.value} className="mt-3">
            <TabBody tab={t.value} empty={t.empty} layout={layout} />
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
};

export default BeeNowSection;
