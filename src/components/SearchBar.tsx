
import { Search, X, Filter, MapPin, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { sanitizeSearch, rateLimit } from "@/utils/sanitization";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const sanitized = sanitizeSearch(searchTerm);
    if (!sanitized.trim()) return;

    if (!rateLimit("search", 20, 60_000)) {
      return; // silently block excessive search spam
    }

    // TODO: wire up to real search API
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Sanitize on every keystroke — prevents pasting of malicious content
    const raw = e.target.value;
    setSearchTerm(sanitizeSearch(raw));
  };

  const clearSearch = () => setSearchTerm("");

  const filters = [
    { id: "all", label: "All", icon: Search },
    { id: "businesses", label: "Businesses", icon: MapPin },
    { id: "events", label: "Events", icon: Calendar },
    { id: "products", label: "Products", icon: Search },
  ];

  return (
    <div className="flex items-center gap-2 max-w-md w-full">
      <form onSubmit={handleSearch} className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
        <Input
          type="search"
          placeholder={`Search ${activeFilter === "all" ? "B.E.E App" : filters.find(f => f.id === activeFilter)?.label}...`}
          value={searchTerm}
          onChange={handleInputChange}
          maxLength={120}
          autoComplete="off"
          spellCheck={false}
          className="pl-10 pr-10 bg-muted/60 border-none"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 min-w-[32px] min-h-[32px] flex items-center justify-center touch-manipulation active:scale-90"
          >
            <X size={16} />
          </button>
        )}
      </form>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="flex-shrink-0">
            <Filter size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Filter by</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {filters.map((filter) => {
            const Icon = filter.icon;
            return (
              <DropdownMenuItem
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={activeFilter === filter.id ? "bg-accent text-accent-foreground" : ""}
              >
                <Icon size={16} className="mr-2" />
                {filter.label}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default SearchBar;
