
import { Link } from "react-router-dom";
import LogoImage from "./LogoImage";
import LogoText from "./LogoText";

interface LogoProps {
  className?: string;
}

const Logo = ({ className }: LogoProps) => {
  return (
    <Link to="/" className={`flex items-center ${className ?? ''}`}>
      <LogoImage size="large" />
    </Link>
  );
};

export default Logo;
