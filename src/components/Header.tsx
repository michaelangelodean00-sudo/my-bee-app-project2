
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
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200">
      <div className="container flex h-32 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Logo className="scale-100" />
          <BurgerAdWidget />
        </div>
        
        <div className="flex items-center gap-3">
          {/* Mobile menu button with notification indicator */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden relative"
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
