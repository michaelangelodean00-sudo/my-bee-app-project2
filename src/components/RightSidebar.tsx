
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
    <div className="hidden xl:block w-80 p-6 space-y-6 glass-sidebar min-h-screen">
      <UserProfile {...defaultUser} />
      
      {/* Premium Ad Placement - Between profile and widgets for better visibility */}
      <div className="bee-card-premium p-3">
        <div className="text-xs text-muted-foreground mb-2 text-center font-medium">Sponsored</div>
        <BurgerAdWidget />
      </div>
      
      <WeatherWidget />
      <TrendingSection />
    </div>
  );
};

export default RightSidebar;
