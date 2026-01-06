import { cn } from "@/lib/utils";

interface SkeletonLoaderProps {
  className?: string;
  variant?: "card" | "text" | "avatar" | "image";
  count?: number;
}

const SkeletonLoader = ({ 
  className, 
  variant = "card",
  count = 1 
}: SkeletonLoaderProps) => {
  const variants = {
    card: "h-32 w-full rounded-xl",
    text: "h-4 w-3/4 rounded",
    avatar: "h-12 w-12 rounded-full",
    image: "h-48 w-full rounded-lg"
  };

  return (
    <div className={cn("space-y-4", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "relative overflow-hidden bg-muted/50",
            variants[variant],
            "before:absolute before:inset-0",
            "before:bg-gradient-to-r before:from-transparent before:via-muted/30 before:to-transparent",
            "before:animate-shimmer before:bg-[length:200%_100%]"
          )}
          style={{ animationDelay: `${i * 100}ms` }}
        />
      ))}
    </div>
  );
};

export default SkeletonLoader;
