
import { Building2, Calendar, ShoppingCart, Settings, User, Home, UserCircle } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useNotifications } from "../contexts/NotificationContext";
import { Badge } from "./ui/badge";

interface SidebarProps {
  className?: string;
}

const Sidebar = ({ className = "" }: SidebarProps) => {
  const location = useLocation();
  const { hasNewBusinessVideos } = useNotifications();

  console.log("Sidebar - hasNewBusinessVideos:", hasNewBusinessVideos); // Debug log

  const navigationItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Building2, label: "Business", path: "/businesses", hasNotification: hasNewBusinessVideos },
    { icon: Calendar, label: "Events", path: "/events" },
    { icon: ShoppingCart, label: "E-commerce", path: "/ecommerce" },
    { icon: Settings, label: "Settings", path: "/settings" },
    { icon: User, label: "Profile", path: "/profile" },
  ];

  return (
    <div className={`w-64 bg-white border-r border-gray-200 min-h-screen ${className}`}>
      <div className="p-4">
        <nav className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between px-4 py-3 rounded-lg transition-colors relative ${
                  isActive
                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon size={20} />
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{item.label}</span>
                    {item.hasNotification && (
                      <Badge variant="destructive" className="text-xs px-1.5 py-0.5 bg-red-500 text-white animate-pulse">
                        NEW
                      </Badge>
                    )}
                  </div>
                </div>
                {item.hasNotification && (
                  <div className="relative">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse flex-shrink-0" />
                    <div className="absolute inset-0 w-3 h-3 bg-red-500 rounded-full animate-ping opacity-75" />
                  </div>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
