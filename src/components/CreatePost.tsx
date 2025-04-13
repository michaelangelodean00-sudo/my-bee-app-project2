
import { useState } from "react";
import { Handshake, Drum, ShoppingCart } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";

interface CreatePostProps {
  onPostCreated?: (post: any) => void;
}

const CreatePost = ({ onPostCreated }: CreatePostProps) => {
  return (
    <div className="bee-card p-4 mb-4">
      <div className="flex gap-3 items-center mb-3">
        <Avatar className="w-16 h-16">
          <AvatarImage src="/lovable-uploads/d5511939-48e5-44cf-9f2b-d8f9e829b842.png" />
          <AvatarFallback>BEE</AvatarFallback>
        </Avatar>
        <span className="text-3xl font-bold text-bee-blue font-bebas-neue tracking-wider">B.E.E App</span>
      </div>
      
      <Separator className="my-3" />
      
      <div className="grid grid-cols-3 gap-4">
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
          >
            <div className="rounded-full bg-gradient-to-br from-purple-400 to-purple-600 p-4 mb-2">
              <Drum size={48} className="text-white" />
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
