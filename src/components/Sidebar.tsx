import { Building2, Calendar, ShoppingCart, Settings, Home, UserCircle } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useNotifications } from "../contexts/NotificationContext";
import { Badge } from "./ui/badge";
import SearchBar from "./SearchBar";

interface SidebarProps {
  className?: string;
}

const Sidebar = ({ className = "" }: SidebarProps) => {
  const location = useLocation();
  const { hasNewBusinessVideos, hasNewEventsVideos, hasNewEcommerceItems } = useNotifications();

  const navigationItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Building2, label: "Business", path: "/businesses", hasNotification: hasNewBusinessVideos },
    { icon: Calendar, label: "Events", path: "/events", hasNotification: hasNewEventsVideos },
    { icon: ShoppingCart, label: "E-commerce", path: "/ecommerce", hasNotification: hasNewEcommerceItems },
    { icon: Settings, label: "Settings", path: "/settings" },
    { icon: UserCircle, label: "Profile", path: "/profile" },
  ];

  return (
    <aside className={`w-full bg-card transition-all duration-300 ${className}`}>
      <div className="p-4 pt-2">
        {/* Mobile Search Bar */}
        <div className="md:hidden mb-4 pb-4 border-b border-border">
          <SearchBar />
        </div>
        
        <nav className="space-y-1">
          {navigationItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center justify-between px-3 lg:px-4 py-3 rounded-lg transition-all duration-200 min-h-[48px] group",
                  isActive
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground hover:translate-x-1"
                )}
              >
                <div className="flex items-center gap-2 lg:gap-3 min-w-0 flex-1">
                  <Icon size={18} className={cn(
                    "flex-shrink-0 transition-all duration-200 group-hover:scale-110 lg:w-5 lg:h-5",
                    isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                  )} />
                  <div className="flex items-center gap-1 lg:gap-2 min-w-0 flex-1">
                    <span className={cn(
                      "font-heading font-medium text-[9px] lg:text-sm truncate tracking-tight",
                      isActive && "text-primary"
                    )}>{item.label}</span>
                    {item.hasNotification && (
                      <Badge className="hidden lg:inline-flex text-[10px] px-1.5 py-0.5 bg-destructive text-destructive-foreground font-semibold animate-pulse">
                        NEW
                      </Badge>
                    )}
                  </div>
                </div>
                {item.hasNotification && (
                  <div className="relative flex-shrink-0">
                    <div className="w-2 h-2 bg-destructive rounded-full animate-pulse" />
                  </div>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

// Helper function for className merging
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export default Sidebar;
