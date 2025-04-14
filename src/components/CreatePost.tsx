
import { useState } from "react";
import { Handshake, Drum, ShoppingCart } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";

const CreatePost = ({ onPostCreated }: { onPostCreated?: (post: any) => void }) => {
  const navigate = useNavigate();
  
  const navigateTo = (path: string) => {
    navigate(path);
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
        <Button 
          onClick={() => navigateTo("/businesses")}
          variant="outline" 
          className="w-full h-36 flex flex-col items-center justify-center gap-4 text-lg font-semibold border-bee-blue hover:bg-bee-blue/10 py-6"
        >
          <div className="rounded-full bg-gradient-to-br from-blue-400 to-blue-600 p-4 mb-2">
            <Handshake size={48} className="text-white" />
          </div>
          <span className="text-2xl font-extrabold text-[#8B5CF6] tracking-wide">Business</span>
        </Button>
        <Button 
          onClick={() => navigateTo("/events")}
          variant="outline" 
          className="w-full h-36 flex flex-col items-center justify-center gap-4 text-lg font-semibold border-bee-blue hover:bg-bee-blue/10 py-6"
        >
          <div className="rounded-full bg-gradient-to-br from-purple-400 to-purple-600 p-4 mb-2">
            <Drum size={48} className="text-white" />
          </div>
          <span className="text-2xl font-extrabold text-[#F97316] tracking-wide">Events</span>
        </Button>
        <Button 
          onClick={() => navigateTo("/ecommerce")}
          variant="outline" 
          className="w-full h-36 flex flex-col items-center justify-center gap-4 text-lg font-semibold border-bee-blue hover:bg-bee-blue/10 py-6"
        >
          <div className="rounded-full bg-gradient-to-br from-green-400 to-green-600 p-4 mb-2">
            <ShoppingCart size={48} className="text-white" />
          </div>
          <span className="text-2xl font-extrabold text-[#1EAEDB] tracking-wide">E-commerce</span>
        </Button>
      </div>
    </div>
  );
};

export default CreatePost;

