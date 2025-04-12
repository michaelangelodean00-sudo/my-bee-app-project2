
import { useState, useEffect } from "react";
import { X } from "lucide-react";

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
    imageUrl: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&auto=format&fit=crop",
    linkUrl: "#summer-festival"
  },
  {
    id: "ad2",
    title: "Local Business Spotlight",
    description: "Discover the best local businesses and exclusive deals just for B.E.E App members.",
    imageUrl: "https://images.unsplash.com/photo-1525328437458-0c4d4db7cab4?w=800&auto=format&fit=crop",
    linkUrl: "#business-spotlight"
  },
  {
    id: "ad3",
    title: "Island Tour Specials",
    description: "Explore the beauty of our islands with special discounts on tours and excursions.",
    imageUrl: "https://images.unsplash.com/photo-1548574505-5e239809ee19?w=800&auto=format&fit=crop",
    linkUrl: "#island-tours"
  }
];

const AdSplash = () => {
  const [currentAd, setCurrentAd] = useState<Ad | null>(null);
  const [dismissed, setDismissed] = useState(false);
  
  useEffect(() => {
    // Randomly select an ad to display
    const randomAd = ads[Math.floor(Math.random() * ads.length)];
    setCurrentAd(randomAd);
    
    // Reset dismissed state when ad changes
    setDismissed(false);
  }, []);
  
  if (!currentAd || dismissed) {
    return null;
  }
  
  return (
    <div className="relative bg-gradient-to-r from-bee-blue/90 to-bee-darkblue/90 text-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center">
        <div className="w-full md:w-1/3 mb-4 md:mb-0 md:mr-6">
          <img 
            src={currentAd.imageUrl} 
            alt={currentAd.title} 
            className="rounded-lg w-full h-32 md:h-40 object-cover shadow-md"
          />
        </div>
        <div className="w-full md:w-2/3">
          <h3 className="text-xl font-bold mb-2">{currentAd.title}</h3>
          <p className="mb-4">{currentAd.description}</p>
          <a 
            href={currentAd.linkUrl} 
            className="inline-block bg-bee-yellow text-bee-black px-4 py-2 rounded-md font-medium hover:bg-bee-yellow/90 transition-colors"
          >
            Learn More
          </a>
        </div>
        <button 
          onClick={() => setDismissed(true)}
          className="absolute top-2 right-2 text-white/80 hover:text-white"
          aria-label="Close advertisement"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
};

export default AdSplash;
