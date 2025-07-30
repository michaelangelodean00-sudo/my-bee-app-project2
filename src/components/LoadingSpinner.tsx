
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  text?: string;
  className?: string;
  variant?: "default" | "dots" | "pulse";
}

const LoadingSpinner = ({ size = "md", text, className = "", variant = "default" }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6", 
    lg: "w-8 h-8",
    xl: "w-12 h-12"
  };

  if (variant === "dots") {
    return (
      <div className={cn("flex items-center justify-center gap-1", className)}>
        <div className="animate-bounce [animation-delay:-0.3s] w-2 h-2 bg-primary rounded-full"></div>
        <div className="animate-bounce [animation-delay:-0.15s] w-2 h-2 bg-primary rounded-full"></div>
        <div className="animate-bounce w-2 h-2 bg-primary rounded-full"></div>
        {text && <span className="ml-2 text-sm text-muted-foreground animate-fade-in">{text}</span>}
      </div>
    );
  }

  if (variant === "pulse") {
    return (
      <div className={cn("flex items-center justify-center gap-2", className)}>
        <div className={cn("animate-pulse bg-gradient-primary rounded-full", sizeClasses[size])}></div>
        {text && <span className="text-sm text-muted-foreground animate-fade-in">{text}</span>}
      </div>
    );
  }

  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
      <Loader2 className={cn("animate-spin text-primary", sizeClasses[size])} />
      {text && <span className="text-sm text-muted-foreground animate-fade-in">{text}</span>}
    </div>
  );
};

export default LoadingSpinner;
