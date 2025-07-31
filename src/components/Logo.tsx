
import { Link } from "react-router-dom";
import LogoImage from "./LogoImage";
import LogoText from "./LogoText";

interface LogoProps {
  className?: string;
}

const Logo = ({ className }: LogoProps) => {
  return (
    <Link to="/" className={`flex items-center gap-2 sm:gap-4 ${className ?? ''}`}>
      <LogoImage size="default" className="sm:h-28 sm:max-h-28 md:h-32 md:max-h-32" />
      <LogoText className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl" />
    </Link>
  );
};

export default Logo;
