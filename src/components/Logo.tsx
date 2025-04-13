
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
        className="h-20 sm:h-24 w-auto" // Increased size but still prevents spillover
      />
      <span className="text-2xl font-bold text-bee-blue hidden sm:inline font-bebas-neue">B.E.E App</span>
    </Link>
  );
};

export default Logo;
