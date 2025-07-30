import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { isValidUrl } from "../utils/security";

interface AdContent {
  imageSrc: string;
  altText: string;
  title: string;
  description: string;
  bgColor: string;
  textColor: string;
  linkUrl: string;
}

const stickyAds: AdContent[] = [
  {
    imageSrc: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=80&h=80&auto=format&fit=crop",
    altText: "Pizza Special",
    title: "🍕 50% OFF Pizza Night!",
    description: "Limited time offer - Order now",
    bgColor: "bg-red-600",
    textColor: "text-white",
    linkUrl: "https://www.dominos.com"
  },
  {
    imageSrc: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=80&h=80&auto=format&fit=crop",
    altText: "Coffee Deal",
    title: "☕ Buy 2 Get 1 FREE Coffee",
    description: "Valid until midnight",
    bgColor: "bg-amber-700",
    textColor: "text-white",
    linkUrl: "https://www.starbucks.com"
  }
];

const StickyAdBanner = () => {
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  // Rotate ads every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAdIndex((prevIndex) => (prevIndex + 1) % stickyAds.length);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const currentAd = stickyAds[currentAdIndex];

  const handleAdClick = () => {
    if (isValidUrl(currentAd.linkUrl)) {
      window.open(currentAd.linkUrl, '_blank', 'noopener,noreferrer');
    } else {
      console.warn('Invalid URL detected:', currentAd.linkUrl);
    }
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div 
        className={`${currentAd.bgColor} ${currentAd.textColor} cursor-pointer shadow-lg transition-all duration-300 hover:shadow-xl`}
        onClick={handleAdClick}
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img 
                src={currentAd.imageSrc}
                alt={currentAd.altText} 
                className="w-12 h-12 rounded-full object-cover flex-shrink-0"
              />
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-lg md:text-xl truncate">
                  {currentAd.title}
                </h3>
                <p className="text-sm opacity-90 truncate">
                  {currentAd.description}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="ml-4 p-2 hover:bg-white/20 rounded-full transition-colors flex-shrink-0"
              aria-label="Close ad"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StickyAdBanner;