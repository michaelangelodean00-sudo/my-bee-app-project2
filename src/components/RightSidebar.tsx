import { memo, lazy, Suspense, useEffect, useState } from "react";
import UserProfile from "./UserProfile";
import { Skeleton } from "./ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const WeatherWidget = lazy(() => import("./WeatherWidget"));
const TrendingSection = lazy(() => import("./TrendingSection"));

const WidgetSkeleton = () => (
  <div className="space-y-3">
    <Skeleton className="h-4 w-24" />
    <Skeleton className="h-20 w-full rounded-lg" />
  </div>
);

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("") || "U";

const formatMemberSince = (iso?: string) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(undefined, { month: "short", year: "numeric" });
};

interface ProfileRow {
  display_name: string | null;
  avatar_url: string | null;
  address: string | null;
  business_name: string | null;
  business_category: string | null;
  phone: string | null;
  account_type: "personal" | "business";
}

const RightSidebar = memo(() => {
  const { user, isAdmin, isBusiness } = useAuth();
  const [profile, setProfile] = useState<ProfileRow | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (!user) {
      setProfile(null);
      return;
    }
    supabase
      .from("profiles")
      .select("display_name, avatar_url, address, business_name, business_category, phone, account_type")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (!cancelled) setProfile((data as ProfileRow) ?? null);
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  if (!user) {
    return (
      <div className="hidden xl:block w-80 p-6 space-y-6 glass-sidebar min-h-screen">
        <Suspense fallback={<WidgetSkeleton />}>
          <WeatherWidget />
        </Suspense>
        <Suspense fallback={<WidgetSkeleton />}>
          <TrendingSection />
        </Suspense>
      </div>
    );
  }

  const businessOwner = isBusiness || profile?.account_type === "business";
  const name = businessOwner
    ? profile?.business_name || profile?.display_name || user.email || "My Profile"
    : profile?.display_name || user.email || "My Profile";

  const userProps = {
    name,
    avatarUrl: profile?.avatar_url ?? "",
    avatarFallback: initials(name),
    location: profile?.address ?? "",
    memberSince: formatMemberSince(user.created_at),
    postsCount: 0,
    followersCount: 0,
    followingCount: 0,
    businessOwner,
    role: (isAdmin ? "admin" : "user") as "admin" | "user",
    phone: profile?.phone ?? undefined,
    isCurrentUser: true,
  };

  return (
    <div className="hidden xl:block w-80 p-6 space-y-6 glass-sidebar min-h-screen">
      <UserProfile {...userProps} />

      <Suspense fallback={<WidgetSkeleton />}>
        <WeatherWidget />
      </Suspense>

      <Suspense fallback={<WidgetSkeleton />}>
        <TrendingSection />
      </Suspense>
    </div>
  );
});

RightSidebar.displayName = "RightSidebar";

export default RightSidebar;
