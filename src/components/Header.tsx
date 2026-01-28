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
    <header className="sticky top-0 z-50 w-full bg-card/95 backdrop-blur-md border-b border-border animate-fade-in-down">
      {/* Mobile: Stacked layout for better ad readability */}
      <div className="flex flex-col sm:hidden px-3 pt-10 pb-2 gap-2">
        <div className="flex items-center justify-between gap-3">
          <div className="flex-shrink-0 animate-logo-entrance">
            <Logo className="scale-100" />
          </div>
          
          {/* Decorative divider with honey/bee accent */}
          <div className="flex-1 flex items-center gap-2 px-2">
            <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-primary/50" />
            <div className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-pulse" />
            <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent via-primary/30 to-primary/50" />
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            className="relative w-10 h-10 rounded-lg hover:bg-accent transition-colors flex-shrink-0"
            onClick={toggleMobileSidebar}
          >
            <Menu size={22} className="text-foreground" />
            {hasAnyNotifications && (
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-destructive rounded-full" />
            )}
            <span className="sr-only">Open menu</span>
          </Button>
        </div>
        <div className="w-full animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <BurgerAdWidget />
        </div>
      </div>
      
      {/* Tablet & Desktop: Horizontal layout */}
      <div className="hidden sm:flex items-center w-full px-4 py-3 gap-4 min-h-[72px] md:min-h-[80px]">
        <div className="flex-shrink-0 animate-logo-entrance">
          <Logo className="scale-100" />
        </div>
        
        <div className="flex-1 min-w-0 md:max-w-lg lg:max-w-xl animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <BurgerAdWidget />
        </div>
        
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
