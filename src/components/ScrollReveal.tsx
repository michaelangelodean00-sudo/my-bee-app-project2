import { useEffect, useRef, useState, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "fade";
  threshold?: number;
}

const ScrollReveal = ({ 
  children, 
  className, 
  delay = 0, 
  direction = "up",
  threshold = 0.1 
}: ScrollRevealProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [delay, threshold]);

  const directionClasses = {
    up: "translate-y-8",
    down: "translate-y-[-32px]",
    left: "translate-x-8",
    right: "translate-x-[-32px]",
    fade: ""
  };

  const visibleClasses = {
    up: "translate-y-0",
    down: "translate-y-0",
    left: "translate-x-0",
    right: "translate-x-0",
    fade: ""
  };

  return (
    <div
      ref={elementRef}
      className={cn(
        "transition-all duration-700 ease-out",
        !isVisible && "opacity-0",
        !isVisible && directionClasses[direction],
        isVisible && "opacity-100",
        isVisible && visibleClasses[direction],
        className
      )}
    >
      {children}
    </div>
  );
};

export default ScrollReveal;