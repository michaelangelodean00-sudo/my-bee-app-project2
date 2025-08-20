
import { useState, useEffect } from "react";
import { isValidUrl } from "../utils/security";

interface AdContent {
  imageSrc: string;
  altText: string;
  title: string;
  highlight: string;
  bgColor: string;
  highlightColor: string;
  linkUrl: string;
}

const ads: AdContent[] = [
  {
    imageSrc: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=64&h=64&auto=format&fit=crop",
    altText: "McDonald's Promotion",
    title: "Try the new",
    highlight: "McSaver Deal",
    bgColor: "bg-gradient-to-r from-red-600 to-red-500",
    highlightColor: "text-yellow-300",
    linkUrl: "https://www.mcdonalds.com"
  },
  {
    imageSrc: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=64&h=64&auto=format&fit=crop",
    altText: "Burger Special",
    title: "Limited time",
    highlight: "Big Mac Combo",
    bgColor: "bg-gradient-to-r from-amber-600 to-orange-500",
    highlightColor: "text-yellow-200",
    linkUrl: "https://www.mcdonalds.com"
  }
];

const McdonaldsAdWidget = () => {
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [isRotating, setIsRotating] = useState(false);

  // Rotate ads every 10 seconds (reduced frequency)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAdIndex((prevIndex) => (prevIndex + 1) % ads.length);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const currentAd = ads[currentAdIndex];

  const handleAdClick = () => {
    // Validate URL before opening
    if (isValidUrl(currentAd.linkUrl)) {
      window.open(currentAd.linkUrl, '_blank', 'noopener,noreferrer');
    } else {
      console.warn('Invalid URL detected:', currentAd.linkUrl);
    }
  };

  return (
    <div 
      className={`${currentAd.bgColor} text-white rounded-xl flex items-center transition-all duration-300 cursor-pointer hover:brightness-110 hover:scale-105 hover:shadow-xl w-full max-w-full min-h-[56px] px-3 py-3 shadow-lg border border-white/10 backdrop-blur-sm overflow-hidden animate-pulse`}
      onClick={handleAdClick}
    >
      <div className="flex items-center w-full min-w-0 gap-2">
        <img 
          src={currentAd.imageSrc}
          alt={currentAd.altText} 
          className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-lg object-cover flex-shrink-0 shadow-md border-2 border-white/20"
        />
        <div className="min-w-0 flex-1 overflow-hidden pr-1">
          <div className="text-sm sm:text-base md:text-lg font-black leading-tight mb-0.5 truncate">{currentAd.title}</div>
          <div className={`${currentAd.highlightColor} text-sm sm:text-base md:text-lg font-extrabold leading-tight truncate`}>{currentAd.highlight}</div>
        </div>
        <div className="hidden sm:flex flex-shrink-0">
          <div className="bg-white/20 text-white px-3 py-2 rounded-md text-sm font-bold min-w-[45px] max-w-[55px] h-[34px] flex items-center justify-center shadow-md backdrop-blur-sm">
            TAP
          </div>
        </div>
      </div>
    </div>
  );
};

export default McdonaldsAdWidget;
