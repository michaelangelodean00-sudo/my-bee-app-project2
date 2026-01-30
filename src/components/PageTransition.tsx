import { ReactNode, useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

const PageTransition = ({ children, className }: PageTransitionProps) => {
  const [isVisible, setIsVisible] = useState(true); // Start visible for faster LCP
  const location = useLocation();
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Skip animation on first render for faster initial load
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setIsVisible(false);
    // Use requestAnimationFrame for smoother transition
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setIsVisible(true));
    });
  }, [location.pathname]);

  return (
    <div
      className={cn(
        "transition-opacity duration-150 ease-out",
        isVisible ? "opacity-100" : "opacity-0",
        className
      )}
    >
      {children}
    </div>
  );
};

export default PageTransition;
