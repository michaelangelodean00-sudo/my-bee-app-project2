
import { useState } from "react";
import { Handshake, Drum, ShoppingCart } from "lucide-react";
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
    <div className="bee-card p-4 mb-4 max-w-4xl mx-auto">
      <Separator className="my-4" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-2 sm:px-4">
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
        
        <VideoUploadForm />
      </div>
    </div>
  );
};

export default CreatePost;
