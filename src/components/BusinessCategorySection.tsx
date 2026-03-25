import { useNavigate } from "react-router-dom";
import { UtensilsCrossed, Sparkles, ShoppingBag, Wrench, Car, CalendarDays, BriefcaseBusiness } from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { id: "food-dining",           label: "Food & Dining",         icon: UtensilsCrossed, color: "from-orange-500 to-amber-500" },
  { id: "beauty-wellness",       label: "Beauty & Wellness",     icon: Sparkles,        color: "from-pink-500 to-rose-400" },
  { id: "retail-shopping",       label: "Retail & Shopping",     icon: ShoppingBag,     color: "from-violet-500 to-purple-400" },
  { id: "home-trade-services",   label: "Home & Trade Services", icon: Wrench,          color: "from-sky-500 to-blue-400" },
  { id: "auto-transport",        label: "Auto & Transport",      icon: Car,             color: "from-slate-500 to-zinc-400" },
  { id: "events",                label: "Events",                icon: CalendarDays,    color: "from-fuchsia-500 to-pink-400" },
  { id: "professional-services", label: "Professional Services", icon: BriefcaseBusiness, color: "from-teal-500 to-emerald-400" },
] as const;

const BusinessCategorySection = () => {
  const navigate = useNavigate();

  const handleClick = (id: string) => {
    navigate(`/businesses?category=${id}`);
  };

  return (
    <section aria-label="Browse business categories" className="w-full px-4 md:px-6 py-4 bg-card/60 border-b border-border">
      <div className="max-w-3xl mx-auto space-y-3">
        <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground text-center">
          Browse by Category
        </p>

        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 sm:gap-3">
          {CATEGORIES.map(({ id, label, icon: Icon, color }) => (
            <button
              key={id}
              onClick={() => handleClick(id)}
              className={cn(
                "flex flex-col items-center gap-1.5 p-2 sm:p-3 rounded-xl",
                "border border-border bg-background/60 hover:bg-accent/60",
                "transition-all duration-200 hover:scale-105 hover:shadow-md active:scale-95",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              )}
              aria-label={`Browse ${label}`}
            >
              <div className={cn("p-2 rounded-full bg-gradient-to-br text-white", color)}>
                <Icon size={16} />
              </div>
              <span className="text-[10px] sm:text-xs font-medium text-foreground text-center leading-tight line-clamp-2">
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
