import { memo, ReactNode, useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

const PageTransition = memo(({ children, className }: PageTransitionProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const location = useLocation();
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Skip animation on first render for faster initial load
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setIsVisible(false);
    // Single rAF is sufficient
    requestAnimationFrame(() => setIsVisible(true));
  }, [location.pathname]);

  return (
    <div
      className={cn(
        "transition-opacity duration-100 ease-out",
        isVisible ? "opacity-100" : "opacity-0",
        className
      )}
      style={{ contain: 'layout' }}
    >
      {children}
    </div>
  );
});

PageTransition.displayName = 'PageTransition';

export default PageTransition;
