
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useAdAnalytics } from "@/hooks/useAdAnalytics";
import AdPerformanceMetrics from "./AdPerformanceMetrics";

interface Ad {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  linkUrl: string;
}

const ads: Ad[] = [
  {
    id: "ad1",
    title: "Summer Festival Weekend",
    description: "Join us for the biggest summer celebration with live music, food, and activities for the whole family.",
    imageUrl: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1200&h=1600&q=90&fm=webp&fit=crop",
    linkUrl: "#summer-festival"
  },
  {
    id: "ad2",
    title: "Local Business Spotlight",
    description: "Discover the best local businesses and exclusive deals just for B.E.E App members.",
    imageUrl: "https://images.unsplash.com/photo-1525328437458-0c4d4db7cab4?w=1200&h=1600&q=90&fm=webp&fit=crop",
    linkUrl: "#business-spotlight"
  },
  {
    id: "ad3",
    title: "Island Tour Specials",
    description: "Explore the beauty of our islands with special discounts on tours and excursions.",
    imageUrl: "https://images.unsplash.com/photo-1548574505-5e239809ee19?w=1200&h=1600&q=90&fm=webp&fit=crop",
    linkUrl: "#island-tours"
  }
];

const AdWidget = ({ showMetrics = false }: { showMetrics?: boolean }) => {
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [dismissed, setDismissed] = useState(false);
  const [isAnimating, setIsAnimating] = useState(true);
  const [progress, setProgress] = useState(0);
  const { trackImpression, trackClick, getAdPerformance } = useAdAnalytics();

  // Track impression on ad change
  useEffect(() => {
    trackImpression(ads[currentAdIndex].id);
  }, [currentAdIndex, trackImpression]);

  const performance = getAdPerformance(ads[currentAdIndex].id);
  
  useEffect(() => {
    // Animation trigger
    setIsAnimating(true);
    const animationTimer = setTimeout(() => setIsAnimating(false), 600);
    
    // Progress bar
    setProgress(0);
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 0;
        return prev + 2;
      });
    }, 100);
    
    // Ad rotation
    const rotationInterval = setInterval(() => {
      setCurrentAdIndex((prevIndex) => (prevIndex + 1) % ads.length);
    }, 5000);
    
    return () => {
      clearTimeout(animationTimer);
      clearInterval(progressInterval);
      clearInterval(rotationInterval);
    };
  }, [currentAdIndex]);
  
  if (dismissed) {
    return null;
  }
  
  const currentAd = ads[currentAdIndex];
  
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary via-accent to-primary opacity-95 animate-gradient" />
      
      {/* Glass morphism overlay */}
      <div className="absolute inset-0 glass-overlay" />
      
      {/* Floating close button */}
      <button 
        onClick={() => setDismissed(true)}
        className="absolute top-6 right-6 z-50 glass-button rounded-full p-3 text-foreground hover:text-primary transition-all duration-300 hover:scale-110 hover:rotate-90 shadow-lg"
        aria-label="Dismiss ad"
      >
        <X size={24} />
      </button>
      
      {/* Main content */}
      <div className="relative z-10 max-w-6xl mx-auto w-full px-6 md:px-12 py-12">
        <div 
          className={`flex flex-col items-center text-center transition-all duration-600 ${
            isAnimating ? 'opacity-0 translate-y-8' : 'opacity-100 translate-y-0'
          }`}
        >
          {/* Image with glass card */}
          <div className="mb-10 relative group">
            <div className="glass-premium rounded-3xl p-2 shadow-2xl hover:shadow-glow-lg transition-all duration-500 hover:scale-[1.02]">
              <div className="relative overflow-hidden rounded-2xl">
                {/* Gradient overlay for text contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <img 
                  src={currentAd.imageUrl} 
                  alt={currentAd.title} 
                  className="h-[500px] md:h-[600px] w-full max-w-md object-cover transform transition-transform duration-700 group-hover:scale-105"
                  loading="eager"
                  decoding="async"
                />
                
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </div>
            </div>
          </div>
          
          {/* Text content with glass card */}
          <div className="glass-card rounded-3xl p-8 md:p-12 max-w-3xl backdrop-blur-xl">
            <h3 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent leading-tight">
              {currentAd.title}
            </h3>
            
            <p className="text-lg md:text-xl lg:text-2xl mb-10 text-foreground/90 leading-relaxed font-body">
              {currentAd.description}
            </p>
            
            {/* Ad Performance Metrics - only visible to admin/ad owner */}
            {showMetrics && (
              <div className="mb-4 flex justify-center">
                <AdPerformanceMetrics
                  impressions={performance.totalImpressions}
                  clicks={performance.totalClicks}
                  views={performance.totalViews}
                  variant="inline"
                />
              </div>
            )}

            {/* Premium gradient button */}
            <a 
              href={currentAd.linkUrl} 
              onClick={() => trackClick(currentAd.id)}
              className="inline-flex items-center justify-center px-10 py-5 text-xl md:text-2xl font-semibold rounded-2xl
                bg-gradient-to-r from-primary via-secondary to-accent
                text-primary-foreground
                shadow-glow hover:shadow-glow-lg
                transform hover:scale-105 hover:-translate-y-1
                transition-all duration-300
                relative overflow-hidden group/btn"
            >
              <span className="relative z-10">Learn More</span>
              
              {/* Button shimmer */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
            </a>
          </div>
          
          {/* Progress dots */}
          <div className="flex gap-3 mt-10">
            {ads.map((ad, index) => (
              <button
                key={ad.id}
                onClick={() => setCurrentAdIndex(index)}
                className={`relative h-2 rounded-full transition-all duration-300 ${
                  index === currentAdIndex 
                    ? 'w-12 bg-primary shadow-glow' 
                    : 'w-2 bg-foreground/30 hover:bg-foreground/50'
                }`}
                aria-label={`Go to ad ${index + 1}`}
              >
                {index === currentAdIndex && (
                  <div 
                    className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Bottom progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-foreground/10">
        <div 
          className="h-full bg-gradient-to-r from-primary via-secondary to-accent transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default AdWidget;
