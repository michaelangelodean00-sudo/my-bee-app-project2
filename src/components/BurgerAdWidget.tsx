
import { useState, useEffect } from "react";
import { Rotate3d } from "lucide-react";
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
    imageSrc: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=64&h=64&auto=format&fit=crop",
    altText: "Burger Promotion",
    title: "Try the new",
    highlight: "Deluxe Burger",
    bgColor: "bg-amber-600",
    highlightColor: "text-yellow-300",
    linkUrl: "https://www.mcdonalds.com"
  },
  {
    imageSrc: "https://images.unsplash.com/photo-1525328437458-0c4d4db7cab4?w=64&h=64&auto=format&fit=crop",
    altText: "Car Promotion",
    title: "New model",
    highlight: "Test drive today",
    bgColor: "bg-blue-600",
    highlightColor: "text-sky-300",
    linkUrl: "https://www.toyota.com"
  }
];

const BurgerAdWidget = () => {
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [isRotating, setIsRotating] = useState(false);

  // Rotate ads every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIsRotating(true);
      setTimeout(() => {
        setCurrentAdIndex((prevIndex) => (prevIndex + 1) % ads.length);
        setIsRotating(false);
      }, 500); // Wait for animation to complete
    }, 5000);

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
      className={`${currentAd.bgColor} text-white rounded-xl flex items-center transition-all duration-500 ${isRotating ? 'scale-98 opacity-85' : 'scale-100 opacity-100'} cursor-pointer hover:scale-105 hover:shadow-xl active:scale-95 w-full min-h-[56px] px-4 py-3 shadow-lg border border-white/10 backdrop-blur-sm`}
      onClick={handleAdClick}
    >
      <div className="flex items-center w-full min-w-0 gap-2 sm:gap-3">
        <img 
          src={currentAd.imageSrc}
          alt={currentAd.altText} 
          className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full object-cover flex-shrink-0"
        />
        <div className="min-w-0 flex-1 overflow-hidden">
          <div className="text-sm sm:text-base md:text-lg font-black leading-tight">{currentAd.title}</div>
          <div className={`${currentAd.highlightColor} text-sm sm:text-base md:text-lg font-extrabold leading-tight truncate`}>{currentAd.highlight}</div>
        </div>
        <div className="flex-shrink-0">
          <div className="bg-white/20 text-white px-2 py-1 sm:px-3 sm:py-1.5 rounded text-xs sm:text-sm font-bold min-w-[44px] min-h-[32px] flex items-center justify-center">
            TAP
          </div>
        </div>
      </div>
    </div>
  );
};

export default BurgerAdWidget;
