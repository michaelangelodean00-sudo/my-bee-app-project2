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
  duration = 700,
  once = true
}: ScrollRevealProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && (!once || !hasAnimated.current)) {
          setTimeout(() => {
            setIsVisible(true);
            hasAnimated.current = true;
          }, delay);
        } else if (!once && !entry.isIntersecting) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin: "50px" }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [delay, threshold, once]);

  const initialClasses = {
    up: "translate-y-8",
    down: "-translate-y-8",
    left: "translate-x-8",
    right: "-translate-x-8",
    fade: "",
    scale: "scale-95",
    rotate: "rotate-3"
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