
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
    imageSrc: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=256&h=256&q=90&fm=webp&fit=crop",
    altText: "Burger Promotion",
    title: "Try the new",
    highlight: "Deluxe Burger",
    bgColor: "bg-amber-600",
    highlightColor: "text-yellow-300",
    linkUrl: "https://www.mcdonalds.com"
  },
  {
    imageSrc: "https://images.unsplash.com/photo-1525328437458-0c4d4db7cab4?w=256&h=256&q=90&fm=webp&fit=crop",
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
      className={`${currentAd.bgColor} text-white rounded-xl flex items-center transition-all duration-500 ${isRotating ? 'scale-98 opacity-85' : 'scale-100 opacity-100'} cursor-pointer hover:scale-105 hover:shadow-xl active:scale-95 w-full max-w-full min-h-[56px] px-3 py-3 shadow-lg border border-white/10 backdrop-blur-sm overflow-hidden`}
      onClick={handleAdClick}
    >
      <div className="flex items-center w-full min-w-0 gap-2">
        <img 
          src={currentAd.imageSrc}
          alt={currentAd.altText} 
          className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-lg object-cover flex-shrink-0 shadow-md border-2 border-white/20"
          loading="lazy"
          decoding="async"
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

export default BurgerAdWidget;
