
import { Link } from "react-router-dom";
import { 
  Home, 
  Users, 
  MessageSquare, 
  Bell, 
  Bookmark, 
  Image, 
  Calendar, 
  Settings,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Users, label: "Friends", path: "/friends" },
  { icon: MessageSquare, label: "Messages", path: "/messages" },
  { icon: Bell, label: "Notifications", path: "/notifications" },
  { icon: Bookmark, label: "Saved", path: "/saved" },
  { icon: Image, label: "Photos", path: "/photos" },
  { icon: Calendar, label: "Events", path: "/events" },
];

const Sidebar = ({ className }: { className?: string }) => {
  return (
    <div className={cn("w-64 p-4 hidden md:block", className)}>
      <div className="space-y-6">
        <div className="flex flex-col gap-1">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <item.icon size={20} className="text-bee-blue" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
        
        <div className="border-t border-gray-200 pt-4">
          <Link
            to="/settings"
            className="flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Settings size={20} className="text-gray-500" />
            <span className="font-medium">Settings</span>
          </Link>
          <button
            className="flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors w-full text-left"
          >
            <LogOut size={20} className="text-gray-500" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
