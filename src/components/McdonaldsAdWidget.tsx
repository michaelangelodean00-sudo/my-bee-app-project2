
import { X } from "lucide-react";

const McdonaldsAdWidget = () => {
  return (
    <div className="bg-red-600 text-white px-3 py-2 rounded-lg flex items-center mr-2">
      <div className="flex items-center">
        <img 
          src="https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=64&h=64&auto=format&fit=crop"
          alt="McDonald's Promotion" 
          className="w-8 h-8 rounded-full object-cover mr-2"
        />
        <div>
          <p className="text-xs font-bold whitespace-nowrap">
            Try the new<br />
            <span className="text-yellow-300">McSaver Deal</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default McdonaldsAdWidget;
