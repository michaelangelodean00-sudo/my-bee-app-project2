import { Building2, Calendar, ShoppingCart, Settings, User, Home, UserCircle } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useNotifications } from "../contexts/NotificationContext";
import { Badge } from "./ui/badge";
import SearchBar from "./SearchBar";
import McdonaldsAdWidget from "./McdonaldsAdWidget";

interface SidebarProps {
  className?: string;
}

const Sidebar = ({ className = "" }: SidebarProps) => {
  const location = useLocation();
  const { hasNewBusinessVideos, hasNewEventsVideos, hasNewEcommerceItems } = useNotifications();

  console.log("Sidebar - hasNewBusinessVideos:", hasNewBusinessVideos);
  console.log("Sidebar - hasNewEventsVideos:", hasNewEventsVideos);
  console.log("Sidebar - hasNewEcommerceItems:", hasNewEcommerceItems);

  const navigationItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Building2, label: "Business", path: "/businesses", hasNotification: hasNewBusinessVideos },
    { icon: Calendar, label: "Events", path: "/events", hasNotification: hasNewEventsVideos },
    { icon: ShoppingCart, label: "E-commerce", path: "/ecommerce", hasNotification: hasNewEcommerceItems },
    { icon: Settings, label: "Settings", path: "/settings" },
    { icon: UserCircle, label: "Profile", path: "/profile" },
  ];

  return (
    <div className={`w-full md:w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-screen sticky top-0 ${className}`}>
      <div className="p-3 sm:p-4">
        {/* Mobile Search Bar */}
        <div className="md:hidden mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
          <SearchBar />
        </div>
        
        <nav className="space-y-1 sm:space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between px-3 py-3 sm:px-4 sm:py-3 rounded-lg transition-colors relative min-h-[44px] touch-manipulation ${
                  isActive
                    ? "bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-400"
                    : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700 active:bg-gray-100 dark:active:bg-gray-600"
                }`}
              >
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <Icon size={20} className="flex-shrink-0" />
                  <div className="flex items-center space-x-2 min-w-0 flex-1">
                    <span className="font-medium text-sm sm:text-base truncate">{item.label}</span>
                    {item.hasNotification && (
                      <Badge variant="destructive" className="text-xs px-1.5 py-0.5 bg-red-500 text-white animate-pulse flex-shrink-0">
                        NEW
                      </Badge>
                    )}
                  </div>
                </div>
                {item.hasNotification && (
                  <div className="relative flex-shrink-0">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                    <div className="absolute inset-0 w-3 h-3 bg-red-500 rounded-full animate-ping opacity-75" />
                  </div>
                )}
              </Link>
            );
          })}
        </nav>
        
        {/* Ad Widget below navigation */}
        <div className="mt-6 px-1">
          <div className="text-xs text-muted-foreground mb-2 text-center font-medium">Sponsored</div>
          <McdonaldsAdWidget />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
