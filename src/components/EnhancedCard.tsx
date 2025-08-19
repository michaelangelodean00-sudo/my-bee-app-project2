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
  const baseClasses = "relative overflow-hidden transition-all duration-500 ease-out";
  
  const variants = {
    default: "bee-card",
    premium: "bee-card-premium",
    glow: "bee-card border-2 border-primary/20 shadow-[0_0_20px_rgba(255,215,0,0.3)]",
    floating: "bee-card shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.18)]"
  };

  const hoverEffects = hover ? "hover:translate-y-[-4px] hover:rotate-[0.5deg] hover:scale-[1.02]" : "";

  return (
    <div className={cn(
      baseClasses,
      variants[variant],
      hoverEffects,
      className
    )}>
      {/* Enhanced gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-secondary/10 to-accent/8 opacity-0 hover:opacity-100 transition-all duration-500 pointer-events-none" />
      
      {/* Shimmer effect */}
      <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-700">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:animate-shimmer" />
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Floating particles effect */}
      {variant === "floating" && (
        <>
          <div className="absolute top-4 right-4 w-2 h-2 bg-primary/30 rounded-full animate-float" style={{ animationDelay: "0s" }} />
          <div className="absolute top-8 right-8 w-1 h-1 bg-secondary/40 rounded-full animate-float" style={{ animationDelay: "1s" }} />
          <div className="absolute bottom-6 left-6 w-1.5 h-1.5 bg-accent/35 rounded-full animate-float" style={{ animationDelay: "2s" }} />
        </>
      )}
    </div>
  );
};

export default EnhancedCard;