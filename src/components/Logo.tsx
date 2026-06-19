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
        {/* Logo image + tagline */}
        <div className="flex flex-col items-center gap-0 flex-shrink-0">
          <LogoImage size="default" className="h-28 sm:h-16 md:h-20 w-auto" />
          <span className="font-heading text-[9px] sm:text-[11px] md:text-[13px] tracking-[0.22em] uppercase text-foreground font-bold select-none self-start ml-0.5 whitespace-nowrap">
            Business&nbsp;&middot;&nbsp;Events&nbsp;&middot;&nbsp;E-commerce
          </span>
        </div>
      </div>
    </Link>
  );
};

export default Logo;
