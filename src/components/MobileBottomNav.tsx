import { memo } from "react";
import { Building2, Calendar, ShoppingCart, Home, UserCircle } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useNotifications } from "../contexts/NotificationContext";
import { usePrefetch } from "../hooks/usePrefetch";
import { cn } from "@/lib/utils";

interface NavItem {
  icon: typeof Home;
  label: string;
  path: string;
  notificationKey?: string;
}

const navigationItems: NavItem[] = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Building2, label: "Business", path: "/businesses", notificationKey: "hasNewBusinessVideos" },
  { icon: Calendar, label: "Events", path: "/events", notificationKey: "hasNewEventsVideos" },
  { icon: ShoppingCart, label: "Shop", path: "/ecommerce", notificationKey: "hasNewEcommerceItems" },
  { icon: UserCircle, label: "Profile", path: "/profile" },
];

const MobileBottomNav = memo(() => {
  const location = useLocation();
  const notifications = useNotifications();
  const { prefetchOnHover } = usePrefetch();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-card/95 backdrop-blur-md border-t border-border safe-area-bottom">
      <div className="flex items-center justify-around px-2 py-2">
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
              {...prefetchOnHover(item.path)}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-200 relative min-w-[60px] min-h-[44px] touch-manipulation active:scale-95",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground active:bg-accent/50"
              )}
            >
              <div className="relative">
                <Icon size={20} className={cn(
                  "transition-all duration-200",
                  isActive && "scale-110"
                )} />
                {hasNotification && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full animate-pulse" />
                )}
              </div>
              <span className={cn(
                "text-[10px] font-medium",
                isActive && "font-semibold"
              )}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
});

MobileBottomNav.displayName = 'MobileBottomNav';

export default MobileBottomNav;
