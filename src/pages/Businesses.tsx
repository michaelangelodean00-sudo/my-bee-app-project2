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
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { ISLANDS } from "@/lib/businessLinks";
import { getOpenStatus, WeekHours } from "@/lib/bahamasTime";
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
interface DetailsRow { business_id: string; description: string | null; island: string | null; hours: unknown }

const useApprovedBusinesses = () =>
  useQuery({
    queryKey: ["approved-businesses"],
    staleTime: 60_000,
    queryFn: async (): Promise<BusinessProfile[]> => {
      const [{ data, error }, { data: det, error: dErr }] = await Promise.all([
        supabase.from("public_businesses")
          .select("id, display_name, avatar_url, business_name, business_category, phone, address, created_at")
          .order("created_at", { ascending: false }),
        supabase.from("business_details").select("business_id, description, island, hours"),
      ]);
      if (error) throw error;
      if (dErr) throw dErr;
      const byId = new Map((det as DetailsRow[] ?? []).map((d) => [d.business_id, d]));
      return ((data ?? []) as ApprovedBusinessRow[]).map((row) => {
        const d = byId.get(row.id);
        return {
          id: row.id,
          name: row.business_name || row.display_name || "Unnamed business",
          category: normalizeCategory(row.business_category),
          description: d?.description ?? "",
          address: row.address || "",
          phone: row.phone || undefined,
          imageUrl: row.avatar_url || "/placeholder.svg",
          tags: [],
          island: d?.island ?? undefined,
          hours: (d?.hours as WeekHours) ?? undefined,
        };
      });
    },
  });

const useFilters = () => {
  const [params, setParams] = useSearchParams();
  const q = params.get("q") ?? "";
  const island = params.get("island") ?? "";
  const openNow = params.get("open") === "1";
  const set = (k: string, v: string) => {
    const next = new URLSearchParams(params);
    if (v) next.set(k, v); else next.delete(k);
    setParams(next, { replace: true });
  };
  return { q, island, openNow, set, active: !!(q || island || openNow) };
};

const applyFilters = (list: BusinessProfile[], f: { q: string; island: string; openNow: boolean }) => {
  const needle = f.q.trim().toLowerCase();
  return list.filter((b) =>
    (!needle || b.name.toLowerCase().includes(needle) || b.description.toLowerCase().includes(needle)) &&
    (!f.island || b.island === f.island) &&
    (!f.openNow || getOpenStatus(b.hours)?.open === true)
  );
};

const FilterBar = () => {
  const f = useFilters();
  const [text, setText] = useState(f.q);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => () => clearTimeout(timer.current), []);
  return (
    <div className="flex flex-col sm:flex-row gap-2 mb-4" role="search">
      <Input
        type="search" value={text} placeholder="Search businesses" aria-label="Search businesses"
        className="h-11 flex-1" maxLength={60}
        onChange={(e) => {
          const v = e.target.value; setText(v);
          clearTimeout(timer.current);
          timer.current = setTimeout(() => f.set("q", v.trim()), 250);
        }}
      />
      <select
        aria-label="Island" value={f.island} onChange={(e) => f.set("island", e.target.value)}
        className="h-11 rounded-md border border-input bg-background px-3 text-sm text-foreground"
      >
        <option value="">All islands</option>
        {ISLANDS.map((i) => <option key={i} value={i}>{i}</option>)}
      </select>
      <label className="flex h-11 items-center gap-2 rounded-md border border-input px-3 text-sm">
        <Switch checked={f.openNow} onCheckedChange={(v) => f.set("open", v ? "1" : "")} aria-label="Open now" />
        Open now
      </label>
    </div>
  );
};

const ResultsGrid = ({ items, loading, empty }: { items: BusinessProfile[]; loading: boolean; empty: string }) =>
  loading ? (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-64 rounded-lg" />)}
    </div>
  ) : items.length === 0 ? (
    <div className="text-center py-16 text-muted-foreground"><p className="text-sm">{empty}</p></div>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((b) => <BusinessProfileCard key={b.id} business={b} />)}
    </div>
  );

// ─── Category Profile View ──────────────────────────────────────────────────
const CategoryProfileView = ({ categoryId }: { categoryId: string }) => {
  const navigate = useNavigate();
  const category = CATEGORIES.find(c => c.id === categoryId);
  const { data: businesses = [], isLoading } = useApprovedBusinesses();
  const f = useFilters();
  const profiles = useMemo(
    () => applyFilters(businesses.filter(b => b.category === categoryId), f),
    [businesses, categoryId, f.q, f.island, f.openNow]
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
        <FilterBar />
        <ResultsGrid items={profiles} loading={isLoading}
          empty={f.active ? "No businesses match these filters yet." : "No businesses listed in this category yet."} />
      </div>
    </div>
  );
};

// ─── Category Directory (default view) ──────────────────────────────────────
const VideoFeed = () => {
  const navigate = useNavigate();
  const { data: businesses = [], isLoading } = useApprovedBusinesses();
  const f = useFilters();
  const results = useMemo(() => applyFilters(businesses, f), [businesses, f.q, f.island, f.openNow]);
  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-lg font-semibold text-foreground mb-4">Browse businesses</h2>
        <FilterBar />
        {f.active ? (
          <ResultsGrid items={results} loading={isLoading} empty="No businesses match these filters yet." />
        ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {CATEGORIES.map(({ id, label, icon: Icon }) => {
            const count = businesses.filter(b => b.category === id).length;
            return (
              <button
                key={id}
                onClick={() => navigate(`/businesses?category=${id}`)}
                className="min-h-[44px] touch-manipulation active:scale-95 transition-all duration-200 rounded-lg border border-border bg-card p-4 flex flex-col items-start gap-2 hover:border-primary"
              >
                <Icon className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-foreground text-left">{label}</span>
                <span className="text-xs text-muted-foreground">{count} listings</span>
              </button>
            );
          })}
        </div>
        )}
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
