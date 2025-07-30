import { useState, useEffect } from "react";
import { ExternalLink, Sparkles } from "lucide-react";
import { useAdAnalytics } from "../hooks/useAdAnalytics";

interface FeedAd {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  linkUrl: string;
  sponsor: string;
  cta: string;
  tag: string;
}

const feedAds: FeedAd[] = [
  {
    id: "feed-1",
    title: "Discover Paradise Tours",
    description: "Experience the breathtaking beauty of the Bahamas with our exclusive island-hopping adventures. Professional guides, luxury boats, and unforgettable memories await.",
    imageUrl: "https://images.unsplash.com/photo-1548574505-5e239809ee19?w=600&h=400&auto=format&fit=crop",
    linkUrl: "#paradise-tours",
    sponsor: "Paradise Tours Bahamas",
    cta: "Book Your Adventure",
    tag: "Featured"
  },
  {
    id: "feed-2",
    title: "Local Business Showcase",
    description: "Support local entrepreneurs and discover amazing products and services right in your neighborhood. From artisan crafts to gourmet dining.",
    imageUrl: "https://images.unsplash.com/photo-1525328437458-0c4d4db7cab4?w=600&h=400&auto=format&fit=crop",
    linkUrl: "#local-business",
    sponsor: "B.E.E Business Network",
    cta: "Explore Businesses",
    tag: "Community"
  },
  {
    id: "feed-3",
    title: "Summer Festival Celebration",
    description: "Join thousands for the biggest summer celebration of the year! Live music, local food vendors, family activities, and so much more.",
    imageUrl: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600&h=400&auto=format&fit=crop",
    linkUrl: "#summer-festival",
    sponsor: "Nassau Events Committee",
    cta: "Get Tickets",
    tag: "Event"
  }
];

interface InFeedAdWidgetProps {
  className?: string;
}

const InFeedAdWidget = ({ className = '' }: InFeedAdWidgetProps) => {
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const { trackImpression, trackClick } = useAdAnalytics();

  useEffect(() => {
    // Random ad selection for variety
    setCurrentAdIndex(Math.floor(Math.random() * feedAds.length));
    setIsVisible(true);
  }, []);

  useEffect(() => {
    if (isVisible) {
      trackImpression(feedAds[currentAdIndex].id);
    }
  }, [currentAdIndex, isVisible, trackImpression]);

  if (!isVisible) return null;

  const currentAd = feedAds[currentAdIndex];

  const handleAdClick = () => {
    trackClick(currentAd.id);
    window.open(currentAd.linkUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-all duration-300 ${className}`}>
      {/* Sponsored Tag */}
      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-bee-yellow" />
          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
            Sponsored · {currentAd.sponsor}
          </span>
        </div>
        <span className="text-xs bg-bee-yellow/20 text-bee-black px-2 py-1 rounded-full font-medium">
          {currentAd.tag}
        </span>
      </div>

      {/* Ad Content */}
      <div className="cursor-pointer" onClick={handleAdClick}>
        {/* Image */}
        <div className="relative overflow-hidden bg-gray-100 dark:bg-gray-800">
          <img 
            src={currentAd.imageUrl}
            alt={currentAd.title}
            className="w-full h-48 md:h-56 object-cover hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>

        {/* Content */}
        <div className="p-4 md:p-6">
          <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">
            {currentAd.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base leading-relaxed mb-4 line-clamp-3">
            {currentAd.description}
          </p>
          
          {/* CTA Button */}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              handleAdClick();
            }}
            className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-bee-yellow to-bee-orange text-bee-black px-6 py-3 rounded-lg font-medium hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
          >
            {currentAd.cta}
            <ExternalLink size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InFeedAdWidget;