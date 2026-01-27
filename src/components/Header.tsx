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
      <div className="flex items-center w-full px-2 sm:px-4 pt-12 pb-3 sm:py-3 gap-2 sm:gap-4 min-h-[96px] sm:min-h-[72px] md:min-h-[80px]">
        {/* Logo - always visible, larger on mobile */}
        <div className="flex-shrink-0 animate-logo-entrance">
          <Logo className="scale-100 sm:scale-100" />
        </div>
        
        {/* Enhanced animated separator */}
        <div className="flex-shrink-0 h-10 sm:h-12 md:h-14 w-1 sm:w-1.5 relative overflow-hidden">
          {/* Glow backdrop */}
          <div className="absolute inset-0 bg-gradient-to-b from-amber-400/0 via-amber-400/20 to-amber-400/0 blur-sm" />
          
          {/* Primary gradient line */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/50 to-transparent rounded-full" />
          
          {/* Fast shimmer */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-300/80 to-transparent animate-shimmer-vertical rounded-full" />
          
          {/* Slow shimmer offset */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-500/60 to-transparent animate-shimmer-vertical-slow rounded-full" style={{ animationDelay: '1s' }} />
          
          {/* Top orb */}
          <div className="absolute top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gradient-to-br from-amber-300 to-amber-500 shadow-[0_0_10px_3px_rgba(251,191,36,0.7)] animate-pulse" style={{ animationDelay: '0.3s' }} />
          
          {/* Center orb - larger */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-gradient-to-br from-amber-200 to-amber-400 shadow-[0_0_12px_4px_rgba(251,191,36,0.8)] animate-glow" />
          
          {/* Bottom orb */}
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gradient-to-br from-amber-300 to-amber-500 shadow-[0_0_10px_3px_rgba(251,191,36,0.7)] animate-pulse" style={{ animationDelay: '0.6s' }} />
        </div>
        
        {/* Ad widget - constrained width on mobile to not push logo out */}
        <div className="flex-1 min-w-0 max-w-[180px] xs:max-w-[220px] sm:max-w-none md:max-w-lg lg:max-w-xl animate-fade-in" style={{ animationDelay: '0.2s' }}>
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
