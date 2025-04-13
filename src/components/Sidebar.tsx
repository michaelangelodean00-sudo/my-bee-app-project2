
import { Link } from "react-router-dom";
import { 
  Home, 
  Settings,
  LogOut,
  Building2,
  ShoppingBag
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Building2, label: "Business", path: "/businesses" },
  { 
    iconType: "image", 
    iconPath: "/lovable-uploads/fec52d62-5fad-43bf-8596-51b7b6eb49b8.png", 
    label: "Events", 
    path: "/events" 
  },
  { icon: ShoppingBag, label: "E-commerce", path: "/ecommerce" },
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
              {item.iconType === "image" ? (
                <div className="w-5 h-5 flex items-center justify-center">
                  <img src={item.iconPath} alt={`${item.label} icon`} className="w-5 h-5 object-contain" />
                </div>
              ) : (
                <item.icon size={20} className="text-bee-blue" />
              )}
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
