
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

const AdWidget = () => {
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [dismissed, setDismissed] = useState(false);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAdIndex((prevIndex) => (prevIndex + 1) % ads.length);
    }, 5000); // Rotate ads every 5 seconds
    
    return () => clearInterval(interval);
  }, []);
  
  if (dismissed) {
    return null;
  }
  
  const currentAd = ads[currentAdIndex];
  
  return (
    <div className="bg-gradient-to-r from-bee-blue/90 to-bee-darkblue/90 text-white p-6 relative">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center">
        <div className="w-full md:w-1/3 mb-4 md:mb-0 md:mr-6">
          <img 
            src={currentAd.imageUrl} 
            alt={currentAd.title} 
            className="rounded-lg h-40 w-full object-cover shadow-md"
          />
        </div>
        <div className="w-full md:w-2/3">
          <h3 className="text-xl font-bold mb-2">{currentAd.title}</h3>
          <p className="text-base mb-3">{currentAd.description}</p>
          <a 
            href={currentAd.linkUrl} 
            className="inline-block bg-bee-yellow text-bee-black px-4 py-2 rounded-md text-base font-medium hover:bg-bee-yellow/90 transition-colors"
          >
            Learn More
          </a>
        </div>
        <button 
          onClick={() => setDismissed(true)}
          className="absolute top-3 right-3 text-white/80 hover:text-white"
          aria-label="Dismiss ad"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

export default AdWidget;
