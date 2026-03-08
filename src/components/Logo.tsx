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
      className={`flex items-center gap-2 ${className ?? ''}`}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      onClick={handleTap}
    >
      {/* Bahamas islands silhouette — LEFT side */}
      <BahamasSilhouette className="h-16 sm:h-20 md:h-24 w-auto text-foreground opacity-75 flex-shrink-0 select-none" />

      {/* Logo + tagline */}
      <div
        className={`transition-transform duration-150 ease-out flex-shrink-0 flex flex-col items-center gap-1 ${
          isPressed ? 'scale-90' : 'scale-100 hover:scale-105'
        }`}
      >
        <LogoImage size="large" />
        <span
          className="text-[10px] tracking-[0.22em] uppercase text-foreground font-bold select-none self-start ml-1"
          style={{ fontFamily: "'Georgia', 'Times New Roman', serif", letterSpacing: '0.22em' }}
        >
          Business&nbsp;&middot;&nbsp;Events&nbsp;&middot;&nbsp;E-commerce
        </span>
      </div>
    </Link>
  );
};

export default Logo;
