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
      className={`flex flex-col items-center gap-1 ${className ?? ''}`}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      onClick={handleTap}
    >
      {/* Neon Slogan - solo cursive font, no box */}
      <span
        className="select-none"
        style={{
          fontFamily: "'Dancing Script', cursive",
          fontSize: 'clamp(1.4rem, 5vw, 2.4rem)',
          fontWeight: 700,
          letterSpacing: '0.02em',
          display: 'inline-block',
          transform: 'rotate(-3deg)',
          color: '#FF9500',
          textShadow: '0 0 6px #FF9500, 0 0 16px #FF6A00, 0 0 35px #FF6A00CC, 0 0 65px #E85000AA, 0 0 90px #C8400066',
          animationName: 'neonFlicker',
          animationDuration: '4s',
          animationTimingFunction: 'ease-in-out',
          animationIterationCount: 'infinite',
          marginBottom: '4px',
        }}
      >
        Feel the Buzz
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap');
          @keyframes neonFlicker {
            0%,  90% { opacity: 1;   text-shadow: 0 0 6px #FF9500, 0 0 16px #FF6A00, 0 0 35px #FF6A00CC, 0 0 65px #E85000AA; }
            91%       { opacity: 0.7; text-shadow: 0 0 3px #FF9500, 0 0 8px #FF6A0066; }
            92%       { opacity: 1;   text-shadow: 0 0 6px #FF9500, 0 0 16px #FF6A00, 0 0 35px #FF6A00CC; }
            94%       { opacity: 0.55; text-shadow: 0 0 2px #FF950088; }
            95%, 100% { opacity: 1;   text-shadow: 0 0 6px #FF9500, 0 0 16px #FF6A00, 0 0 35px #FF6A00CC, 0 0 65px #E85000AA; }
          }
        `}</style>
      </span>

      {/* Logo below slogan */}
      <div
        className={`transition-transform duration-150 ease-out flex-shrink-0 ${
          isPressed ? 'scale-90' : 'scale-100 hover:scale-105'
        }`}
      >
        <LogoImage size="large" />
      </div>
    </Link>
  );
};

export default Logo;
