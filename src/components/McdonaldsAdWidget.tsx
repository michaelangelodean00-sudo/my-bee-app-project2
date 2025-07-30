
import { X } from "lucide-react";

const McdonaldsAdWidget = () => {
  const handleAdClick = () => {
    window.open('https://www.mcdonalds.com', '_blank', 'noopener,noreferrer');
  };

  return (
    <div 
      className="bg-red-600 text-white rounded-lg flex items-center cursor-pointer hover:bg-red-700 active:scale-95 transition-all duration-200 w-full min-h-[44px] px-3 py-2 sm:px-4 sm:py-3 md:max-w-sm lg:max-w-lg xl:max-w-xl md:min-h-[48px] lg:min-h-[52px] shadow-lg mr-0 md:mr-2"
      onClick={handleAdClick}
    >
      <div className="flex items-center w-full gap-2 sm:gap-3">
        <img 
          src="https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=64&h=64&auto=format&fit=crop"
          alt="McDonald's Promotion" 
          className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full object-cover flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="text-sm sm:text-base md:text-lg font-black leading-tight">Try the new</div>
          <div className="text-yellow-300 text-sm sm:text-base md:text-lg font-extrabold leading-tight truncate">McSaver Deal</div>
        </div>
        <div className="flex-shrink-0">
          <div className="bg-yellow-400 text-red-600 px-2 py-1 sm:px-3 sm:py-1.5 rounded text-xs sm:text-sm font-black min-w-[44px] min-h-[32px] flex items-center justify-center">
            ORDER
          </div>
        </div>
      </div>
    </div>
  );
};

export default McdonaldsAdWidget;
