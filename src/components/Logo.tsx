import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import LogoImage from "./LogoImage";

interface LogoProps {
  className?: string;
}

const Logo = ({ className }: LogoProps) => {
  const [isPressed, setIsPressed] = useState(false);

  const handleTap = useCallback(() => {
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  }, []);

  return (
    <Link
      to="/"
      className={`flex items-center gap-0 ${className ?? ''}`}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      onClick={handleTap}
    >
      <div
        className={`transition-transform duration-150 ease-out flex items-center overflow-visible ${
          isPressed ? 'scale-90' : 'scale-100 hover:scale-105'
        }`}
      >
        {/* Logo image + tagline */}
        <div className="flex flex-col items-center gap-0 flex-shrink-0">
          <LogoImage size="default" className="h-36 sm:h-28 md:h-32 w-auto" />
          <span className="font-heading text-[9px] sm:text-[11px] md:text-[13px] tracking-[0.22em] uppercase text-foreground font-bold select-none self-start ml-0.5 whitespace-nowrap">
            Business&nbsp;&middot;&nbsp;Events&nbsp;&middot;&nbsp;E-commerce
          </span>
        </div>
      </div>
    </Link>
  );
};

export default Logo;
