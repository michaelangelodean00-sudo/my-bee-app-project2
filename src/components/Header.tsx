
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import Logo from "./Logo";
import BurgerAdWidget from "./BurgerAdWidget";

interface HeaderProps {
  toggleMobileSidebar: () => void;
}

const Header = ({ toggleMobileSidebar }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200">
      <div className="container flex h-32 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Logo className="scale-110" />
        </div>
        
        <div className="flex items-center gap-3">
          <BurgerAdWidget />
        </div>
      </div>
    </header>
  );
};

export default Header;
