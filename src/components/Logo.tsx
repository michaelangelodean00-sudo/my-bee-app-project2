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
          fontFamily: "'Sacramento', cursive",
          fontSize: 'clamp(2.2rem, 8vw, 4rem)',
          fontWeight: 700,
          letterSpacing: '0.02em',
          display: 'inline-block',
          transform: 'rotate(-3deg)',
          color: '#3B9EFF',
          textShadow: '0 0 6px #3B9EFF, 0 0 16px #1A7AFF, 0 0 35px #1A7AFFCC, 0 0 65px #0055FFAA, 0 0 90px #0033CC66',
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
            0%,  90% { opacity: 1;   text-shadow: 0 0 6px #3B9EFF, 0 0 16px #1A7AFF, 0 0 35px #1A7AFFCC, 0 0 65px #0055FFAA; }
            91%       { opacity: 0.7; text-shadow: 0 0 3px #3B9EFF, 0 0 8px #1A7AFF66; }
            92%       { opacity: 1;   text-shadow: 0 0 6px #3B9EFF, 0 0 16px #1A7AFF, 0 0 35px #1A7AFFCC; }
            94%       { opacity: 0.55; text-shadow: 0 0 2px #3B9EFF88; }
            95%, 100% { opacity: 1;   text-shadow: 0 0 6px #3B9EFF, 0 0 16px #1A7AFF, 0 0 35px #1A7AFFCC, 0 0 65px #0055FFAA; }
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
