
import { useState } from "react";
import { Handshake, Calendar, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import VideoUploadForm from "./VideoUploadForm";

const CreatePost = ({ onPostCreated }: { onPostCreated?: (post: any) => void }) => {
  const navigate = useNavigate();
  
  const navigateTo = (path: string) => {
    navigate(path);
  };
  
  return (
    <div className="bee-card-premium p-4 mb-4 max-w-4xl mx-auto animate-float">
      <Separator className="my-4" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-2 sm:px-4">
        <Button 
          onClick={() => navigateTo("/businesses")}
          variant="outline" 
          className="w-full h-36 flex flex-col items-center justify-center gap-4 text-lg font-semibold border-bee-blue hover:bg-bee-blue/10 py-6 hover:scale-105 transition-all duration-300 hover:shadow-lg group"
        >
          <div className="rounded-full bg-gradient-to-br from-blue-400 to-blue-600 p-4 mb-2 group-hover:animate-bounce">
            <Handshake size={48} className="text-white transition-transform duration-300 group-hover:scale-110" />
          </div>
          <span className="text-xl sm:text-xl lg:text-2xl font-extrabold text-[#8B5CF6] tracking-wide">Business</span>
        </Button>
        
        <Button 
          onClick={() => navigateTo("/events")}
          variant="outline" 
          className="w-full h-36 flex flex-col items-center justify-center gap-4 text-lg font-semibold border-bee-blue hover:bg-bee-blue/10 py-6 hover:scale-105 transition-all duration-300 hover:shadow-lg group"
        >
          <div className="rounded-full bg-gradient-to-br from-pink-400 via-purple-400 to-indigo-400 p-4 mb-2 group-hover:animate-bounce">
            <Calendar size={48} className="text-white transition-transform duration-300 group-hover:scale-110" />
          </div>
          <span className="text-xl sm:text-xl lg:text-2xl font-extrabold text-[#F97316] tracking-wide">Events</span>
        </Button>
        
        <Button 
          onClick={() => navigateTo("/ecommerce")}
          variant="outline" 
          className="w-full h-36 flex flex-col items-center justify-center gap-4 text-lg font-semibold border-bee-blue hover:bg-bee-blue/10 py-6 hover:scale-105 transition-all duration-300 hover:shadow-lg group"
        >
          <div className="rounded-full bg-gradient-to-br from-green-400 to-green-600 p-4 mb-2 group-hover:animate-bounce">
            <ShoppingCart size={48} className="text-white transition-transform duration-300 group-hover:scale-110" />
          </div>
          <span className="text-xl sm:text-xl lg:text-2xl font-extrabold text-[#1EAEDB] tracking-wide">E-commerce</span>
        </Button>
        
        <VideoUploadForm />
      </div>
    </div>
  );
};

export default CreatePost;
