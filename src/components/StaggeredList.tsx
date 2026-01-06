import { ReactNode, Children, cloneElement, isValidElement } from "react";
import { cn } from "@/lib/utils";

interface StaggeredListProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  baseDelay?: number;
  animation?: "fade-up" | "fade-down" | "fade-left" | "fade-right" | "scale";
}

const StaggeredList = ({
  children,
  className,
  staggerDelay = 100,
  baseDelay = 0,
  animation = "fade-up"
}: StaggeredListProps) => {
  const animationClasses = {
    "fade-up": "animate-fade-in-up",
    "fade-down": "animate-fade-in-down",
    "fade-left": "animate-fade-in-left",
    "fade-right": "animate-fade-in-right",
    "scale": "animate-scale-up"
  };

  return (
    <div className={cn("space-y-4", className)}>
      {Children.map(children, (child, index) => {
        if (!isValidElement(child)) return child;
        
        return (
          <div
            className={cn(
              "opacity-0",
              animationClasses[animation]
            )}
            style={{
              animationDelay: `${baseDelay + index * staggerDelay}ms`,
              animationFillMode: "forwards"
            }}
          >
            {child}
          </div>
        );
      })}
    </div>
  );
};

export default StaggeredList;
