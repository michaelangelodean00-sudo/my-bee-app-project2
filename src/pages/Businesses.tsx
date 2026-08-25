import { useEffect, useMemo, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import PageTransition from "../components/PageTransition";
import MobileBottomNav from "../components/MobileBottomNav";
import BusinessProfileCard, { BusinessProfile } from "../components/BusinessProfileCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useNotifications } from "../contexts/NotificationContext";
import { supabase } from "@/integrations/supabase/client";
import {
  UtensilsCrossed, Sparkles, ShoppingBag, Wrench,
  Car, CalendarDays, BriefcaseBusiness, Building2
} from "lucide-react";

const CATEGORIES = [
  { id: "food-dining",           label: "Food & Dining",         icon: UtensilsCrossed },
  { id: "beauty-wellness",       label: "Beauty & Wellness",     icon: Sparkles },
  { id: "retail-shopping",       label: "Retail & Shopping",     icon: ShoppingBag },
  { id: "home-trade-services",   label: "Home & Trade Services", icon: Wrench },
  { id: "auto-transport",        label: "Auto & Transport",      icon: Car },
  { id: "events",                label: "Events",                icon: CalendarDays },
  { id: "professional-services", label: "Professional Services", icon: BriefcaseBusiness },
  { id: "other",                 label: "Other",                 icon: Building2 },
] as const;

const VALID_CATEGORY_IDS = new Set<string>(CATEGORIES.map(c => c.id));

const normalizeCategory = (raw: string | null | undefined): string => {
  if (!raw) return "other";
  const slug = raw.toLowerCase().trim().replace(/[\s_&]+/g, "-").replace(/[^a-z0-9-]/g, "");
  if (VALID_CATEGORY_IDS.has(slug)) return slug;
  // common aliases
  if (slug.includes("food") || slug.includes("restaurant") || slug.includes("dining")) return "food-dining";
  if (slug.includes("beauty") || slug.includes("wellness") || slug.includes("spa")) return "beauty-wellness";
  if (slug.includes("retail") || slug.includes("shop")) return "retail-shopping";
  if (slug.includes("home") || slug.includes("trade")) return "home-trade-services";
  if (slug.includes("auto") || slug.includes("transport") || slug.includes("car")) return "auto-transport";
  if (slug.includes("event")) return "events";
  if (slug.includes("professional") || slug.includes("service")) return "professional-services";
  return "other";
};

interface ApprovedBusinessRow {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  business_name: string | null;
  business_category: string | null;
  phone: string | null;
  address: string | null;
  created_at: string;
}

const mapRow = (row: ApprovedBusinessRow): BusinessProfile => ({
  id: row.id,
  name: row.business_name || row.display_name || "Unnamed business",
  category: normalizeCategory(row.business_category),
  description: "",
  address: row.address || "",
  phone: row.phone || undefined,
  imageUrl: row.avatar_url || "/placeholder.svg",
  tags: [],
});

const useApprovedBusinesses = () =>
  useQuery({
    queryKey: ["approved-businesses"],
    staleTime: 60_000,
    queryFn: async (): Promise<BusinessProfile[]> => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, display_name, avatar_url, business_name, business_category, phone, address, created_at")
        .eq("account_type", "business")
        .eq("status", "approved")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data as ApprovedBusinessRow[]).map(mapRow);
    },
  });

// ─── Category Profile View ──────────────────────────────────────────────────
const CategoryProfileView = ({ categoryId }: { categoryId: string }) => {
  const navigate = useNavigate();
  const category = CATEGORIES.find(c => c.id === categoryId);
  const { data: businesses = [], isLoading } = useApprovedBusinesses();
  const profiles = useMemo(
    () => businesses.filter(b => b.category === categoryId),
    [businesses, categoryId]
  );
  const Icon = category?.icon;

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border px-4 py-3 flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full"
          onClick={() => navigate("/businesses")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        {Icon && <Icon className="h-5 w-5 text-primary" />}
        <h2 className="font-semibold text-foreground">{category?.label ?? "Businesses"}</h2>
        <span className="text-xs text-muted-foreground ml-auto">
          {isLoading ? "…" : `${profiles.length} listings`}
        </span>
      </div>

      <div className="p-4 max-w-4xl mx-auto">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-lg" />
            ))}
          </div>
        ) : profiles.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-sm">No businesses listed in this category yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {profiles.map(business => (
              <BusinessProfileCard key={business.id} business={business} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Video Feed (real videos only) ──────────────────────────────────────────
const VideoFeed = () => {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        <h2 className="text-lg font-semibold text-foreground mb-2">No business videos yet</h2>
        <p className="text-sm text-muted-foreground">
          Approved business videos will appear here.
        </p>
      </div>
    </div>
  );
};

// ─── Main Page ───────────────────────────────────────────────────────────────
const Businesses = () => {
  const { markBusinessVideosAsViewed } = useNotifications();
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");

  useEffect(() => {
    markBusinessVideosAsViewed();
  }, [markBusinessVideosAsViewed]);

  return (
    <PageTransition>
      <div className="min-h-screen bg-background flex flex-col">
        <Header toggleMobileSidebar={() => {}} />

        <div className="flex flex-1 relative overflow-hidden">
          <div className="hidden md:block md:w-64 flex-shrink-0">
            <div className="fixed top-16 left-0 w-64 h-[calc(100vh-4rem)] overflow-y-auto bg-card/80 backdrop-blur-sm border-r border-border z-20">
              <Sidebar className="h-full" />
            </div>
          </div>

          {categoryParam ? (
            <CategoryProfileView categoryId={categoryParam} />
          ) : (
            <VideoFeed />
          )}
        </div>

        <MobileBottomNav />
      </div>
    </PageTransition>
  );
};

export default Businesses;
