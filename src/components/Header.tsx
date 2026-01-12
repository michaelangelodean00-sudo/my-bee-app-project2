
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState, useEffect } from "react";
import Logo from "./Logo";
import BurgerAdWidget from "./BurgerAdWidget";
import { useNotifications } from "../contexts/NotificationContext";

interface HeaderProps {
  toggleMobileSidebar: () => void;
}

const Header = ({ toggleMobileSidebar }: HeaderProps) => {
  const { hasNewBusinessVideos, hasNewEventsVideos, hasNewEcommerceItems } = useNotifications();
  const hasAnyNotifications = hasNewBusinessVideos || hasNewEventsVideos || hasNewEcommerceItems;
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`
        sticky top-0 z-50 w-full 
        transition-all duration-500 ease-out
        ${isScrolled 
          ? 'glass-nav shadow-lg' 
          : 'bg-gradient-to-r from-background via-background to-background/95'
        }
      `}
    >
      {/* Animated gradient border at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] overflow-hidden">
        <div 
          className="h-full w-[200%] animate-shimmer-slow"
          style={{
            background: 'linear-gradient(90deg, transparent, hsl(var(--primary)), hsl(var(--secondary)), hsl(var(--primary)), transparent)',
          }}
        />
      </div>

      {/* Subtle glow effect behind header */}
      <div 
        className={`
          absolute inset-0 pointer-events-none transition-opacity duration-500
          ${isScrolled ? 'opacity-100' : 'opacity-0'}
        `}
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% 100%, hsl(var(--primary) / 0.08), transparent)',
        }}
      />

      <div className="relative flex items-center w-full px-2 sm:px-4 py-3 gap-2 sm:gap-3 md:gap-4 min-h-[70px] sm:min-h-[90px] md:min-h-[110px]">
        {/* Logo with hover glow effect */}
        <div className="flex-shrink-0 group relative">
          <div 
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl -z-10"
            style={{
              background: 'radial-gradient(circle, hsl(var(--primary) / 0.4), transparent)',
            }}
          />
          <Logo className="scale-110 sm:scale-100 transition-transform duration-300 group-hover:scale-105" />
        </div>
        
        {/* Ad widget with enhanced container */}
        <div className="flex-1 min-w-0 md:max-w-sm lg:max-w-lg xl:max-w-xl relative">
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 blur-sm -z-10" />
          <BurgerAdWidget />
        </div>
        
        {/* Enhanced mobile menu button */}
        <div className="flex-shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className={`
              relative min-w-[44px] min-h-[44px] w-11 h-11 flex-shrink-0 
              touch-manipulation transition-all duration-300
              hover:bg-primary/10 hover:scale-105 active:scale-95
              group overflow-hidden rounded-xl
            `}
            onClick={toggleMobileSidebar}
          >
            {/* Animated background on hover */}
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: 'radial-gradient(circle at center, hsl(var(--primary) / 0.15), transparent)',
              }}
            />
            
            <Menu 
              size={24} 
              className="relative z-10 transition-all duration-300 group-hover:text-primary group-hover:rotate-90" 
            />
            
            {/* Notification indicator with enhanced animation */}
            {hasAnyNotifications && (
              <div className="absolute -top-0.5 -right-0.5 z-20">
                <div className="relative">
                  <div className="w-3.5 h-3.5 bg-gradient-to-br from-red-400 to-red-600 rounded-full shadow-lg" />
                  <div className="absolute inset-0 w-3.5 h-3.5 bg-red-500 rounded-full animate-ping opacity-75" />
                  <div 
                    className="absolute inset-[-2px] rounded-full opacity-50"
                    style={{
                      background: 'radial-gradient(circle, hsl(0 84% 60% / 0.6), transparent)',
                      filter: 'blur(4px)',
                    }}
                  />
                </div>
              </div>
            )}
            
            <span className="sr-only">© 2024 B.E.E App Bahamas</span>
          </Button>
        </div>
      </div>

      {/* Enhanced copyright watermark */}
      <div 
        className="absolute top-3 right-4 text-xs pointer-events-none select-none"
        style={{
          background: 'linear-gradient(90deg, hsl(var(--muted-foreground) / 0.2), hsl(var(--primary) / 0.3), hsl(var(--muted-foreground) / 0.2))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        © B.E.E App
      </div>
    </header>
  );
};

export default Header;
