import { ReactNode, useState, useRef, MouseEvent } from "react";
import { cn } from "@/lib/utils";

interface InteractiveElementProps {
  children: ReactNode;
  className?: string;
  hoverEffect?: "lift" | "glow" | "scale" | "bounce" | "tilt" | "none";
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
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const elementRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    if (disabled) return;
    
    if (clickEffect) {
      setIsClicked(true);
      setTimeout(() => setIsClicked(false), 200);
    }
    
    onClick?.();
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (hoverEffect !== "tilt" || !elementRef.current) return;
    
    const rect = elementRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / 10;
    const y = (e.clientY - rect.top - rect.height / 2) / 10;
    
    setTilt({ x: -y, y: x });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const hoverEffects = {
    lift: "hover:-translate-y-1 hover:shadow-lg",
    glow: "hover:shadow-glow hover:border-primary/30",
    scale: "hover:scale-[1.02]",
    bounce: "hover:animate-micro-bounce",
    tilt: "",
    none: ""
  };

  const tiltStyle = hoverEffect === "tilt" 
    ? { transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }
    : {};

  return (
    <div
      ref={elementRef}
      className={cn(
        "transition-all duration-300 ease-out cursor-pointer",
        !disabled && hoverEffects[hoverEffect],
        disabled && "opacity-50 cursor-not-allowed",
        isClicked && clickEffect && "scale-95",
        className
      )}
      style={tiltStyle}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
};

export default InteractiveElement;