
import { X } from "lucide-react";

const McdonaldsAdWidget = () => {
  const handleAdClick = () => {
    window.open('https://www.mcdonalds.com', '_blank', 'noopener,noreferrer');
  };

  return (
    <div 
      className="bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-4 rounded-xl flex items-center justify-between mr-2 md:max-w-md lg:max-w-lg xl:max-w-xl cursor-pointer hover:scale-105 hover:shadow-xl transition-all duration-300 h-20 sm:h-24 md:h-28 border-2 border-white/20 shadow-lg backdrop-blur-sm"
      onClick={handleAdClick}
    >
      <div className="flex items-center w-full">
        <img 
          src="https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=64&h=64&auto=format&fit=crop"
          alt="McDonald's Promotion" 
          className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-xl object-cover mr-3 md:mr-4 border-2 border-white/30 shadow-md"
        />
        <div className="flex-1">
          <p className="text-sm md:text-base lg:text-lg font-black tracking-tight whitespace-nowrap">
            Try the new
          </p>
          <p className="text-base md:text-lg lg:text-xl font-extrabold text-yellow-300 drop-shadow-sm whitespace-nowrap">
            McSaver Deal
          </p>
        </div>
        <div className="ml-3 flex-shrink-0">
          <button className="bg-yellow-400 hover:bg-yellow-300 text-red-800 font-bold py-2 px-4 rounded-lg text-sm border border-yellow-300 transition-all duration-200 hover:scale-105 shadow-md">
            Order Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default McdonaldsAdWidget;
