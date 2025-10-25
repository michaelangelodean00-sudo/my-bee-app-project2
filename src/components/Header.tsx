
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronDown, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
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
    <header className="sticky top-0 z-50 w-full glass-nav">
      <div className="flex items-center w-full px-2 sm:px-4 py-3 gap-2 sm:gap-3 md:gap-4 min-h-[70px] sm:min-h-[90px] md:min-h-[110px]">
        {/* Logo - mobile optimized */}
        <div className="flex-shrink-0">
          <Logo className="scale-110 sm:scale-100" />
        </div>
        
        {/* Ad widget - full width on mobile, constrained on desktop */}
        <div className="flex-1 min-w-0 md:max-w-sm lg:max-w-lg xl:max-w-xl">
          <BurgerAdWidget />
        </div>
        
        {/* Mobile menu button - touch-friendly */}
        <div className="flex-shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="relative min-w-[44px] min-h-[44px] w-11 h-11 flex-shrink-0 touch-manipulation"
            onClick={toggleMobileSidebar}
          >
            <Menu size={24} />
        {hasAnyNotifications && (
          <div className="absolute -top-1 -right-1">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            <div className="absolute inset-0 w-3 h-3 bg-red-500 rounded-full animate-ping opacity-75" />
          </div>
        )}
        <span className="sr-only">© 2024 B.E.E App Bahamas</span>
      </Button>
    </div>
  </div>

  {/* Copyright Watermark */}
  <div className="absolute top-2 right-4 text-xs text-muted-foreground/30 pointer-events-none select-none">
    © B.E.E App
  </div>
</header>
  );
};

export default Header;
