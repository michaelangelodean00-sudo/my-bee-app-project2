
import { Link } from "react-router-dom";
import LogoImage from "./LogoImage";
import LogoText from "./LogoText";

interface LogoProps {
  className?: string;
}

const Logo = ({ className }: LogoProps) => {
  return (
    <Link to="/" className={`flex items-center gap-4 ${className ?? ''}`}>
      <LogoImage size="xlarge" />
      <LogoText className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl" />
    </Link>
  );
};

export default Logo;
