import { useState, useEffect } from "react";
import { ExternalLink, Star } from "lucide-react";
import { useAdAnalytics } from "../hooks/useAdAnalytics";

interface SidebarAd {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  linkUrl: string;
  price?: string;
  rating?: number;
  reviews?: number;
  badge?: string;
}

const sidebarAds: SidebarAd[] = [
  {
    id: "sidebar-1",
    title: "Luxury Beach Resort",
    description: "Escape to paradise with our exclusive beachfront accommodations",
    imageUrl: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=300&h=200&auto=format&fit=crop",
    linkUrl: "#beach-resort",
    price: "From $299/night",
    rating: 4.8,
    reviews: 247,
    badge: "Best Seller"
  },
  {
    id: "sidebar-2",
    title: "Island Adventure Tours",
    description: "Discover hidden gems with our expert local guides",
    imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=300&h=200&auto=format&fit=crop",
    linkUrl: "#adventure-tours",
    price: "From $89/person",
    rating: 4.9,
    reviews: 156,
    badge: "Top Rated"
  },
  {
    id: "sidebar-3",
    title: "Gourmet Dining Experience",
    description: "Taste authentic Bahamian cuisine at its finest",
    imageUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=300&h=200&auto=format&fit=crop",
    linkUrl: "#dining",
    price: "From $45/person",
    rating: 4.7,
    reviews: 203,
    badge: "Chef's Choice"
  }
];

interface SidebarAdWidgetProps {
  className?: string;
}

const SidebarAdWidget = ({ className = '' }: SidebarAdWidgetProps) => {
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const { trackImpression, trackClick } = useAdAnalytics();

  useEffect(() => {
    // Show after delay for better UX
    const timer = setTimeout(() => setIsVisible(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isVisible) {
      const interval = setInterval(() => {
        setCurrentAdIndex((prevIndex) => (prevIndex + 1) % sidebarAds.length);
      }, 10000); // Rotate every 10 seconds
      
      return () => clearInterval(interval);
    }
  }, [isVisible]);

  useEffect(() => {
    if (isVisible) {
      trackImpression(sidebarAds[currentAdIndex].id);
    }
  }, [currentAdIndex, isVisible, trackImpression]);

  if (!isVisible) {
    return (
      <div className={`bg-gray-100 dark:bg-gray-800 rounded-xl h-64 animate-pulse ${className}`} />
    );
  }

  const currentAd = sidebarAds[currentAdIndex];

  const handleAdClick = () => {
    trackClick(currentAd.id);
    window.open(currentAd.linkUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-all duration-300 group ${className}`}>
      {/* Badge */}
      {currentAd.badge && (
        <div className="bg-gradient-to-r from-bee-yellow to-bee-orange p-2">
          <span className="text-xs font-bold text-bee-black text-center block">
            {currentAd.badge}
          </span>
        </div>
      )}

      {/* Image */}
      <div className="relative overflow-hidden">
        <img 
          src={currentAd.imageUrl}
          alt={currentAd.title}
          className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
      </div>

      {/* Content */}
      <div className="p-4">
        <h4 className="font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
          {currentAd.title}
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
          {currentAd.description}
        </p>

        {/* Rating & Reviews */}
        {currentAd.rating && currentAd.reviews && (
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1">
              <Star size={14} className="text-yellow-400 fill-current" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {currentAd.rating}
              </span>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              ({currentAd.reviews} reviews)
            </span>
          </div>
        )}

        {/* Price & CTA */}
        <div className="flex items-center justify-between">
          {currentAd.price && (
            <span className="text-sm font-bold text-bee-blue">
              {currentAd.price}
            </span>
          )}
          <button
            onClick={handleAdClick}
            className="flex items-center gap-1 bg-bee-yellow hover:bg-bee-orange text-bee-black px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
          >
            View
            <ExternalLink size={12} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SidebarAdWidget;