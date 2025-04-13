
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import AdCard from "./AdCard";
import { ads } from "../data/adsData";
import { useCarouselAutoplay } from "../hooks/useCarouselAutoplay";

const AdSplash = () => {
  const [autoplay, setAutoplay] = useCarouselAutoplay(5000);
  
  return (
    <div className="relative bg-gradient-to-r from-bee-blue/90 to-bee-darkblue/90 text-white overflow-hidden h-48 flex items-center justify-center py-8">
      <Carousel className="max-w-6xl mx-auto px-4" opts={{ loop: true }}>
        <CarouselContent>
          {ads.map((ad) => (
            <CarouselItem key={ad.id}>
              <AdCard ad={ad} />
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
