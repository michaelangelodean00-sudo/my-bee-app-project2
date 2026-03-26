import { memo } from "react";
import { Eye, MousePointerClick, TrendingUp, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdPerformanceMetricsProps {
  impressions: number;
  clicks: number;
  views?: number;
  className?: string;
  variant?: "overlay" | "inline" | "compact";
}

const AdPerformanceMetrics = memo(({ impressions, clicks, views, className, variant = "overlay" }: AdPerformanceMetricsProps) => {
  const ctr = impressions > 0 ? ((clicks / impressions) * 100).toFixed(1) : "0.0";

  if (variant === "compact") {
    return (
      <div className={cn("flex items-center gap-2 text-[10px] text-muted-foreground", className)}>
        <span className="flex items-center gap-0.5"><Eye size={10} /> {impressions}</span>
        <span className="flex items-center gap-0.5"><MousePointerClick size={10} /> {clicks}</span>
        <span className="flex items-center gap-0.5"><TrendingUp size={10} /> {ctr}%</span>
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <div className={cn("flex items-center gap-3 px-3 py-1.5 rounded-lg bg-muted/60 text-xs text-muted-foreground", className)}>
        <div className="flex items-center gap-1">
          <Eye size={12} className="text-primary" />
          <span className="font-medium">{impressions.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-1">
          <MousePointerClick size={12} className="text-primary" />
          <span className="font-medium">{clicks.toLocaleString()}</span>
        </div>
        {views !== undefined && (
          <div className="flex items-center gap-1">
            <BarChart3 size={12} className="text-primary" />
            <span className="font-medium">{views.toLocaleString()}</span>
          </div>
        )}
        <div className="flex items-center gap-1">
          <TrendingUp size={12} className="text-primary" />
          <span className="font-medium">{ctr}%</span>
          <span className="opacity-60">CTR</span>
        </div>
      </div>
    );
  }

  // overlay variant (default)
  return (
    <div className={cn(
      "flex items-center gap-2 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm text-white text-[10px] font-medium shadow-lg",
      className
    )}>
      <span className="flex items-center gap-0.5"><Eye size={10} /> {impressions.toLocaleString()}</span>
      <span className="w-px h-3 bg-white/30" />
      <span className="flex items-center gap-0.5"><MousePointerClick size={10} /> {clicks.toLocaleString()}</span>
      <span className="w-px h-3 bg-white/30" />
      <span className="flex items-center gap-0.5"><TrendingUp size={10} /> {ctr}%</span>
    </div>
  );
});

AdPerformanceMetrics.displayName = "AdPerformanceMetrics";

export default AdPerformanceMetrics;
