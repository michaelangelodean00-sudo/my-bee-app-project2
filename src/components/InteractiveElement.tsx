import { ReactNode, useState } from "react";
import { cn } from "@/lib/utils";

interface InteractiveElementProps {
  children: ReactNode;
  className?: string;
  hoverEffect?: "lift" | "glow" | "scale" | "bounce";
  clickEffect?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

const InteractiveElement = ({ 
  children, 
  className, 
  hoverEffect = "lift",
  clickEffect = true,
  disabled = false,
  onClick 
}: InteractiveElementProps) => {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    if (disabled) return;
    
    if (clickEffect) {
      setIsClicked(true);
      setTimeout(() => setIsClicked(false), 200);
    }
    
    onClick?.();
  };

  const hoverEffects = {
    lift: "hover:translate-y-[-2px] hover:shadow-lg",
    glow: "hover:shadow-[0_0_20px_rgba(255,215,0,0.3)] hover:border-primary/30",
    scale: "hover:scale-[1.02]",
    bounce: "hover:animate-micro-bounce"
  };

  return (
    <div
      className={cn(
        "transition-all duration-300 ease-out cursor-pointer",
        !disabled && hoverEffects[hoverEffect],
        disabled && "opacity-50 cursor-not-allowed",
        isClicked && clickEffect && "animate-micro-bounce",
        className
      )}
      onClick={handleClick}
    >
      {children}
    </div>
  );
};

export default InteractiveElement;