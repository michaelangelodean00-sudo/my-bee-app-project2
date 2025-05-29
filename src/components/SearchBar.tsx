
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      console.log("Searching for:", searchTerm);
      // Here you would implement actual search functionality
      // For now, we'll just log the search term
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  return (
    <form onSubmit={handleSearch} className="relative max-w-md w-full">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
      <Input
        type="search"
        placeholder="Search B.E.E App..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-10 pr-10 bg-gray-100 dark:bg-gray-800 border-none dark:text-white"
      />
      {searchTerm && (
        <button
          type="button"
          onClick={clearSearch}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
        >
          <X size={16} />
        </button>
      )}
    </form>
  );
};

export default SearchBar;
