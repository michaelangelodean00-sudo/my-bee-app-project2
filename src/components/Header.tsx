
import { Link } from "react-router-dom";
import { Search, Bell, MessageSquare, ChevronDown, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";

interface HeaderProps {
  toggleMobileSidebar: () => void;
}

const Header = ({ toggleMobileSidebar }: HeaderProps) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden" 
            onClick={toggleMobileSidebar}
          >
            <Menu className="h-6 w-6" />
          </Button>
          
          <Link to="/" className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/d5511939-48e5-44cf-9f2b-d8f9e829b842.png" 
              alt="B.E.E App Bahamas Logo" 
              className="h-20 sm:h-24 w-auto" // Increased logo size
            />
            <span className="text-2xl font-bold text-bee-blue hidden sm:inline">B.E.E App</span>
          </Link>
        </div>
        
        <div className="hidden md:flex relative max-w-md w-full mx-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            type="search"
            placeholder="Search B.E.E App..."
            className="pl-10 bg-gray-100 border-none"
          />
        </div>
        
        <div className="flex items-center gap-2">
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
