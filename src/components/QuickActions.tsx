import React, { useState } from "react";
import { Search, Filter, TrendingUp, Bookmark, Share2, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface QuickActionsProps {
  className?: string;
}

const QuickActions = ({ className }: QuickActionsProps) => {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const quickActions = [
    {
      icon: TrendingUp,
      label: "Trending",
      action: () => console.log("Trending clicked"),
      isActive: false,
    },
    {
      icon: Filter,
      label: "Filter",
      action: () => console.log("Filter clicked"),
      isActive: false,
    },
    {
      icon: Bookmark,
      label: "Saved",
      action: () => console.log("Saved clicked"),
      isActive: false,
    },
    {
      icon: Share2,
      label: "Share",
      action: () => console.log("Share clicked"),
      isActive: false,
    },
  ];

  return (
    <div className={cn("fixed bottom-6 left-6 z-40", className)}>
      <div className="flex flex-col gap-3">
        {/* Search Bar */}
        <div className={cn(
          "flex items-center gap-2 glass-card rounded-full p-2 transition-all duration-300 ease-out",
          isSearchExpanded ? "w-64" : "w-12"
        )}>
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 rounded-full flex-shrink-0 hover:bg-primary/10"
            onClick={() => setIsSearchExpanded(!isSearchExpanded)}
          >
            <Search size={16} className="text-primary" />
          </Button>
          
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search posts..."
            className={cn(
              "border-0 bg-transparent text-sm placeholder:text-muted-foreground focus-visible:ring-0 transition-all duration-300",
              isSearchExpanded ? "opacity-100 w-full" : "opacity-0 w-0 pointer-events-none"
            )}
          />
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-col gap-2">
          {quickActions.map((action, index) => (
            <div
              key={action.label}
              className="animate-in slide-in-from-left duration-500"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <Button
                onClick={action.action}
                variant="ghost"
                size="icon"
                className={cn(
                  "group relative w-12 h-12 rounded-full glass-card transition-all duration-300",
                  "hover:scale-110 active:scale-95 hover:shadow-lg",
                  action.isActive && "bg-primary/10 text-primary"
                )}
              >
                <action.icon size={18} className="transition-transform duration-300 group-hover:scale-110" />
                
                {/* Tooltip */}
                <div className="absolute left-14 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                  <div className="bg-black/80 text-white text-sm px-3 py-1.5 rounded-lg whitespace-nowrap backdrop-blur-sm">
                    {action.label}
                  </div>
                </div>
              </Button>
            </div>
          ))}
        </div>

        {/* More Actions */}
        <Button
          variant="ghost"
          size="icon"
          className="group w-12 h-12 rounded-full glass-card transition-all duration-300 hover:scale-110 active:scale-95 hover:shadow-lg"
        >
          <MoreHorizontal size={18} className="transition-transform duration-300 group-hover:scale-110" />
          
          {/* Tooltip */}
          <div className="absolute left-14 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            <div className="bg-black/80 text-white text-sm px-3 py-1.5 rounded-lg whitespace-nowrap backdrop-blur-sm">
              More
            </div>
          </div>
        </Button>
      </div>
    </div>
  );
};

export default QuickActions;