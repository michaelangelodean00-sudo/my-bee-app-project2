
import { useState } from "react";
import { Handshake, Drum, ShoppingCart } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";

interface CreatePostProps {
  onPostCreated?: (post: any) => void;
}

const CreatePost = ({ onPostCreated }: CreatePostProps) => {
  const navigate = useNavigate();
  
  const navigateTo = (path: string) => {
    navigate(path);
  };
  
  return (
    <div className="bee-card p-6 mb-6 max-w-4xl mx-auto">
      <div className="flex gap-4 items-center mb-4 justify-center">
        <Avatar className="w-16 h-16 shadow-elevation-2">
          <AvatarImage src="/lovable-uploads/d5511939-48e5-44cf-9f2b-d8f9e829b842.png" />
          <AvatarFallback>BEE</AvatarFallback>
        </Avatar>
        <span className="text-3xl font-bold text-bee-blue font-bebas-neue tracking-wider text-shadow-sm">B.E.E App</span>
      </div>
      
      <Separator className="my-5" />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 px-2 sm:px-4">
        <Button 
          onClick={() => navigateTo("/businesses")}
          variant="outline" 
          className="w-full h-36 flex flex-col items-center justify-center gap-4 text-lg font-semibold text-bee-blue border-bee-blue/30 hover:border-bee-blue hover:bg-bee-blue/5 py-6 professional-shadow"
        >
          <div className="rounded-full bg-gradient-to-br from-blue-400 to-blue-600 p-4 mb-2 shadow-elevation-2 floating">
            <Handshake size={48} className="text-white" />
          </div>
          Business
        </Button>
        <Button 
          onClick={() => navigateTo("/events")}
          variant="outline" 
          className="w-full h-36 flex flex-col items-center justify-center gap-4 text-lg font-semibold text-bee-blue border-bee-blue/30 hover:border-bee-blue hover:bg-bee-blue/5 py-6 professional-shadow"
        >
          <div className="rounded-full bg-gradient-to-br from-purple-400 to-purple-600 p-4 mb-2 shadow-elevation-2 floating">
            <Drum size={48} className="text-white" />
          </div>
          Events
        </Button>
        <Button 
          onClick={() => navigateTo("/ecommerce")}
          variant="outline" 
          className="w-full h-36 flex flex-col items-center justify-center gap-4 text-lg font-semibold text-bee-blue border-bee-blue/30 hover:border-bee-blue hover:bg-bee-blue/5 py-6 professional-shadow"
        >
          <div className="rounded-full bg-gradient-to-br from-green-400 to-green-600 p-4 mb-2 shadow-elevation-2 floating">
            <ShoppingCart size={48} className="text-white" />
          </div>
          E-commerce
        </Button>
      </div>
    </div>
  );
};

export default CreatePost;
