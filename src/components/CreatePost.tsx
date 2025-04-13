
import { useState } from "react";
import { Building2, Calendar, ShoppingBag } from "lucide-react";
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
            className="w-full h-20 flex flex-col items-center justify-center gap-2 text-sm font-semibold text-bee-blue border-bee-blue hover:bg-bee-blue/10"
          >
            <Building2 size={32} className="text-bee-blue" />
            Business
          </Button>
        </Link>
        <Link to="/events" className="w-full">
          <Button 
            variant="outline" 
            className="w-full h-20 flex flex-col items-center justify-center gap-2 text-sm font-semibold text-bee-blue border-bee-blue hover:bg-bee-blue/10"
          >
            <Calendar size={32} className="text-bee-blue" />
            Events
          </Button>
        </Link>
        <Link to="/ecommerce" className="w-full">
          <Button 
            variant="outline" 
            className="w-full h-20 flex flex-col items-center justify-center gap-2 text-sm font-semibold text-bee-blue border-bee-blue hover:bg-bee-blue/10"
          >
            <ShoppingBag size={32} className="text-bee-blue" />
            E-commerce
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default CreatePost;
