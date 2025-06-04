
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronDown, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import Logo from "./Logo";
import BurgerAdWidget from "./BurgerAdWidget";
import SearchBar from "./SearchBar";
import { useNotifications } from "../contexts/NotificationContext";

interface HeaderProps {
  toggleMobileSidebar: () => void;
}

const Header = ({ toggleMobileSidebar }: HeaderProps) => {
  const { hasNewBusinessVideos, hasNewEventsVideos, hasNewEcommerceItems } = useNotifications();
  const hasAnyNotifications = hasNewBusinessVideos || hasNewEventsVideos || hasNewEcommerceItems;

  return (
    <header className="sticky top-0 z-50 w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div className="container flex h-32 items-center justify-between px-4 gap-4">
        {/* Left section - Logo with fixed width container */}
        <div className="flex items-center gap-4 min-w-0">
          <div className="flex-shrink-0 w-auto">
            <Logo className="scale-95" />
          </div>
          {/* Separator to prevent bleeding */}
          <div className="hidden sm:block w-px h-8 bg-gray-200 dark:bg-gray-700 mx-2" />
          {/* Ad widget in its own contained space */}
          <div className="flex-shrink-0 max-w-[180px]">
            <BurgerAdWidget />
          </div>
        </div>
        
        {/* Search Bar - now visible on all screen sizes */}
        <div className="flex flex-1 max-w-md mx-4">
          <SearchBar />
        </div>
        
        {/* Right section - Mobile menu */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="relative"
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
