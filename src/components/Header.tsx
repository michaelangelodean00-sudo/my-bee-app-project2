
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, MessageSquare, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import Logo from "./Logo";
import SearchBar from "./SearchBar";
import WeatherWidget from "./WeatherWidget";

interface HeaderProps {
  toggleMobileSidebar: () => void;
}

const Header = ({ toggleMobileSidebar }: HeaderProps) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 pb-2">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Logo />
        </div>
        
        <div className="hidden md:flex mx-4">
          <SearchBar />
        </div>
        
        <div className="flex items-center gap-3">
          <WeatherWidget />
          
          <div className="md:flex items-center gap-1 hidden">
            <Button variant="ghost" size="icon" className="text-gray-600">
              <Bell size={20} />
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-600">
              <MessageSquare size={20} />
            </Button>
          </div>
          
          <div className="relative">
            <Button 
              variant="ghost" 
              className="rounded-full flex items-center gap-2 p-1 pl-1 pr-2"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <ChevronDown size={16} className="text-gray-600 hidden sm:block" />
            </Button>
            
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 py-1 animate-fade-in">
                <Link 
                  to="/profile" 
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Your Profile
                </Link>
                <Link 
                  to="/settings" 
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Settings
                </Link>
                <div className="border-t border-gray-200 my-1"></div>
                <button 
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
