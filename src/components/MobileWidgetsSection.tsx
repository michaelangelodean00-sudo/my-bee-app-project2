import { memo, lazy, Suspense } from "react";
import UserProfile from "./UserProfile";
import { Skeleton } from "./ui/skeleton";
import { Card } from "./ui/card";

// Lazy load non-critical widgets
const WeatherWidget = lazy(() => import("./WeatherWidget"));
const TrendingSection = lazy(() => import("./TrendingSection"));

const WidgetSkeleton = () => (
  <div className="space-y-2">
    <Skeleton className="h-4 w-24" />
    <Skeleton className="h-16 w-full rounded-lg" />
  </div>
);

const MobileWidgetsSection = memo(() => {
  const defaultUser = {
    name: "My Profile",
    avatarUrl: "https://i.pravatar.cc/150?u=current_user",
    avatarFallback: "MP",
    location: "Nassau, Bahamas",
    memberSince: "Jan 2024",
    postsCount: 12,
    followersCount: 150,
    followingCount: 89,
    isVerified: true,
    businessOwner: false,
    role: 'admin' as const,
    bio: "Welcome to B.E.E App!",
    isCurrentUser: true
  };

  return (
    <section className="xl:hidden px-4 pb-24 space-y-4" aria-label="User widgets">
      {/* Profile Card */}
      <UserProfile {...defaultUser} />
      
      {/* Weather Widget */}
      <Card className="p-4">
        <Suspense fallback={<WidgetSkeleton />}>
          <WeatherWidget />
        </Suspense>
      </Card>
      
      {/* Trending Section */}
      <Suspense fallback={<WidgetSkeleton />}>
        <TrendingSection />
      </Suspense>
    </section>
  );
});

MobileWidgetsSection.displayName = 'MobileWidgetsSection';

export default MobileWidgetsSection;
