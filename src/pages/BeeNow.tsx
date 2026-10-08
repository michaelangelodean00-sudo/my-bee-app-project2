import { useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import MobileBottomNav from "../components/MobileBottomNav";
import BeeNowSection from "../components/beenow/BeeNowSection";
import DesignPreviewControl from "../components/DesignPreviewControl";
import SEOHead from "../components/SEOHead";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

const BeeNow = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen bg-background pb-24 md:pb-0">
      <SEOHead title="BeeNow — short videos from Bahamian businesses & events" description="Short videos from local Bahamian businesses and events." />
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-[280px] p-0">
          <SheetHeader className="px-4 pt-4 pb-2 border-b border-border">
            <SheetTitle className="text-lg font-heading">Menu</SheetTitle>
          </SheetHeader>
          <Sidebar className="h-full" onLinkClick={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
      <Header toggleMobileSidebar={() => setOpen((o) => !o)} />
      <div className="flex">
        <aside className="hidden md:block w-64 flex-shrink-0 sticky top-0 self-start border-r border-border bg-card">
          <Sidebar className="h-full" />
        </aside>
        <main id="main-content" className="flex-1 w-full max-w-3xl mx-auto px-4 md:px-6 py-4">
          <DesignPreviewControl page="beenow" />
          <BeeNowSection layout="page" />
        </main>
      </div>
      <MobileBottomNav />
    </div>
  );
};

export default BeeNow;
