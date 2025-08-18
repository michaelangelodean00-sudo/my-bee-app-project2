import React from "react";
import { Bell, MessageCircle, Heart, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useNotifications } from "../contexts/NotificationContext";

interface FloatingNotificationsProps {
  className?: string;
}

const FloatingNotifications = ({ className }: FloatingNotificationsProps) => {
  const { hasNewBusinessVideos, hasNewEventsVideos, hasNewEcommerceItems } = useNotifications();
  
  const notifications = [
    {
      icon: Bell,
      count: hasNewBusinessVideos ? 3 : 0,
      color: "bg-blue-500",
      label: "Business Updates"
    },
    {
      icon: MessageCircle,
      count: hasNewEventsVideos ? 2 : 0,
      color: "bg-purple-500",
      label: "Event Messages"
    },
    {
      icon: Heart,
      count: hasNewEcommerceItems ? 5 : 0,
      color: "bg-red-500",
      label: "Likes"
    },
  ];

  const hasAnyNotifications = notifications.some(n => n.count > 0);

  if (!hasAnyNotifications) return null;

  return (
    <div className={cn("fixed top-1/2 right-4 -translate-y-1/2 z-40", className)}>
      <div className="flex flex-col gap-3">
        {notifications.map((notification, index) => {
          if (notification.count === 0) return null;
          
          return (
            <div
              key={index}
              className="animate-in slide-in-from-right duration-500"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "group relative w-12 h-12 rounded-full shadow-lg transition-all duration-300",
                  "glass-card hover:scale-110 active:scale-95",
                  "hover:shadow-xl"
                )}
              >
                <notification.icon size={20} className="text-foreground/80 group-hover:text-foreground transition-colors" />
                
                {/* Notification badge */}
                <div className={cn(
                  "absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white",
                  notification.color,
                  "animate-pulse"
                )}>
                  {notification.count}
                </div>
                
                {/* Tooltip */}
                <div className="absolute right-14 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                  <div className="bg-black/80 text-white text-sm px-3 py-1.5 rounded-lg whitespace-nowrap backdrop-blur-sm">
                    {notification.label}
                  </div>
                </div>
                
                {/* Glow effect */}
                <div className={cn(
                  "absolute inset-0 rounded-full opacity-20 scale-150 animate-ping",
                  notification.color.replace('bg-', 'bg-')
                )} />
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FloatingNotifications;