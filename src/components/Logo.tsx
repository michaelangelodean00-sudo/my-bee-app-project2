import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import LogoImage from "./LogoImage";
import bahamasSilhouette from "../assets/bahamas-silhouette-accurate.png";

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
          <LogoImage size="default" className="h-8 sm:h-9 md:h-14 w-auto" />
          <span
            className="text-[6px] sm:text-[8px] md:text-[9px] tracking-[0.15em] uppercase text-foreground font-bold select-none self-start ml-0.5 whitespace-nowrap"
            style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
          >
            Business&nbsp;&middot;&nbsp;Events&nbsp;&middot;&nbsp;E-commerce
          </span>
        </div>

        {/* Bahamas islands silhouette — hidden on sm to save header space, visible md+ */}
        <img
          src={bahamasSilhouette}
          alt=""
          aria-hidden="true"
          className="hidden md:block h-20 md:h-20 w-auto opacity-80 flex-shrink-0 select-none ml-1"
        />
      </div>
    </Link>
  );
};

export default Logo;
