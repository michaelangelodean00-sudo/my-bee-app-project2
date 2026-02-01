import { memo } from "react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import Logo from "./Logo";
import BurgerAdWidget from "./BurgerAdWidget";
import { useNotifications } from "../contexts/NotificationContext";

interface HeaderProps {
  toggleMobileSidebar: () => void;
}

const Header = memo(({ toggleMobileSidebar }: HeaderProps) => {
  const { hasNewBusinessVideos, hasNewEventsVideos, hasNewEcommerceItems } = useNotifications();
  const hasAnyNotifications = hasNewBusinessVideos || hasNewEventsVideos || hasNewEcommerceItems;

  return (
    <header className="sticky top-0 z-50 w-full bg-card/95 backdrop-blur-md border-b border-border animate-fade-in-down">
      {/* Mobile: Centered logo with absolute menu button */}
      <div className="flex flex-col sm:hidden px-3 pt-10 pb-2 gap-2">
        <div className="relative flex items-center justify-center">
          <div className="animate-logo-entrance">
            <Logo className="scale-100" />
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 min-w-[44px] min-h-[44px] w-11 h-11 rounded-lg hover:bg-accent active:bg-accent/80 active:scale-95 transition-all touch-manipulation z-10"
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
        <div className="w-full animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <BurgerAdWidget />
        </div>
      </div>
      
      {/* Tablet & Desktop: Horizontal layout */}
      <div className="hidden sm:flex items-center justify-center w-full px-4 py-3 gap-4 min-h-[72px] md:min-h-[80px]">
        <div className="flex-shrink-0 animate-logo-entrance">
          <Logo className="scale-100" />
        </div>
        
        {/* Desktop: Slightly left of center ad widget */}
        <div className="flex-1 min-w-0 md:max-w-lg lg:max-w-xl ml-auto mr-auto md:mr-8 lg:mr-12 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <BurgerAdWidget />
        </div>
        
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
