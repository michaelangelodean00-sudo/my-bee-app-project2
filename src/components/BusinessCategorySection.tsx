import { useNavigate } from "react-router-dom";
import { UtensilsCrossed, Sparkles, ShoppingBag, Wrench, Car, HeartPulse, BriefcaseBusiness } from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { id: "food-dining",           label: "Food & Dining",         icon: UtensilsCrossed },
  { id: "beauty-wellness",       label: "Beauty & Wellness",     icon: Sparkles },
  { id: "retail-shopping",       label: "Retail & Shopping",     icon: ShoppingBag },
  { id: "home-trade-services",   label: "Home & Trade Services", icon: Wrench },
  { id: "auto-transport",        label: "Auto & Transport",      icon: Car },
  { id: "health-medical",        label: "Health & Medical",      icon: HeartPulse },
  { id: "professional-services", label: "Professional Services", icon: BriefcaseBusiness },
] as const;

const BusinessCategorySection = () => {
  const navigate = useNavigate();

  const handleClick = (id: string) => {
    navigate(`/businesses?category=${id}`);
  };

  return (
    <section aria-label="Browse business categories" className="w-full px-4 md:px-6 py-2.5 bg-card/60 border-b border-border">
      <div className="max-w-3xl mx-auto space-y-2">
        <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground text-center">
          Browse by Category
        </p>

        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 sm:gap-3">
          {CATEGORIES.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => handleClick(id)}
              className={cn(
                "group flex flex-col items-center gap-1.5 p-2 sm:p-3 rounded-xl",
                "border border-border bg-background/60 hover:bg-muted/50",
                "transition-all duration-200 hover:scale-105 hover:shadow-sm active:scale-95",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              )}
              aria-label={`Browse ${label}`}
            >
              <div className="p-2 rounded-full bg-muted text-muted-foreground group-hover:bg-muted-foreground/15 group-hover:text-foreground transition-colors">
                <Icon size={16} />
              </div>
              <span className="text-[10px] sm:text-xs font-medium text-muted-foreground group-hover:text-foreground text-center leading-tight line-clamp-2">
                {label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BusinessCategorySection;
