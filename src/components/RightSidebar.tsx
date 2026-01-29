import { memo, lazy, Suspense } from "react";
import UserProfile from "./UserProfile";
import { Skeleton } from "./ui/skeleton";

// Lazy load non-critical widgets
const WeatherWidget = lazy(() => import("./WeatherWidget"));
const TrendingSection = lazy(() => import("./TrendingSection"));

const WidgetSkeleton = () => (
  <div className="space-y-3">
    <Skeleton className="h-4 w-24" />
    <Skeleton className="h-20 w-full rounded-lg" />
  </div>
);

const RightSidebar = memo(() => {
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
    bio: "Welcome to B.E.E App! Connect with local businesses and community.",
    isCurrentUser: true
  };

  return (
    <div className="hidden xl:block w-80 p-6 space-y-6 glass-sidebar min-h-screen">
      <UserProfile {...defaultUser} />
      
      <Suspense fallback={<WidgetSkeleton />}>
        <WeatherWidget />
      </Suspense>
      
      <Suspense fallback={<WidgetSkeleton />}>
        <TrendingSection />
      </Suspense>
    </div>
  );
});

RightSidebar.displayName = 'RightSidebar';

export default RightSidebar;
