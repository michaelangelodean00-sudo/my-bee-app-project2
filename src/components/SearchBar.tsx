
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

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      console.log("Searching for:", searchTerm, "Filter:", activeFilter);
      // Here you would implement actual search functionality
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  const filters = [
    { id: "all", label: "All", icon: Search },
    { id: "businesses", label: "Businesses", icon: MapPin },
    { id: "events", label: "Events", icon: Calendar },
    { id: "products", label: "Products", icon: Search },
  ];

  return (
    <div className="flex items-center gap-2 max-w-md w-full">
      <form onSubmit={handleSearch} className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
        <Input
          type="search"
          placeholder={`Search ${activeFilter === "all" ? "B.E.E App" : filters.find(f => f.id === activeFilter)?.label}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-10 bg-gray-100 dark:bg-gray-800 border-none dark:text-white"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 p-1 min-w-[32px] min-h-[32px] flex items-center justify-center touch-manipulation active:scale-90"
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
                className={activeFilter === filter.id ? "bg-blue-50 text-blue-700" : ""}
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
