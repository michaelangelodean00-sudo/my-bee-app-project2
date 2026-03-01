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
      {/* Neon Slogan - solo font, no box */}
      <span
        className="select-none"
        style={{
          fontFamily: "'Pacifico', cursive",
          fontSize: 'clamp(1.2rem, 4vw, 2rem)',
          fontWeight: 400,
          letterSpacing: '0.04em',
          display: 'inline-block',
          transform: 'rotate(-3deg)',
          color: '#FFD580',
          textShadow: '0 0 7px #FFD580, 0 0 18px #E8A020, 0 0 40px #E8A020BB, 0 0 70px #C8780088',
          animationName: 'neonFlicker',
          animationDuration: '4s',
          animationTimingFunction: 'ease-in-out',
          animationIterationCount: 'infinite',
          marginBottom: '4px',
        }}
      >
        Feel the Buzz
        <style>{`
          @keyframes neonFlicker {
            0%,  90% { opacity: 1;   text-shadow: 0 0 7px #FFD580, 0 0 18px #E8A020, 0 0 40px #E8A020BB, 0 0 70px #C8780088; }
            91%       { opacity: 0.75; text-shadow: 0 0 3px #FFD580, 0 0 8px #E8A02066; }
            92%       { opacity: 1;   text-shadow: 0 0 7px #FFD580, 0 0 18px #E8A020, 0 0 40px #E8A020BB; }
            94%       { opacity: 0.6;  text-shadow: 0 0 2px #FFD58088; }
            95%, 100% { opacity: 1;   text-shadow: 0 0 7px #FFD580, 0 0 18px #E8A020, 0 0 40px #E8A020BB, 0 0 70px #C8780088; }
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
