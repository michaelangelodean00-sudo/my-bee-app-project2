
import { useState } from "react";
import { Handshake, Calendar, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";

const CreatePost = ({ onPostCreated }: { onPostCreated?: (post: any) => void }) => {
  const navigate = useNavigate();
  
  const navigateTo = (path: string) => {
    navigate(path);
  };
  
  return (
    <div className="bee-card-premium p-5 md:p-6 mb-4 max-w-4xl mx-auto animate-pop-in">
      <Separator className="my-4 md:my-5" />
      
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 md:gap-6 px-2 sm:px-4">
        {/* See pointer text - Desktop only */}
        <div className="hidden md:flex flex-shrink-0 flex-col items-center justify-center">
          <span className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary font-heading tracking-tight">See</span>
          <span className="text-4xl md:text-5xl lg:text-6xl animate-[bounce-x_1.5s_ease-in-out_infinite]">👉</span>
        </div>
        
        {/* Category buttons */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {/* Business Button */}
          <div className="flex items-center gap-2 md:block">
            <div className="flex flex-col items-center md:hidden flex-shrink-0">
              <span className="text-lg font-bold text-primary font-heading">See</span>
              <span className="text-xl animate-[bounce-x_1.5s_ease-in-out_infinite]">👉</span>
            </div>
            <Button 
              onClick={() => navigateTo("/businesses")}
              variant="outline" 
              className="flex-1 md:w-full h-28 md:h-36 flex flex-col items-center justify-center gap-3 md:gap-4 text-lg font-semibold border-primary/30 hover:bg-primary/10 py-4 md:py-6 hover:scale-105 transition-all duration-300 hover:shadow-lg group animate-slide-in-bottom"
              style={{ animationDelay: '0.1s' }}
            >
              <div className="rounded-full bg-gradient-to-br from-secondary to-secondary/80 p-3 md:p-4 mb-1 md:mb-2 group-hover:animate-bounce group-active:animate-button-press">
                <Handshake size={36} className="md:w-12 md:h-12 text-secondary-foreground transition-transform duration-300 group-hover:scale-110" />
              </div>
              <span className="font-heading text-base md:text-lg lg:text-base font-bold text-primary tracking-tight">Business Videos</span>
            </Button>
          </div>
          
          {/* Events Button */}
          <div className="flex items-center gap-2 md:block">
            <div className="flex flex-col items-center md:hidden flex-shrink-0">
              <span className="text-lg font-bold text-primary font-heading">See</span>
              <span className="text-xl animate-[bounce-x_1.5s_ease-in-out_infinite]">👉</span>
            </div>
            <Button 
              onClick={() => navigateTo("/events")}
              variant="outline" 
              className="flex-1 md:w-full h-28 md:h-36 flex flex-col items-center justify-center gap-3 md:gap-4 text-lg font-semibold border-primary/30 hover:bg-accent py-4 md:py-6 hover:scale-105 transition-all duration-300 hover:shadow-lg group animate-slide-in-bottom"
              style={{ animationDelay: '0.2s' }}
            >
              <div className="rounded-full bg-gradient-to-br from-pink-400 via-purple-400 to-indigo-400 p-3 md:p-4 mb-1 md:mb-2 group-hover:animate-bounce group-active:animate-button-press">
                <Calendar size={36} className="md:w-12 md:h-12 text-white transition-transform duration-300 group-hover:scale-110" />
              </div>
              <span className="font-heading text-base md:text-lg lg:text-base font-bold text-secondary tracking-tight">Events Videos</span>
            </Button>
          </div>
          
          {/* E-commerce Button */}
          <div className="flex items-center gap-2 md:block">
            <div className="flex flex-col items-center md:hidden flex-shrink-0">
              <span className="text-lg font-bold text-primary font-heading">See</span>
              <span className="text-xl animate-[bounce-x_1.5s_ease-in-out_infinite]">👉</span>
            </div>
            <Button 
              onClick={() => navigateTo("/ecommerce")}
              variant="outline" 
              className="flex-1 md:w-full h-28 md:h-36 flex flex-col items-center justify-center gap-3 md:gap-4 text-lg font-semibold border-primary/30 hover:bg-primary/10 py-4 md:py-6 hover:scale-105 transition-all duration-300 hover:shadow-lg group animate-slide-in-bottom"
              style={{ animationDelay: '0.3s' }}
            >
              <div className="rounded-full bg-gradient-to-br from-green-400 to-green-600 p-3 md:p-4 mb-1 md:mb-2 group-hover:animate-bounce group-active:animate-button-press">
                <ShoppingCart size={36} className="md:w-12 md:h-12 text-white transition-transform duration-300 group-hover:scale-110" />
              </div>
              <span className="font-heading text-lg md:text-xl lg:text-xl font-bold text-primary tracking-tight">E-commerce</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
