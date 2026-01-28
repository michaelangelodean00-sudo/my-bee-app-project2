
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
    <div className="bee-card-premium p-4 mb-4 max-w-4xl mx-auto animate-pop-in">
      <Separator className="my-4" />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-2 sm:px-4">
        <Button 
          onClick={() => navigateTo("/businesses")}
          variant="outline" 
          className="w-full h-36 flex flex-col items-center justify-center gap-4 text-lg font-semibold border-bee-blue hover:bg-bee-blue/10 py-6 hover:scale-105 transition-all duration-300 hover:shadow-lg group animate-slide-in-bottom opacity-0"
          style={{ animationDelay: '0.1s' }}
        >
          <div className="rounded-full bg-gradient-to-br from-blue-400 to-blue-600 p-4 mb-2 group-hover:animate-bounce group-active:animate-button-press">
            <Handshake size={48} className="text-white transition-transform duration-300 group-hover:scale-110" />
          </div>
          <span className="font-heading text-2xl sm:text-2xl lg:text-xl font-bold text-primary tracking-tight">Business</span>
        </Button>
        
        <Button 
          onClick={() => navigateTo("/events")}
          variant="outline" 
          className="w-full h-36 flex flex-col items-center justify-center gap-4 text-lg font-semibold border-bee-blue hover:bg-bee-blue/10 py-6 hover:scale-105 transition-all duration-300 hover:shadow-lg group animate-slide-in-bottom opacity-0"
          style={{ animationDelay: '0.2s' }}
        >
          <div className="rounded-full bg-gradient-to-br from-pink-400 via-purple-400 to-indigo-400 p-4 mb-2 group-hover:animate-bounce group-active:animate-button-press">
            <Calendar size={48} className="text-white transition-transform duration-300 group-hover:scale-110" />
          </div>
          <span className="font-heading text-2xl sm:text-2xl lg:text-xl font-bold text-secondary tracking-tight">Events</span>
        </Button>
        
        <Button 
          onClick={() => navigateTo("/ecommerce")}
          variant="outline" 
          className="w-full h-36 flex flex-col items-center justify-center gap-4 text-lg font-semibold border-bee-blue hover:bg-bee-blue/10 py-6 hover:scale-105 transition-all duration-300 hover:shadow-lg group animate-slide-in-bottom opacity-0"
          style={{ animationDelay: '0.3s' }}
        >
          <div className="rounded-full bg-gradient-to-br from-green-400 to-green-600 p-4 mb-2 group-hover:animate-bounce group-active:animate-button-press">
            <ShoppingCart size={48} className="text-white transition-transform duration-300 group-hover:scale-110" />
          </div>
          <span className="font-heading text-xl md:text-lg lg:text-xl font-bold text-primary tracking-tight">E-commerce</span>
        </Button>
      </div>
    </div>
  );
};

export default CreatePost;
