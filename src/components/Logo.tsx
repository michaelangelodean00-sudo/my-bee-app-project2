
import { Link } from "react-router-dom";
import LogoImage from "./LogoImage";
import LogoText from "./LogoText";

interface LogoProps {
  className?: string;
}

const Logo = ({ className }: LogoProps) => {
  return (
    <Link to="/" className={`flex items-center gap-3 ${className ?? ''}`}>
      <LogoImage size="large" /> {/* Reduced from 'xlarge' to 'large' */}
      <LogoText />
    </Link>
  );
};

export default Logo;
