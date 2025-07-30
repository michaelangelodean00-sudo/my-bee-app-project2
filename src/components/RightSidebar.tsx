
import WeatherWidget from "./WeatherWidget";
import UserProfile from "./UserProfile";
import TrendingSection from "./TrendingSection";
import BurgerAdWidget from "./BurgerAdWidget";

const RightSidebar = () => {
  // Default user data for the sidebar profile
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
    bio: "Welcome to B.E.E App! Connect with local businesses and community.",
    isCurrentUser: true
  };

  return (
    <div className="hidden xl:block w-80 p-6 space-y-6 bg-white dark:bg-gray-900 min-h-screen border-l border-gray-200 dark:border-gray-700">
      <UserProfile {...defaultUser} />
      
      {/* Premium Ad Placement - Between profile and widgets for better visibility */}
      <div className="bg-gradient-to-br from-background/50 to-muted/30 p-3 rounded-xl border border-border/20 shadow-sm">
        <div className="text-xs text-muted-foreground mb-2 text-center font-medium">Sponsored</div>
        <BurgerAdWidget />
      </div>
      
      <WeatherWidget />
      <TrendingSection />
    </div>
  );
};

export default RightSidebar;
