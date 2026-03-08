
import { useState, useEffect, useRef, MouseEvent } from "react";
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
    imageSrc: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=640&h=360&q=90&fm=webp&fit=crop",
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
    imageSrc: "https://images.unsplash.com/photo-1525328437458-0c4d4db7cab4?w=640&h=360&q=90&fm=webp&fit=crop",
    altText: "Car Promotion",
    title: "New model",
    highlight: "Test drive today",
    gradientFrom: "from-blue-500",
    gradientTo: "to-indigo-600",
    highlightColor: "text-sky-200",
    linkUrl: "https://www.toyota.com",
    accentGlow: "shadow-blue-500/30"
  },
  {
    imageSrc: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=640&h=360&q=90&fm=webp&fit=crop",
    altText: "Restaurant Special",
    title: "Tonight only",
    highlight: "50% Off Dinner",
    gradientFrom: "from-rose-500",
    gradientTo: "to-pink-600",
    highlightColor: "text-rose-200",
    linkUrl: "https://www.opentable.com",
    accentGlow: "shadow-rose-500/30"
  },
  {
    imageSrc: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=640&h=360&q=90&fm=webp&fit=crop",
    altText: "Spa Retreat",
    title: "Relax & unwind",
    highlight: "Spa Day Packages",
    gradientFrom: "from-teal-500",
    gradientTo: "to-emerald-600",
    highlightColor: "text-teal-200",
    linkUrl: "https://www.spafinder.com",
    accentGlow: "shadow-teal-500/30"
  },
  {
    imageSrc: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=640&h=360&q=90&fm=webp&fit=crop",
    altText: "Water Sports",
    title: "Adventure awaits",
    highlight: "Water Sports 20% Off",
    gradientFrom: "from-cyan-500",
    gradientTo: "to-blue-600",
    highlightColor: "text-cyan-200",
    linkUrl: "https://www.watersports.com",
    accentGlow: "shadow-cyan-500/30"
  },
  {
    imageSrc: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=640&h=360&q=90&fm=webp&fit=crop",
    altText: "Coffee Shop",
    title: "Fresh brewed",
    highlight: "Free Coffee Today",
    gradientFrom: "from-stone-600",
    gradientTo: "to-amber-700",
    highlightColor: "text-amber-200",
    linkUrl: "https://www.starbucks.com",
    accentGlow: "shadow-stone-500/30"
  }
];

const BurgerAdWidget = () => {
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

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

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate tilt based on mouse position relative to center
    const rotateX = ((e.clientY - centerY) / (rect.height / 2)) * -8;
    const rotateY = ((e.clientX - centerX) / (rect.width / 2)) * 8;
    
    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  const handleAdClick = () => {
    if (isValidUrl(currentAd.linkUrl)) {
      window.open(currentAd.linkUrl, '_blank', 'noopener,noreferrer');
    } else {
      console.warn('Invalid URL detected:', currentAd.linkUrl);
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`
        relative group cursor-pointer w-full overflow-hidden
        bg-gradient-to-r ${currentAd.gradientFrom} ${currentAd.gradientTo}
        rounded-xl sm:rounded-2xl min-h-[56px] sm:min-h-[72px] px-2 sm:px-4 py-2 sm:py-3
        border border-white/20
        transition-all duration-300 ease-out touch-manipulation
        ${isTransitioning ? 'scale-[0.98] opacity-80' : 'scale-100 opacity-100'}
        active:scale-[0.98]
      `}
      style={{
        transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) ${isHovered ? 'scale(1.02)' : 'scale(1)'}`,
        boxShadow: isHovered 
          ? `0 25px 50px -12px rgba(0, 0, 0, 0.35), 0 0 30px ${currentAd.gradientFrom === 'from-amber-500' ? 'rgba(245, 158, 11, 0.3)' : 'rgba(59, 130, 246, 0.3)'}`
          : `0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)`,
        transformStyle: 'preserve-3d',
      }}
      onClick={handleAdClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 bg-white/5 backdrop-blur-[2px] rounded-2xl" />
      
      {/* Animated shine effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
      
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_30%_50%,white_1px,transparent_1px)] bg-[length:20px_20px]" />
      
      {/* Content */}
      <div className="relative z-10 flex items-center w-full gap-2 sm:gap-3">
        {/* Image */}
        <div 
          className="relative flex-shrink-0 w-[80px] h-[45px] sm:w-[112px] sm:h-[63px] md:w-[160px] md:h-[90px] overflow-hidden rounded-lg sm:rounded-xl border-2 border-white/30 shadow-lg"
          style={{ transform: 'translateZ(20px)' }}
        >
          <div className={`absolute inset-0 bg-white/30 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10`} />
          <img 
            src={currentAd.imageSrc}
            alt={currentAd.altText} 
            className={`
              absolute inset-0 w-full h-full object-cover
              transition-transform duration-300
              ${isHovered ? 'scale-110' : 'scale-100'}
            `}
            loading="lazy"
            decoding="async"
          />
        </div>
        
        {/* Text content */}
        <div 
          className="min-w-0 flex-1 ml-2 sm:ml-4 md:ml-8"
          style={{ transform: 'translateZ(15px)' }}
        >
          <div className="flex items-center gap-1 mb-0.5 sm:mb-1.5">
            <Sparkles size={10} className="text-white flex-shrink-0" />
            <span className="text-[9px] sm:text-[11px] font-bold text-white uppercase tracking-wide drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
              Ad
            </span>
          </div>
          <div className="text-white text-xs sm:text-base md:text-xl font-bold leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] [text-shadow:_0_1px_0_rgb(0_0_0_/_80%)] truncate">
            {currentAd.title}
          </div>
          <div className={`${currentAd.highlightColor} text-xs sm:text-base md:text-xl font-extrabold leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] [text-shadow:_0_1px_0_rgb(0_0_0_/_80%)] truncate`}>
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
