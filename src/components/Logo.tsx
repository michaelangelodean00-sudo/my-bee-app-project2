
import { Link } from "react-router-dom";
import LogoImage from "./LogoImage";

interface LogoProps {
  className?: string;
}

const Logo = ({ className }: LogoProps) => {
  return (
    <Link to="/" className={`flex items-center gap-3 ${className ?? ''}`}>
      <LogoImage size="large" />
    </Link>
  );
};

export default Logo;
