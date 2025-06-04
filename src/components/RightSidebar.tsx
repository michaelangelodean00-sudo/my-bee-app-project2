
import WeatherWidget from "./WeatherWidget";
import UserProfile from "./UserProfile";
import TrendingSection from "./TrendingSection";

const RightSidebar = () => {
  return (
    <div className="hidden xl:block w-80 p-6 space-y-6 bg-white dark:bg-gray-900 min-h-screen border-l border-gray-200 dark:border-gray-700">
      <UserProfile />
      <WeatherWidget />
      <TrendingSection />
    </div>
  );
};

export default RightSidebar;
