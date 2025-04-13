
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const SearchBar = () => {
  return (
    <div className="relative max-w-md w-full">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
      <Input
        type="search"
        placeholder="Search B.E.E App..."
        className="pl-10 bg-gray-100 border-none"
      />
    </div>
  );
};

export default SearchBar;
