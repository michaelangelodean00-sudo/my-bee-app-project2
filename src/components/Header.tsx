
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
    <header className="sticky top-0 z-50 w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div className="container flex h-32 items-center justify-between px-4 gap-2">
        {/* Left section - Logo with controlled width */}
        <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
          <div className="flex-shrink-0">
            <Logo />
          </div>
          {/* Separator - hidden on very small screens */}
          <div className="hidden sm:block w-px h-8 bg-gray-200 dark:bg-gray-700" />
          {/* Ad widget with extended width */}
          <div className="flex-1 max-w-[140px] xs:max-w-[180px] sm:max-w-[240px] md:max-w-[300px] lg:max-w-[350px]">
            <BurgerAdWidget />
          </div>
        </div>
        
        {/* Right section - Mobile menu with guaranteed space */}
        <div className="flex items-center flex-shrink-0 ml-3 min-w-[44px]">
          <Button
            variant="ghost"
            size="icon"
            className="relative h-10 w-10 flex-shrink-0"
            onClick={toggleMobileSidebar}
          >
            <Menu size={24} />
            {hasAnyNotifications && (
              <div className="absolute -top-1 -right-1">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                <div className="absolute inset-0 w-3 h-3 bg-red-500 rounded-full animate-ping opacity-75" />
              </div>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
