
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { SidebarEventIcon } from "./icons/EventIcons";
import { 
  EventSvgIcon as HomeIcon, 
  SettingsIcon,
  LogOutIcon,
  Building2Icon,
  ShoppingBagIcon
} from "./icons/EventIcons";

const menuItems = [
  { icon: HomeIcon, label: "Home", path: "/" },
  { icon: Building2Icon, label: "Business", path: "/businesses" },
  { 
    iconType: "event", 
    eventIcon: "crowd", // Changed to our new crowd icon
    label: "Events", 
    path: "/events" 
  },
  { icon: ShoppingBagIcon, label: "E-commerce", path: "/ecommerce" },
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
              {item.iconType === "event" ? (
                <SidebarEventIcon type={item.eventIcon as any} />
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
            <SettingsIcon size={20} className="text-gray-500" />
            <span className="font-medium">Settings</span>
          </Link>
          <button
            className="flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors w-full text-left"
          >
            <LogOutIcon size={20} className="text-gray-500" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
