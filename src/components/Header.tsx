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
    <header className="sticky top-0 z-50 w-full bg-card/95 backdrop-blur-md border-b border-border animate-fade-in-down overflow-hidden">
      {/* Honeycomb pattern backdrop */}
      <div className="absolute inset-0 -z-10 opacity-[0.04] dark:opacity-[0.06]">
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="honeycomb-header" x="0" y="0" width="56" height="100" patternUnits="userSpaceOnUse">
              <path 
                d="M28 66L0 50L0 16L28 0L56 16L56 50L28 66Z" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="1"
                className="text-amber-500"
              />
              <path 
                d="M28 166L0 150L0 116L28 100L56 116L56 150L28 166Z" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="1"
                className="text-amber-500"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#honeycomb-header)" />
        </svg>
      </div>
      
      {/* Animated gradient overlay */}
      <div 
        className="absolute inset-0 -z-10 bg-gradient-to-r from-amber-500/5 via-transparent to-amber-500/5"
        style={{
          animation: 'gradient-shift 8s ease-in-out infinite',
        }}
      />
      
      <style>{`
        @keyframes gradient-shift {
          0%, 100% { opacity: 0.3; background-position: 0% 50%; }
          50% { opacity: 0.6; background-position: 100% 50%; }
        }
      `}</style>
      
      <div className="flex items-center w-full px-2 sm:px-4 pt-12 pb-3 sm:py-3 gap-2 sm:gap-4 min-h-[96px] sm:min-h-[72px] md:min-h-[80px] relative">
        {/* Logo - always visible, larger on mobile */}
        <div className="flex-shrink-0 animate-logo-entrance">
          <Logo className="scale-100 sm:scale-100" />
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
