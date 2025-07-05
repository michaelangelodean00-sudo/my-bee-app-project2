
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
      className={`${currentAd.bgColor} text-white px-1.5 py-2 rounded-md flex items-center transition-all duration-500 ${isRotating ? 'scale-95 opacity-80' : 'scale-100 opacity-100'} w-full max-w-full md:max-w-xs lg:max-w-sm xl:max-w-md cursor-pointer hover:opacity-80 flex-shrink-0 h-12 sm:h-14 overflow-hidden`}
      onClick={handleAdClick}
    >
      <div className="flex items-center w-full min-w-0">
        <img 
          src={currentAd.imageSrc}
          alt={currentAd.altText} 
          className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 rounded-full object-cover mr-1 sm:mr-1.5 md:mr-2 flex-shrink-0"
        />
        <div className="min-w-0 flex-1 overflow-hidden">
          <p className="text-xs leading-tight">
            <span className="block truncate text-xs sm:text-sm md:text-base font-bold">{currentAd.title}</span>
            <span className={`${currentAd.highlightColor} block truncate text-xs md:text-sm`}>{currentAd.highlight}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default BurgerAdWidget;
