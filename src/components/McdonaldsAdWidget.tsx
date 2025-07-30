
import { X } from "lucide-react";

const McdonaldsAdWidget = () => {
  const handleAdClick = () => {
    window.open('https://www.mcdonalds.com', '_blank', 'noopener,noreferrer');
  };

  return (
    <div 
      className="bg-gradient-to-r from-red-600 to-red-500 text-white rounded-xl flex items-center cursor-pointer hover:from-red-500 hover:to-red-400 hover:scale-105 hover:shadow-xl active:scale-95 transition-all duration-300 w-full min-h-[56px] px-4 py-3 shadow-lg border border-red-400/20 backdrop-blur-sm"
      onClick={handleAdClick}
    >
      <div className="flex items-center w-full gap-3 sm:gap-4">
        <img 
          src="https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=64&h=64&auto=format&fit=crop"
          alt="McDonald's Promotion" 
          className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl object-cover flex-shrink-0 shadow-md border-2 border-yellow-300/30"
        />
        <div className="flex-1 min-w-0">
          <div className="text-base sm:text-lg md:text-xl font-black leading-tight mb-1">Try the new</div>
          <div className="text-yellow-300 text-base sm:text-lg md:text-xl font-extrabold leading-tight">McSaver Deal</div>
        </div>
        <div className="flex-shrink-0">
          <div className="bg-yellow-400 text-red-600 px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg text-sm sm:text-base font-black min-w-[52px] min-h-[40px] flex items-center justify-center shadow-md">
            ORDER
          </div>
        </div>
      </div>
    </div>
  );
};

export default McdonaldsAdWidget;
