import { Link } from "react-router-dom";
import LogoImage from "./LogoImage";

interface LogoProps {
  className?: string;
}

const Logo = ({ className }: LogoProps) => {
  return (
    <Link
      to="/"
      className={`flex items-center gap-0 ${className ?? ''}`}
    >
      <div
        className="flex items-center will-change-transform backface-hidden origin-center overflow-hidden scale-100"
      >
        <div className="flex items-center flex-shrink-0">
          <LogoImage size="default" className="h-24 sm:h-16 md:h-20 w-auto" />
        </div>
      </div>
    </Link>
  );
};

export default Logo;
