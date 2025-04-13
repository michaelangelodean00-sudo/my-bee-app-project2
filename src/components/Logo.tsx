
import { Link } from "react-router-dom";
import LogoImage from "./LogoImage";
import LogoText from "./LogoText";

interface LogoProps {
  className?: string;
}

const Logo = ({ className }: LogoProps) => {
  return (
    <Link to="/" className={`flex items-center gap-4 ${className ?? ''}`}>
      <LogoImage size="default" />
      <LogoText />
    </Link>
  );
};

export default Logo;
