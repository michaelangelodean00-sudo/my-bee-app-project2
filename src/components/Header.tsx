import { memo } from "react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import Logo from "./Logo";
import SearchBar from "./SearchBar";
import { useNotifications } from "../contexts/NotificationContext";

interface HeaderProps {
  toggleMobileSidebar: () => void;
}

const Header = memo(({ toggleMobileSidebar }: HeaderProps) => {
  const { hasNewBusinessVideos, hasNewEventsVideos, hasNewEcommerceItems } = useNotifications();
  const hasAnyNotifications = hasNewBusinessVideos || hasNewEventsVideos || hasNewEcommerceItems;

  return (
    <header className="sticky top-0 z-50 w-full bg-card/95 backdrop-blur-md border-b border-border animate-fade-in-down relative overflow-hidden">
      {/* Animated honey-gold accent line at top */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary/60 via-primary to-primary/60 animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
      
      {/* Mobile: logo row */}
      <div className="sm:hidden">
        <div className="flex items-center justify-between px-3 py-1.5 gap-2">
          <div className="overflow-hidden rounded-md flex-shrink-0">
            <Logo />
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="relative min-w-[44px] min-h-[44px] w-11 h-11 rounded-lg hover:bg-accent active:bg-accent/80 active:scale-95 transition-all touch-manipulation flex-shrink-0"
            onClick={toggleMobileSidebar}
            type="button"
          >
            <Menu size={22} className="text-foreground pointer-events-none" />
            {hasAnyNotifications && (
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-destructive rounded-full pointer-events-none" />
            )}
            <span className="sr-only">Open menu</span>
          </Button>
        </div>
      </div>

      {/* Tablet & Desktop: single horizontal row */}
      <div className="hidden sm:flex items-center w-full px-4 py-0.5 gap-3 min-h-[56px] md:min-h-[60px]">
        <div className="flex items-center gap-3 flex-shrink-0 overflow-hidden">
          <div className="overflow-hidden rounded-md">
            <Logo />
          </div>
        </div>
        <div className="flex-1 hidden md:block">
          <SearchBar />
        </div>
        {/* Hamburger — tablet only (md hides it via sidebar) */}
        <div className="flex-shrink-0 md:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="relative min-w-[44px] min-h-[44px] w-11 h-11 rounded-lg hover:bg-accent active:bg-accent/80 active:scale-95 transition-all touch-manipulation"
            onClick={toggleMobileSidebar}
            type="button"
          >
            <Menu size={22} className="text-foreground pointer-events-none" />
            {hasAnyNotifications && (
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-destructive rounded-full pointer-events-none" />
            )}
            <span className="sr-only">Open menu</span>
          </Button>
        </div>
      </div>
    </header>
  );
});

Header.displayName = 'Header';

export default Header;
