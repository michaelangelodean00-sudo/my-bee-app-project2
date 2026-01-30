import { useEffect, useRef, useState, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "fade" | "scale" | "rotate";
  threshold?: number;
  duration?: number;
  once?: boolean;
}

const ScrollReveal = ({ 
  children, 
  className, 
  delay = 0, 
  direction = "up",
  threshold = 0.1,
  duration = 400, // Reduced from 700ms
  once = true
}: ScrollRevealProps) => {
  // Start visible if delay is 0 for faster initial paint
  const [isVisible, setIsVisible] = useState(delay === 0);
  const elementRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(delay === 0);

  useEffect(() => {
    // Skip observer setup if already visible
    if (hasAnimated.current && once) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && (!once || !hasAnimated.current)) {
          if (delay > 0) {
            setTimeout(() => {
              setIsVisible(true);
              hasAnimated.current = true;
            }, delay);
          } else {
            setIsVisible(true);
            hasAnimated.current = true;
          }
        } else if (!once && !entry.isIntersecting) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin: "100px" } // Increased rootMargin for earlier trigger
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [delay, threshold, once]);

const initialClasses = {
    up: "translate-y-4", // Reduced from 8 for subtler effect
    down: "-translate-y-4",
    left: "translate-x-4",
    right: "-translate-x-4",
    fade: "",
    scale: "scale-[0.98]", // Subtler scale
    rotate: "rotate-1"
  };

  const visibleClasses = {
    up: "translate-y-0",
    down: "translate-y-0",
    left: "translate-x-0",
    right: "translate-x-0",
    fade: "",
    scale: "scale-100",
    rotate: "rotate-0"
  };

  return (
    <div
      ref={elementRef}
      className={cn(
        "will-change-transform",
        !isVisible && "opacity-0",
        !isVisible && initialClasses[direction],
        isVisible && "opacity-100",
        isVisible && visibleClasses[direction],
        className
      )}
      style={{
        transition: `all ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
        transitionDelay: `${delay}ms`
      }}
    >
      {children}
    </div>
  );
};

export default ScrollReveal;