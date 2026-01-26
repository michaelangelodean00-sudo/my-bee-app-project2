
import { useState, useEffect } from "react";
import { ExternalLink, Sparkles } from "lucide-react";
import { isValidUrl } from "../utils/security";

interface AdContent {
  imageSrc: string;
  altText: string;
  title: string;
  highlight: string;
  gradientFrom: string;
  gradientTo: string;
  highlightColor: string;
  linkUrl: string;
  accentGlow: string;
}

const ads: AdContent[] = [
  {
    imageSrc: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=256&h=256&q=90&fm=webp&fit=crop",
    altText: "Burger Promotion",
    title: "Try the new",
    highlight: "Deluxe Burger",
    gradientFrom: "from-amber-500",
    gradientTo: "to-orange-600",
    highlightColor: "text-amber-200",
    linkUrl: "https://www.mcdonalds.com",
    accentGlow: "shadow-amber-500/30"
  },
  {
    imageSrc: "https://images.unsplash.com/photo-1525328437458-0c4d4db7cab4?w=256&h=256&q=90&fm=webp&fit=crop",
    altText: "Car Promotion",
    title: "New model",
    highlight: "Test drive today",
    gradientFrom: "from-blue-500",
    gradientTo: "to-indigo-600",
    highlightColor: "text-sky-200",
    linkUrl: "https://www.toyota.com",
    accentGlow: "shadow-blue-500/30"
  }
];

const BurgerAdWidget = () => {
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Rotate ads every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentAdIndex((prevIndex) => (prevIndex + 1) % ads.length);
        setIsTransitioning(false);
      }, 300);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const currentAd = ads[currentAdIndex];

  const handleAdClick = () => {
    if (isValidUrl(currentAd.linkUrl)) {
      window.open(currentAd.linkUrl, '_blank', 'noopener,noreferrer');
    } else {
      console.warn('Invalid URL detected:', currentAd.linkUrl);
    }
  };

  return (
    <div 
      className={`
        relative group cursor-pointer w-full overflow-hidden
        bg-gradient-to-r ${currentAd.gradientFrom} ${currentAd.gradientTo}
        rounded-2xl min-h-[60px] px-4 py-3
        shadow-lg ${currentAd.accentGlow}
        border border-white/20
        transition-all duration-500 ease-out
        ${isTransitioning ? 'scale-[0.98] opacity-80' : 'scale-100 opacity-100'}
        ${isHovered ? 'shadow-2xl scale-[1.02]' : ''}
        hover:shadow-2xl hover:scale-[1.02]
        active:scale-[0.98]
      `}
      onClick={handleAdClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 bg-white/5 backdrop-blur-[2px] rounded-2xl" />
      
      {/* Animated shine effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
      
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_30%_50%,white_1px,transparent_1px)] bg-[length:20px_20px]" />
      
      {/* Content */}
      <div className="relative z-10 flex items-center w-full gap-3">
        {/* Image with glow ring */}
        <div className="relative flex-shrink-0">
          <div className={`absolute inset-0 rounded-xl bg-white/30 blur-md scale-110 opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
          <img 
            src={currentAd.imageSrc}
            alt={currentAd.altText} 
            className={`
              relative w-11 h-11 sm:w-13 sm:h-13 md:w-14 md:h-14 
              rounded-xl object-cover 
              border-2 border-white/30
              shadow-lg
              transition-transform duration-300
              ${isHovered ? 'scale-105' : 'scale-100'}
            `}
            loading="lazy"
            decoding="async"
          />
        </div>
        
        {/* Text content with dark backdrop for readability */}
        <div className="min-w-0 flex-1 bg-black/20 backdrop-blur-[1px] rounded-lg px-2 py-1.5">
          <div className="flex items-center gap-1 mb-0.5">
            <Sparkles size={10} className="text-white flex-shrink-0" />
            <span className="text-[10px] sm:text-[11px] font-bold text-white uppercase tracking-wide">
              Sponsored
            </span>
          </div>
          <div className="text-white text-[14px] sm:text-base md:text-lg font-bold leading-snug drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
            {currentAd.title}
          </div>
          <div className={`${currentAd.highlightColor} text-[14px] sm:text-base md:text-lg font-extrabold leading-snug drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]`}>
            {currentAd.highlight}
          </div>
        </div>
        
        {/* CTA Button */}
        <div className="hidden sm:flex flex-shrink-0">
          <div className={`
            flex items-center gap-1.5
            bg-white/20 backdrop-blur-sm
            text-white px-3 py-2 
            rounded-lg text-sm font-bold
            border border-white/20
            shadow-inner
            transition-all duration-300
            group-hover:bg-white/30 group-hover:scale-105
          `}>
            <span>View</span>
            <ExternalLink size={14} className="opacity-80" />
          </div>
        </div>
      </div>
      
      {/* Progress indicator dots */}
      <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
        {ads.map((_, index) => (
          <div
            key={index}
            className={`
              h-1 rounded-full transition-all duration-300
              ${index === currentAdIndex 
                ? 'w-4 bg-white/90' 
                : 'w-1 bg-white/40 hover:bg-white/60'
              }
            `}
          />
        ))}
      </div>
    </div>
  );
};

export default BurgerAdWidget;
