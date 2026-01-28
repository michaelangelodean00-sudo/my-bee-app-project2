
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
        rounded-xl sm:rounded-2xl min-h-[56px] sm:min-h-[60px] px-3 sm:px-4 py-2.5 sm:py-3
        border border-white/20
        transition-all duration-300 ease-out
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
        {/* Image with glow ring and 3D lift effect */}
        <div className="relative flex-shrink-0" style={{ transform: 'translateZ(20px)' }}>
          <div className={`absolute inset-0 rounded-lg sm:rounded-xl bg-white/30 blur-md scale-110 opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
          <img 
            src={currentAd.imageSrc}
            alt={currentAd.altText} 
            className={`
              relative w-20 h-16 sm:w-24 sm:h-20 md:w-28 md:h-24 
              rounded-lg sm:rounded-xl object-cover
              border-2 border-white/30
              shadow-lg
              transition-all duration-300
              ${isHovered ? 'scale-110 shadow-xl' : 'scale-100'}
            `}
            loading="lazy"
            decoding="async"
          />
        </div>
        
        {/* Text content with 3D lift */}
        <div 
          className="min-w-0 flex-1"
          style={{ transform: 'translateZ(15px)' }}
        >
          <div className="flex items-center gap-1.5 mb-1.5">
            <Sparkles size={12} className="text-white flex-shrink-0" />
            <span className="text-[11px] sm:text-xs font-bold text-white uppercase tracking-wide drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
              Ad
            </span>
          </div>
          <div className="text-white text-base sm:text-lg md:text-xl font-bold leading-normal drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] [text-shadow:_0_1px_0_rgb(0_0_0_/_80%)]">
            {currentAd.title}
          </div>
          <div className={`${currentAd.highlightColor} text-base sm:text-lg md:text-xl font-extrabold leading-normal drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] [text-shadow:_0_1px_0_rgb(0_0_0_/_80%)]`}>
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
