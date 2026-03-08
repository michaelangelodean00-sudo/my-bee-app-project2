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
      {/* All viewports: same horizontal layout — logo | ad | menu button */}
      <div className="flex items-center w-full px-3 sm:px-4 py-2 sm:py-3 gap-2 sm:gap-4 min-h-[64px] sm:min-h-[72px] md:min-h-[80px]">
        {/* Logo */}
        <div className="flex-shrink-0 animate-logo-entrance">
          <Logo />
        </div>

        {/* Ad widget — fills remaining space */}
        <div className="flex-1 min-w-0 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <BurgerAdWidget />
        </div>

        {/* Hamburger — mobile & tablet only */}
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
