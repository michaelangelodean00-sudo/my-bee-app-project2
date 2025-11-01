
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
    <div className="relative bg-bee-blue/90 text-white overflow-visible flex justify-center">
      <Carousel 
        className="w-full max-w-7xl mx-auto py-8" 
        opts={{ 
          loop: true,
          align: "center",
        }}
        setApi={setApi}
      >
        <CarouselContent className="-ml-4">
          {ads.map((ad, index) => (
            <CarouselItem key={ad.id} className="pl-4 basis-[85%] md:basis-[90%]">
              <div 
                className={`flex flex-col md:flex-row items-center gap-8 px-4 transition-all duration-500 ${
                  index === currentSlide 
                    ? 'scale-100 opacity-100' 
                    : 'scale-95 opacity-60'
                }`}
              >
                <div className="w-full md:w-1/2 relative group">
                  {loadedImages.has(index) ? (
                    <div className="relative overflow-hidden rounded-2xl">
                      {/* Gradient overlay for depth */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      {/* Decorative border glow */}
                      <div className="absolute inset-0 rounded-2xl border-2 border-white/20 group-hover:border-white/40 transition-colors duration-300" />
                      
                      <img 
                        src={ad.imageUrl} 
                        alt={ad.title} 
                        className="rounded-2xl w-full h-64 md:h-80 lg:h-96 object-cover transform transition-all duration-700 group-hover:scale-110 shadow-2xl shadow-primary/30"
                        loading="lazy"
                      />
                      
                      {/* Shine effect on hover */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                    </div>
                  ) : (
                    <div className="rounded-2xl w-full h-64 md:h-80 lg:h-96 bg-gradient-to-br from-muted/50 to-muted animate-pulse flex items-center justify-center shadow-2xl">
                      <span className="text-muted-foreground text-sm">Loading...</span>
                    </div>
                  )}
                </div>
                <div className="w-full md:w-1/2">
                  <h3 className="text-2xl md:text-3xl font-bold mb-4">{ad.title}</h3>
                  <p className="text-lg mb-6 leading-relaxed">{ad.description}</p>
                  <button 
                    onClick={() => handleGetMoreInfo(ad.linkUrl)}
                    className="inline-block bg-bee-yellow text-bee-black px-6 py-3 rounded-lg font-semibold text-lg hover:bg-bee-yellow/90 transition-colors cursor-pointer shadow-md"
                  >
                    Get More Info
                  </button>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 border-white/30 z-20" />
        <CarouselNext className="right-2 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 border-white/30 z-20" />
        
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
