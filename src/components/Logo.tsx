
import { Link } from "react-router-dom";

interface LogoProps {
  className?: string;
}

const Logo = ({ className }: LogoProps) => {
  return (
    <Link to="/" className={`flex items-center gap-2 ${className}`}>
      <img 
        src="/lovable-uploads/f4a4e8e5-574a-4d93-88f9-155b1f4b2e32.png" 
        alt="B.E.E App Bahamas Logo" 
        className="h-24 sm:h-32 w-auto max-h-32" // Increased size with max-height to prevent overflow
      />
      <span className="text-2xl sm:text-3xl font-bold text-bee-blue hidden sm:inline font-bebas-neue">B.E.E App</span>
    </Link>
  );
};

export default Logo;
