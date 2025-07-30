
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
    <header className="sticky top-0 z-50 w-full glass-card border-b border-border/20 backdrop-blur-md">
      <div className="container flex h-20 items-center justify-between px-4 gap-4 max-w-full">
        {/* Left section - Logo */}
        <div className="flex items-center gap-4 min-w-0">
          <div className="flex-shrink-0">
            <Logo />
          </div>
          
          {/* Navigation breadcrumb */}
          <div className="hidden md:flex items-center space-x-2 text-sm text-muted-foreground">
            <span>•</span>
            <span>Welcome to B.E.E Platform</span>
          </div>
        </div>
        
        {/* Center section - Ad widget (hidden on mobile) */}
        <div className="hidden lg:flex flex-1 justify-center max-w-md">
          <BurgerAdWidget />
        </div>
        
        {/* Right section - Actions */}
        <div className="flex items-center space-x-3">
          {/* Notifications indicator */}
          {hasAnyNotifications && (
            <div className="hidden sm:flex items-center space-x-2 text-sm text-primary">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="font-medium">New updates available</span>
            </div>
          )}
          
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="relative lg:hidden"
            onClick={toggleMobileSidebar}
          >
            <Menu size={20} />
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
