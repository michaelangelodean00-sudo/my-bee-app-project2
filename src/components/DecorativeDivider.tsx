import { cn } from "@/lib/utils";

interface DecorativeDividerProps {
  className?: string;
  variant?: "honeycomb" | "dots" | "wave";
}

const DecorativeDivider = ({ className, variant = "honeycomb" }: DecorativeDividerProps) => {
  if (variant === "dots") {
    return (
      <div className={cn("flex items-center justify-center gap-2 py-2", className)}>
        <div className="h-1.5 w-1.5 rounded-full bg-primary/30 animate-pulse" />
        <div className="h-2 w-2 rounded-full bg-primary/50 animate-pulse" style={{ animationDelay: '0.2s' }} />
        <div className="h-1.5 w-1.5 rounded-full bg-primary/30 animate-pulse" style={{ animationDelay: '0.4s' }} />
      </div>
    );
  }

  if (variant === "wave") {
    return (
      <div className={cn("flex items-center justify-center py-2", className)}>
        <svg width="120" height="12" viewBox="0 0 120 12" className="text-primary/20">
          <path
            d="M0 6 Q15 0 30 6 T60 6 T90 6 T120 6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>
    );
  }

  // Default honeycomb variant - bee themed
  return (
    <div className={cn("flex items-center justify-center gap-1.5 py-2", className)}>
      <div className="h-px flex-1 max-w-12 bg-gradient-to-r from-transparent to-primary/20" />
      <div className="flex items-center gap-1">
        <HexagonIcon className="w-3 h-3 text-primary/25" />
        <HexagonIcon className="w-4 h-4 text-primary/40" />
        <div className="w-1.5 h-1.5 rounded-full bg-primary/50" />
        <HexagonIcon className="w-4 h-4 text-primary/40" />
        <HexagonIcon className="w-3 h-3 text-primary/25" />
      </div>
      <div className="h-px flex-1 max-w-12 bg-gradient-to-l from-transparent to-primary/20" />
    </div>
  );
};

const HexagonIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M12 2L21.5 7V17L12 22L2.5 17V7L12 2Z" />
  </svg>
);

export default DecorativeDivider;
