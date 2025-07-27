
import { useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import bambooAd from "../images/bamboo-ad.jpeg";

interface Ad {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  linkUrl: string;
}

// Expanded ads array with more examples
const ads: Ad[] = [
  {
    id: "ad1",
    title: "Summer Festival Weekend",
    description: "Join us for the biggest summer celebration with live music, food, and activities for the whole family.",
    imageUrl: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&auto=format&fit=crop",
    linkUrl: "https://www.facebook.com/summerfestival"
  },
  {
    id: "ad2",
    title: "Local Business Spotlight",
    description: "Discover the best local businesses and exclusive deals just for B.E.E App members.",
    imageUrl: "https://images.unsplash.com/photo-1525328437458-0c4d4db7cab4?w=800&auto=format&fit=crop",
    linkUrl: "https://www.instagram.com/localbusiness"
  },
  {
    id: "ad3",
    title: "Island Tour Specials",
    description: "Explore the beauty of our islands with special discounts on tours and excursions.",
    imageUrl: "https://images.unsplash.com/photo-1548574505-5e239809ee19?w=800&auto=format&fit=crop",
    linkUrl: "https://www.islandtours.com"
  },
  {
    id: "ad4",
    title: "Bamboo Shack Special",
    description: "Taste the best of the Bahamas! Visit Bamboo Shack for delicious local cuisine and unbeatable deals.",
    imageUrl: bambooAd,
    linkUrl: "https://www.bambooshackbahamas.com"
    
  },
  {
    id: "ad5",
    title: "Adventure Sports Center",
    description: "Try kayaking, snorkeling, and diving with professional instructors. Equipment provided.",
    imageUrl: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&auto=format&fit=crop",
    linkUrl: "https://www.adventuresports.com"
  },
  {
    id: "ad7",
    title: "Tropical Spa Retreat",
    description: "Relax and rejuvenate with our signature treatments using natural island ingredients.",
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop",
    linkUrl: "https://www.tropicalspa.com"
  },
  {
    id: "ad8",
    title: "Artisan Market",
    description: "Shop unique handcrafted items from local artisans. Support our creative community.",
    imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop",
    linkUrl: "https://www.artisanmarket.com"
  },
  {
    id: "ad9",
    title: "Oceanfront Restaurant",
    description: "Experience fine dining with breathtaking ocean views. Fresh seafood and local cuisine daily.",
    imageUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&auto=format&fit=crop",
    linkUrl: "https://www.oceanfrontdining.com"
  }
];

const AdSplash = () => {
  const [autoplay, setAutoplay] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loadedImages, setLoadedImages] = useState(new Set([0])); // Start with first image loaded
  const [api, setApi] = useState<CarouselApi>();
  
  useEffect(() => {
    let interval: number;
    
    if (autoplay && api) {
      interval = window.setInterval(() => {
        api.scrollNext();
      }, 5000); // Auto rotate every 5 seconds
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [autoplay, api]);

  useEffect(() => {
    if (!api) {
      return;
    }

    api.on("select", () => {
      setCurrentSlide(api.selectedScrollSnap());
    });
  }, [api]);

  // Lazy load images for current and next/previous slides
  useEffect(() => {
    const indicesToLoad = [
      currentSlide,
      (currentSlide + 1) % ads.length,
      currentSlide === 0 ? ads.length - 1 : currentSlide - 1
    ];
    
    setLoadedImages(prev => {
      const newSet = new Set(prev);
      indicesToLoad.forEach(index => newSet.add(index));
      return newSet;
    });
  }, [currentSlide]);

  const handleGetMoreInfo = (linkUrl: string) => {
    window.open(linkUrl, '_blank', 'noopener,noreferrer');
  };

  const handleSlideChange = (index: number) => {
    if (api) {
      api.scrollTo(index);
    }
  };
  
  return (
    <div className="relative bg-bee-blue/90 text-white overflow-hidden flex justify-center">
      <Carousel 
        className="w-full max-w-6xl mx-auto px-4 py-8" 
        opts={{ loop: true }}
        setApi={setApi}
      >
        <CarouselContent>
          {ads.map((ad, index) => (
            <CarouselItem key={ad.id}>
              <div className="flex flex-col md:flex-row items-center">
                <div className="w-full md:w-1/3 mb-4 md:mb-0 md:mr-6">
                  {loadedImages.has(index) ? (
                    <img 
                      src={ad.imageUrl} 
                      alt={ad.title} 
                      className="rounded-lg w-full h-32 md:h-40 object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="rounded-lg w-full h-32 md:h-40 bg-gray-300 animate-pulse flex items-center justify-center">
                      <span className="text-gray-500 text-sm">Loading...</span>
                    </div>
                  )}
                </div>
                <div className="w-full md:w-2/3">
                  <h3 className="text-xl font-bold mb-2">{ad.title}</h3>
                  <p className="mb-4">{ad.description}</p>
                  <button 
                    onClick={() => handleGetMoreInfo(ad.linkUrl)}
                    className="inline-block bg-bee-yellow text-bee-black px-4 py-2 rounded-md font-medium hover:bg-bee-yellow/90 transition-colors cursor-pointer"
                  >
                    Get More Info
                  </button>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 border-white/30" />
        <CarouselNext className="right-2 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 border-white/30" />
        
        {/* Slide indicators */}
        <div className="flex justify-center mt-4 space-x-2">
          {ads.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentSlide ? 'bg-white' : 'bg-white/40'
              }`}
              onClick={() => handleSlideChange(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </Carousel>
    </div>
  );
};

export default AdSplash;
