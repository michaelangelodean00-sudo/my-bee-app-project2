import { X } from "lucide-react";
import { useGreetingBanner } from "@/hooks/useGreetingBanner";
import { cn } from "@/lib/utils";

interface GreetingBannerProps {
  className?: string;
}

const GreetingBanner = ({ className }: GreetingBannerProps) => {
  const { greeting, showBanner, dismissGreeting } = useGreetingBanner();

  if (!showBanner || !greeting) {
    return null;
  }

  return (
    <div
      className={cn(
        "relative w-full py-3 px-4 text-center animate-fade-in",
        "bg-gradient-to-r from-primary/90 via-primary to-primary/90",
        "text-primary-foreground shadow-md",
        className
      )}
      style={{
        backgroundColor: greeting.backgroundColor,
        color: greeting.textColor,
      }}
      role="banner"
      aria-label="Announcement"
    >
      <div className="max-w-3xl mx-auto flex items-center justify-center gap-2">
        {greeting.emoji && (
          <span className="text-xl" aria-hidden="true">
            {greeting.emoji}
          </span>
        )}
        <p className="font-medium text-sm sm:text-base">
          {greeting.message}
        </p>
        {greeting.emoji && (
          <span className="text-xl" aria-hidden="true">
            {greeting.emoji}
          </span>
        )}
      </div>
      
      <button
        onClick={dismissGreeting}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-white/20 transition-colors"
        aria-label="Dismiss announcement"
      >
        <X size={18} />
      </button>
    </div>
  );
};

export default GreetingBanner;
