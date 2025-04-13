
import { Link } from "react-router-dom";

interface LogoProps {
  className?: string;
}

const Logo = ({ className }: LogoProps) => {
  return (
    <Link to="/" className={`flex items-center gap-2 ${className}`}>
      <img 
        src="/lovable-uploads/d5511939-48e5-44cf-9f2b-d8f9e829b842.png" 
        alt="B.E.E App Bahamas Logo" 
        className="h-20 sm:h-24 w-auto"
      />
      <span className="text-2xl font-bold text-bee-blue hidden sm:inline">B.E.E App</span>
    </Link>
  );
};

export default Logo;
