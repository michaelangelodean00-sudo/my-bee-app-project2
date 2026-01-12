import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EnhancedCardProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "premium" | "glow" | "floating";
  hover?: boolean;
}

const EnhancedCard = ({ 
  children, 
  className, 
  variant = "default", 
  hover = true 
}: EnhancedCardProps) => {
  const baseClasses = "relative overflow-hidden transition-all duration-300 ease-out rounded-xl";
  
  const variants = {
    default: "bee-card",
    premium: "bee-card-premium",
    glow: "bee-card border-primary/20 shadow-[0_0_20px_hsl(var(--primary)/0.08)]",
    floating: "bee-card shadow-lg"
  };

  const hoverEffects = hover ? "hover:shadow-lg" : "";

  return (
    <div className={cn(
      baseClasses,
      variants[variant],
      hoverEffects,
      className
    )}>
      {children}
    </div>
  );
};

export default EnhancedCard;
