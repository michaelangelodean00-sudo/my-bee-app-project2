
import { useState, useEffect } from "react";

/**
 * Custom hook to handle carousel autoplay functionality
 * @param interval Time in milliseconds between slides
 * @returns [autoplay, setAutoplay] - State for controlling autoplay
 */
export const useCarouselAutoplay = (interval = 5000) => {
  const [autoplay, setAutoplay] = useState(true);
  
  useEffect(() => {
    let timeoutId: number;
    
    if (autoplay) {
      timeoutId = window.setInterval(() => {
        const carouselNext = document.querySelector('[data-carousel-next]');
        if (carouselNext) {
          (carouselNext as HTMLButtonElement).click();
        }
      }, interval);
    }
    
    return () => {
      if (timeoutId) {
        clearInterval(timeoutId);
      }
    };
  }, [autoplay, interval]);
  
  return [autoplay, setAutoplay] as const;
};
