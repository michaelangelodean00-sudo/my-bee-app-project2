
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
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <span className="text-lg font-medium">Quick Access</span>
      </div>
      
      <Separator className="my-3" />
      
      <div className="flex justify-between items-center">
        <div className="flex gap-2 w-full justify-between">
          <Link to="/businesses" className="flex-1">
            <Button variant="ghost" size="sm" className="text-gray-600 w-full">
              <Building2 size={18} className="mr-2 text-bee-blue" />
              Business
            </Button>
          </Link>
          <Link to="/events" className="flex-1">
            <Button variant="ghost" size="sm" className="text-gray-600 w-full">
              <Calendar size={18} className="mr-2 text-bee-blue" />
              Events
            </Button>
          </Link>
          <Link to="/ecommerce" className="flex-1">
            <Button variant="ghost" size="sm" className="text-gray-600 w-full">
              <ShoppingBag size={18} className="mr-2 text-bee-blue" />
              E-commerce
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
