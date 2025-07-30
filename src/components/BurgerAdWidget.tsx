
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
      className={`${currentAd.bgColor} text-white px-4 py-4 rounded-xl flex items-center justify-between transition-all duration-500 ${isRotating ? 'scale-95 opacity-80' : 'scale-100 opacity-100'} w-full max-w-full md:max-w-md lg:max-w-lg xl:max-w-xl cursor-pointer hover:scale-105 hover:shadow-xl flex-shrink-0 h-20 sm:h-24 md:h-28 overflow-hidden border-2 border-white/20 shadow-lg backdrop-blur-sm`}
      onClick={handleAdClick}
    >
      <div className="flex items-center w-full min-w-0">
        <img 
          src={currentAd.imageSrc}
          alt={currentAd.altText} 
          className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-18 lg:h-18 rounded-xl object-cover mr-3 sm:mr-4 md:mr-5 flex-shrink-0 border-2 border-white/30 shadow-md"
        />
        <div className="min-w-0 flex-1 overflow-hidden">
          <div className="text-sm leading-tight">
            <span className="block truncate text-sm sm:text-base md:text-lg lg:text-xl font-black tracking-tight">{currentAd.title}</span>
            <span className={`${currentAd.highlightColor} block truncate text-base sm:text-lg md:text-xl lg:text-2xl font-extrabold drop-shadow-sm`}>{currentAd.highlight}</span>
          </div>
        </div>
        <div className="ml-3 flex-shrink-0">
          <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-bold py-2 px-4 rounded-lg text-sm border border-white/30 transition-all duration-200 hover:scale-105 shadow-md">
            Shop Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default BurgerAdWidget;
