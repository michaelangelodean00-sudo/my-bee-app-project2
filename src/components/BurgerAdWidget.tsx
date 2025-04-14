
import { Sandwich } from "lucide-react";

const BurgerAdWidget = () => {
  return (
    <div className="bg-amber-600 text-white px-3 py-2 rounded-lg flex items-center mr-2">
      <div className="flex items-center">
        <img 
          src="https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=64&h=64&auto=format&fit=crop"
          alt="Burger Promotion" 
          className="w-8 h-8 rounded-full object-cover mr-2"
        />
        <div>
          <p className="text-xs font-bold whitespace-nowrap">
            Try the new<br />
            <span className="text-yellow-300">Deluxe Burger</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default BurgerAdWidget;
