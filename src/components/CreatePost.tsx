
import { useState } from "react";
import { Handshake, ShoppingCart } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { EventIcon } from "./icons/EventIcons";

interface CreatePostProps {
  onPostCreated?: (post: any) => void;
}

const CreatePost = ({ onPostCreated }: CreatePostProps) => {
  // You can change this to any of the event icon types and backgrounds
  const [eventIconType, setEventIconType] = useState<"image" | "partyPopper" | "calendar" | "ticket" | "music" | "custom">("partyPopper");
  const [eventIconBg, setEventIconBg] = useState<"purple" | "blue" | "green" | "teal">("purple");
  
  // Optional: Add a function to cycle through different icons on click
  const cycleEventIcon = () => {
    const iconTypes = ["image", "partyPopper", "calendar", "ticket", "music", "custom"] as const;
    const backgrounds = ["purple", "blue", "green", "teal"] as const;
    
    const currentIndex = iconTypes.indexOf(eventIconType);
    const nextIndex = (currentIndex + 1) % iconTypes.length;
    
    // Also cycle through backgrounds
    if (nextIndex === 0) {
      const currentBgIndex = backgrounds.indexOf(eventIconBg);
      const nextBgIndex = (currentBgIndex + 1) % backgrounds.length;
      setEventIconBg(backgrounds[nextBgIndex]);
    }
    
    setEventIconType(iconTypes[nextIndex]);
  };

  return (
    <div className="bee-card p-4 mb-4 max-w-4xl mx-auto">
      <div className="flex gap-3 items-center mb-3 justify-center">
        <Avatar className="w-16 h-16">
          <AvatarImage src="/lovable-uploads/d5511939-48e5-44cf-9f2b-d8f9e829b842.png" />
          <AvatarFallback>BEE</AvatarFallback>
        </Avatar>
        <span className="text-3xl font-bold text-bee-blue font-bebas-neue tracking-wider">B.E.E App</span>
      </div>
      
      <Separator className="my-4" />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-2 sm:px-4">
        <Link to="/businesses" className="w-full">
          <Button 
            variant="outline" 
            className="w-full h-36 flex flex-col items-center justify-center gap-4 text-lg font-semibold text-bee-blue border-bee-blue hover:bg-bee-blue/10 py-6"
          >
            <div className="rounded-full bg-gradient-to-br from-blue-400 to-blue-600 p-4 mb-2">
              <Handshake size={48} className="text-white" />
            </div>
            Business
          </Button>
        </Link>
        <Link to="/events" className="w-full">
          <Button 
            variant="outline" 
            className="w-full h-36 flex flex-col items-center justify-center gap-4 text-lg font-semibold text-bee-blue border-bee-blue hover:bg-bee-blue/10 py-6"
            onClick={(e) => {
              // This allows the icon to change on click, but still navigate on full button click
              if ((e.target as any).closest('.event-icon-wrapper')) {
                e.preventDefault();
                cycleEventIcon();
              }
            }}
          >
            <div className="event-icon-wrapper cursor-pointer" title="Click to change icon style">
              <EventIcon 
                type={eventIconType} 
                background={eventIconBg}
                className="mb-2"
              />
            </div>
            Events
          </Button>
        </Link>
        <Link to="/ecommerce" className="w-full">
          <Button 
            variant="outline" 
            className="w-full h-36 flex flex-col items-center justify-center gap-4 text-lg font-semibold text-bee-blue border-bee-blue hover:bg-bee-blue/10 py-6"
          >
            <div className="rounded-full bg-gradient-to-br from-green-400 to-green-600 p-4 mb-2">
              <ShoppingCart size={48} className="text-white" />
            </div>
            E-commerce
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default CreatePost;
