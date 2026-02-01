import { memo } from "react";
import { Building2, Calendar, ShoppingCart, Settings, Home, UserCircle } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useNotifications } from "../contexts/NotificationContext";
import { usePrefetch } from "../hooks/usePrefetch";
import { Badge } from "./ui/badge";
import SearchBar from "./SearchBar";
import { cn } from "@/lib/utils";

interface SidebarProps {
  className?: string;
  onLinkClick?: () => void;
}

const navigationItems = [
  { icon: Home, label: "Home", path: "/", notificationKey: null },
  { icon: Building2, label: "Business", path: "/businesses", notificationKey: "hasNewBusinessVideos" },
  { icon: Calendar, label: "Events", path: "/events", notificationKey: "hasNewEventsVideos" },
  { icon: ShoppingCart, label: "E-commerce", path: "/ecommerce", notificationKey: "hasNewEcommerceItems" },
  { icon: Settings, label: "Settings", path: "/settings", notificationKey: null },
  { icon: UserCircle, label: "Profile", path: "/profile", notificationKey: null },
] as const;

const Sidebar = memo(({ className = "", onLinkClick }: SidebarProps) => {
  const location = useLocation();
  const notifications = useNotifications();
  const { prefetchOnHover } = usePrefetch();

  return (
    <aside className={`w-full bg-card transition-all duration-300 ${className}`}>
      <div className="p-4 pt-2">
        {/* Mobile Search Bar */}
        <div className="md:hidden mb-4 pb-4 border-b border-border">
          <SearchBar />
        </div>
        
        <nav className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            const hasNotification = item.notificationKey 
              ? notifications[item.notificationKey as keyof typeof notifications]
              : false;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onLinkClick}
                {...prefetchOnHover(item.path)}
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
                    {hasNotification && (
                      <Badge className="hidden lg:inline-flex text-[10px] px-1.5 py-0.5 bg-destructive text-destructive-foreground font-semibold animate-pulse">
                        NEW
                      </Badge>
                    )}
                  </div>
                </div>
                {hasNotification && (
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
});

Sidebar.displayName = 'Sidebar';

export default Sidebar;
