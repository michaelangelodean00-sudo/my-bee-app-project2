
import { Link } from "react-router-dom";
import { 
  Building2,
  ShoppingBag,
  Drum
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: Building2, label: "Business", path: "/businesses" },
  { icon: Drum, label: "Events", path: "/events" },
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
              <item.icon size={20} className="text-bee-blue" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
