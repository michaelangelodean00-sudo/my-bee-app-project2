import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import Logo from "./Logo";
import BurgerAdWidget from "./BurgerAdWidget";
import { useNotifications } from "../contexts/NotificationContext";

interface HeaderProps {
  toggleMobileSidebar: () => void;
}

const Header = ({ toggleMobileSidebar }: HeaderProps) => {
  const { hasNewBusinessVideos, hasNewEventsVideos, hasNewEcommerceItems } = useNotifications();
  const hasAnyNotifications = hasNewBusinessVideos || hasNewEventsVideos || hasNewEcommerceItems;

  return (
    <header className="sticky top-0 z-50 w-full bg-card/95 backdrop-blur-md border-b border-border">
      <div className="flex items-center w-full px-2 sm:px-4 pt-8 pb-3 sm:py-3 gap-2 sm:gap-4 min-h-[80px] sm:min-h-[72px] md:min-h-[80px]">
        {/* Logo - always visible, scaled down on mobile */}
        <div className="flex-shrink-0">
          <Logo className="scale-75 sm:scale-100" />
        </div>
        
        {/* Ad widget - constrained width on mobile to not push logo out */}
        <div className="flex-1 min-w-0 max-w-[180px] xs:max-w-[220px] sm:max-w-none md:max-w-lg lg:max-w-xl">
          <BurgerAdWidget />
        </div>
        
        {/* Mobile menu button */}
        <div className="flex-shrink-0 md:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="relative w-10 h-10 rounded-lg hover:bg-accent transition-colors"
            onClick={toggleMobileSidebar}
          >
            <Menu size={22} className="text-foreground" />
            {hasAnyNotifications && (
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-destructive rounded-full" />
            )}
            <span className="sr-only">Open menu</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
