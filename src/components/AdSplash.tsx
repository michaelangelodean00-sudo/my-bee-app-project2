
import { useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

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
    imageUrl: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7cab4?w=800&auto=format&fit=crop",
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
  const [autoplay, setAutoplay] = useState(true);
  
  useEffect(() => {
    let interval: number;
    
    if (autoplay) {
      interval = window.setInterval(() => {
        const carouselNext = document.querySelector('[data-carousel-next]');
        if (carouselNext) {
          (carouselNext as HTMLButtonElement).click();
        }
      }, 5000); // Auto rotate every 5 seconds
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [autoplay]);
  
  return (
    <div className="relative bg-gradient-to-r from-bee-blue/90 to-bee-darkblue/90 text-white overflow-hidden">
      <Carousel className="max-w-6xl mx-auto px-4 py-2" opts={{ loop: true }}>
        <CarouselContent>
          {ads.map((ad) => (
            <CarouselItem key={ad.id}>
              <div className="flex flex-col md:flex-row items-center">
                <div className="w-full md:w-1/3 mb-2 md:mb-0 md:mr-4">
                  <img 
                    src={ad.imageUrl} 
                    alt={ad.title} 
                    className="rounded-lg w-full h-24 md:h-32 object-cover shadow-md"
                  />
                </div>
                <div className="w-full md:w-2/3">
                  <h3 className="text-lg font-bold mb-1">{ad.title}</h3>
                  <p className="mb-2 text-sm">{ad.description}</p>
                  <a 
                    href={ad.linkUrl} 
                    className="inline-block bg-bee-yellow text-bee-black px-3 py-1 rounded-md text-sm font-medium hover:bg-bee-yellow/90 transition-colors"
                  >
                    Get More Info
                  </a>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 border-white/30" />
        <CarouselNext className="right-2 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 border-white/30" data-carousel-next />
      </Carousel>
    </div>
  );
};

export default AdSplash;
