import React, { useState } from "react";
import { Plus, MessageCircle, Bell, Upload, Users, Calendar, ShoppingCart, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface FloatingActionButtonProps {
  className?: string;
}

const FloatingActionButton = ({ className }: FloatingActionButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleOpen = () => setIsOpen(!isOpen);

  const actionButtons = [
    {
      icon: Users,
      label: "Business",
      action: () => navigate("/businesses"),
      className: "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700",
    },
    {
      icon: Calendar,
      label: "Events",
      action: () => navigate("/events"),
      className: "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600",
    },
    {
      icon: ShoppingCart,
      label: "Shop",
      action: () => navigate("/ecommerce"),
      className: "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700",
    },
    {
      icon: MessageCircle,
      label: "Message",
      action: () => console.log("Message clicked"),
      className: "bg-gradient-to-r from-secondary to-accent hover:from-secondary/90 hover:to-accent/90",
    },
  ];

  return (
    <div className={cn("fixed bottom-6 right-6 z-50", className)}>
      {/* Action buttons */}
      <div className="flex flex-col-reverse gap-3 mb-3">
        {actionButtons.map((button, index) => (
          <div
            key={button.label}
            className={cn(
              "transform transition-all duration-300 ease-out",
              isOpen
                ? "translate-y-0 opacity-100 scale-100"
                : "translate-y-4 opacity-0 scale-95 pointer-events-none"
            )}
            style={{ 
              transitionDelay: isOpen ? `${index * 100}ms` : "0ms",
            }}
          >
            <Button
              onClick={() => {
                button.action();
                setIsOpen(false);
              }}
              className={cn(
                "group relative w-14 h-14 rounded-full shadow-lg transition-all duration-300 ease-out hover:scale-110 active:scale-95",
                "backdrop-blur-sm border border-white/20",
                button.className
              )}
              size="icon"
            >
              <button.icon size={24} className="text-white transition-transform duration-300 group-hover:scale-110" />
              
              {/* Label tooltip */}
              <div className="absolute right-16 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                <div className="bg-black/80 text-white text-sm px-3 py-1.5 rounded-lg whitespace-nowrap backdrop-blur-sm">
                  {button.label}
                </div>
              </div>
            </Button>
          </div>
        ))}
      </div>

      {/* Main FAB */}
      <Button
        onClick={toggleOpen}
        className={cn(
          "group relative w-16 h-16 rounded-full shadow-2xl transition-all duration-300 ease-out",
          "bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90",
          "backdrop-blur-sm border border-white/20",
          "hover:scale-110 active:scale-95",
          isOpen && "rotate-45"
        )}
        size="icon"
      >
        <div className="relative">
          {isOpen ? (
            <X size={28} className="text-white transition-all duration-300" />
          ) : (
            <Plus size={28} className="text-white transition-all duration-300" />
          )}
        </div>
        
        {/* Ripple effect */}
        <div className="absolute inset-0 rounded-full bg-white/20 scale-0 group-active:scale-100 transition-transform duration-150" />
      </Button>
    </div>
  );
};

export default FloatingActionButton;