
import { X } from "lucide-react";

const McdonaldsAdWidget = () => {
  const handleAdClick = () => {
    window.open('https://www.mcdonalds.com', '_blank', 'noopener,noreferrer');
  };

  return (
    <div 
      className="bg-gradient-to-r from-red-600 to-red-500 text-white rounded-xl flex items-center cursor-pointer hover:from-red-500 hover:to-red-400 hover:scale-105 hover:shadow-xl active:scale-95 transition-all duration-300 w-full max-w-full min-h-[56px] px-3 py-3 shadow-lg border border-red-400/20 backdrop-blur-sm overflow-hidden"
      onClick={handleAdClick}
    >
      <div className="flex items-center w-full min-w-0 gap-2 sm:gap-3">
        <img 
          src="https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=64&h=64&auto=format&fit=crop"
          alt="McDonald's Promotion" 
          className="w-12 h-12 sm:w-13 sm:h-13 md:w-14 md:h-14 rounded-lg object-cover flex-shrink-0 shadow-md border-2 border-yellow-300/30"
        />
        <div className="flex-1 min-w-0 overflow-hidden pr-2">
          <div className="text-base sm:text-base md:text-lg font-black leading-tight mb-0.5 truncate">Try the new</div>
          <div className="text-yellow-300 text-base sm:text-base md:text-lg font-extrabold leading-tight truncate">McSaver Deal</div>
        </div>
        <div className="flex-shrink-0 ml-auto">
          <div className="bg-yellow-400 text-red-600 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-md text-sm sm:text-sm font-black min-w-[50px] max-w-[60px] h-[34px] flex items-center justify-center shadow-md">
            ORDER
          </div>
        </div>
      </div>
    </div>
  );
};

export default McdonaldsAdWidget;
