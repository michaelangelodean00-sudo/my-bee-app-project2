import { Handshake, Calendar, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const CreatePost = ({ onPostCreated }: { onPostCreated?: (post: any) => void }) => {
  const navigate = useNavigate();
  
  const navigateTo = (path: string) => {
    navigate(path);
  };
  
  return (
    <div className="bee-card p-4 md:p-5 max-w-4xl mx-auto animate-fade-in">
      <div className="grid grid-cols-3 gap-3 md:gap-4">
        <Button 
          onClick={() => navigateTo("/businesses")}
          variant="outline" 
          className="w-full h-24 md:h-28 flex flex-col items-center justify-center gap-2 text-base font-semibold border-border hover:border-primary/40 hover:bg-primary/5 py-4 hover:scale-[1.02] transition-all duration-200 group"
        >
          <div className="rounded-full bg-gradient-to-br from-blue-400 to-blue-600 p-3 group-hover:scale-105 transition-transform">
            <Handshake size={28} className="text-white" />
          </div>
          <span className="font-heading text-sm md:text-base font-bold text-primary">Business</span>
        </Button>
        
        <Button 
          onClick={() => navigateTo("/events")}
          variant="outline" 
          className="w-full h-24 md:h-28 flex flex-col items-center justify-center gap-2 text-base font-semibold border-border hover:border-secondary/40 hover:bg-secondary/5 py-4 hover:scale-[1.02] transition-all duration-200 group"
        >
          <div className="rounded-full bg-gradient-to-br from-pink-400 via-purple-400 to-indigo-400 p-3 group-hover:scale-105 transition-transform">
            <Calendar size={28} className="text-white" />
          </div>
          <span className="font-heading text-sm md:text-base font-bold text-secondary">Events</span>
        </Button>
        
        <Button 
          onClick={() => navigateTo("/ecommerce")}
          variant="outline" 
          className="w-full h-24 md:h-28 flex flex-col items-center justify-center gap-2 text-base font-semibold border-border hover:border-primary/40 hover:bg-primary/5 py-4 hover:scale-[1.02] transition-all duration-200 group"
        >
          <div className="rounded-full bg-gradient-to-br from-green-400 to-green-600 p-3 group-hover:scale-105 transition-transform">
            <ShoppingCart size={28} className="text-white" />
          </div>
          <span className="font-heading text-sm md:text-base font-bold text-primary">E-commerce</span>
        </Button>
      </div>
    </div>
  );
};

export default CreatePost;
