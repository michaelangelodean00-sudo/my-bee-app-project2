import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useAdAnalytics } from "../hooks/useAdAnalytics";

interface Ad {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  linkUrl: string;
  bgColor: string;
  textColor: string;
}

const stickyAds: Ad[] = [
  {
    id: "sticky-1",
    title: "Summer Festival Weekend",
    description: "Join us for the biggest summer celebration!",
    imageUrl: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=120&h=120&auto=format&fit=crop",
    linkUrl: "#summer-festival",
    bgColor: "bg-gradient-to-r from-bee-yellow to-bee-orange",
    textColor: "text-bee-black"
  },
  {
    id: "sticky-2", 
    title: "Island Tour Specials",
    description: "Explore Bahamas with exclusive discounts!",
    imageUrl: "https://images.unsplash.com/photo-1548574505-5e239809ee19?w=120&h=120&auto=format&fit=crop",
    linkUrl: "#island-tours",
    bgColor: "bg-gradient-to-r from-bee-blue to-bee-darkblue",
    textColor: "text-white"
  }
];

interface StickyAdBannerProps {
  position?: 'top' | 'bottom';
  className?: string;
}

const StickyAdBanner = ({ position = 'bottom', className = '' }: StickyAdBannerProps) => {
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [dismissed, setDismissed] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const { trackImpression, trackClick } = useAdAnalytics();

  useEffect(() => {
    // Show banner after slight delay for better UX
    const timer = setTimeout(() => setIsVisible(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!dismissed && isVisible) {
      const interval = setInterval(() => {
        setCurrentAdIndex((prevIndex) => (prevIndex + 1) % stickyAds.length);
      }, 8000); // Rotate every 8 seconds
      
      return () => clearInterval(interval);
    }
  }, [dismissed, isVisible]);

  useEffect(() => {
    if (isVisible && !dismissed) {
      trackImpression(stickyAds[currentAdIndex].id);
    }
  }, [currentAdIndex, isVisible, dismissed, trackImpression]);

  if (dismissed || !isVisible) return null;

  const currentAd = stickyAds[currentAdIndex];
  const positionClasses = position === 'top' 
    ? 'top-16 md:top-20' // Below header
    : 'bottom-4';

  const handleAdClick = () => {
    trackClick(currentAd.id);
    window.open(currentAd.linkUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div 
      className={`fixed ${positionClasses} left-4 right-4 z-50 animate-slide-up ${className}`}
      style={{ animationDelay: '0.5s' }}
    >
      <div className={`${currentAd.bgColor} ${currentAd.textColor} rounded-xl shadow-lg border border-white/20 backdrop-blur-sm transition-all duration-500 hover:scale-[1.02] hover:shadow-xl`}>
        {/* Mobile Layout */}
        <div className="md:hidden flex items-center p-3 gap-3">
          <img 
            src={currentAd.imageUrl}
            alt={currentAd.title}
            className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-sm truncate">{currentAd.title}</h4>
            <p className="text-xs opacity-90 truncate">{currentAd.description}</p>
          </div>
          <button
            onClick={handleAdClick}
            className="bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex-shrink-0"
          >
            View
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="text-current/60 hover:text-current/80 ml-1"
            aria-label="Dismiss ad"
          >
            <X size={16} />
          </button>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:flex items-center p-4 gap-4">
          <img 
            src={currentAd.imageUrl}
            alt={currentAd.title}
            className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
          />
          <div className="flex-1">
            <h4 className="font-bold text-lg mb-1">{currentAd.title}</h4>
            <p className="text-sm opacity-90">{currentAd.description}</p>
          </div>
          <button
            onClick={handleAdClick}
            className="bg-white/20 hover:bg-white/30 px-6 py-2.5 rounded-lg font-medium transition-colors"
          >
            Learn More
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="text-current/60 hover:text-current/80 ml-2"
            aria-label="Dismiss ad"
          >
            <X size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StickyAdBanner;