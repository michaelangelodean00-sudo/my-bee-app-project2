
import { useState } from "react";
import { X } from "lucide-react";

const McdonaldsAdWidget = () => {
  const [dismissed, setDismissed] = useState(false);
  
  if (dismissed) {
    return null;
  }
  
  return (
    <div className="bg-red-600 text-white px-3 py-2 rounded-lg flex items-center mr-2 relative">
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
      <button 
        onClick={() => setDismissed(true)}
        className="absolute -top-1 -right-1 bg-white text-red-600 rounded-full p-0.5"
        aria-label="Dismiss ad"
      >
        <X size={12} />
      </button>
    </div>
  );
};

export default McdonaldsAdWidget;
