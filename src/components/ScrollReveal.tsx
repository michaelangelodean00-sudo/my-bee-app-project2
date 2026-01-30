import { memo, useEffect, useRef, useState, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "fade" | "scale";
}

// Single shared IntersectionObserver for all ScrollReveal instances
const observerCallbacks = new Map<Element, (isIntersecting: boolean) => void>();
let sharedObserver: IntersectionObserver | null = null;

const getSharedObserver = () => {
  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const callback = observerCallbacks.get(entry.target);
          if (callback) {
            callback(entry.isIntersecting);
          }
        });
      },
      { threshold: 0.1, rootMargin: "50px" }
    );
  }
  return sharedObserver;
};

const ScrollReveal = memo(({ 
  children, 
  className, 
  delay = 0, 
  direction = "up"
}: ScrollRevealProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || hasAnimated.current) return;

    const handleIntersection = (isIntersecting: boolean) => {
      if (isIntersecting && !hasAnimated.current) {
        hasAnimated.current = true;
        if (delay > 0) {
          setTimeout(() => setIsVisible(true), delay);
        } else {
          setIsVisible(true);
        }
        // Unobserve after animation triggers (once-only)
        observerCallbacks.delete(element);
        getSharedObserver().unobserve(element);
      }
    };

    observerCallbacks.set(element, handleIntersection);
    getSharedObserver().observe(element);

    return () => {
      observerCallbacks.delete(element);
      getSharedObserver().unobserve(element);
    };
  }, [delay]);

  const transforms = {
    up: isVisible ? "translate-y-0" : "translate-y-3",
    down: isVisible ? "translate-y-0" : "-translate-y-3",
    left: isVisible ? "translate-x-0" : "translate-x-3",
    right: isVisible ? "translate-x-0" : "-translate-x-3",
    fade: "",
    scale: isVisible ? "scale-100" : "scale-[0.98]"
  };

  return (
    <div
      ref={elementRef}
      className={cn(
        "transition-all duration-300 ease-out",
        isVisible ? "opacity-100" : "opacity-0",
        transforms[direction],
        className
      )}
      style={{ contain: 'layout style' }}
    >
      {children}
    </div>
  );
});

ScrollReveal.displayName = 'ScrollReveal';

export default ScrollReveal;
