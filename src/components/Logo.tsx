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
      {/* Slogan ABOVE logo */}
      <div className="select-none flex items-center gap-0.5">
        {['F','e','e','l',' ','t','h','e',' ','B','u','z','z'].map((char, i) => (
          <span
            key={i}
            className="buzz-char"
            style={{
              fontFamily: "'Boogaloo', cursive",
              fontSize: 'clamp(1.1rem, 3.5vw, 1.7rem)',
              fontWeight: 400,
              display: 'inline-block',
              animationName: 'neonPop',
              animationDuration: '1.8s',
              animationTimingFunction: 'ease-in-out',
              animationIterationCount: 'infinite',
              animationDelay: `${i * 0.08}s`,
              color: char === ' ' ? 'transparent' : undefined,
              background: char === ' ' ? 'none' : `linear-gradient(180deg, #FCD34D 0%, #F59E0B 50%, #EF4444 100%)`,
              backgroundSize: char === ' ' ? undefined : '100% 200%',
              WebkitBackgroundClip: char === ' ' ? undefined : 'text',
              WebkitTextFillColor: char === ' ' ? 'transparent' : 'transparent',
              backgroundClip: char === ' ' ? undefined : 'text',
              filter: char === ' ' ? 'none' : 'drop-shadow(0 0 6px rgba(251,191,36,0.9)) drop-shadow(0 0 12px rgba(245,158,11,0.6))',
              letterSpacing: '0.03em',
              lineHeight: 1,
              minWidth: char === ' ' ? '0.3em' : undefined,
            }}
          >
            {char}
          </span>
        ))}
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Boogaloo&display=swap');

          @keyframes neonPop {
            0%   { transform: translateY(0px) scale(1); filter: drop-shadow(0 0 4px rgba(251,191,36,0.8)) drop-shadow(0 0 10px rgba(245,158,11,0.5)); }
            30%  { transform: translateY(-4px) scale(1.15); filter: drop-shadow(0 0 10px rgba(252,211,77,1)) drop-shadow(0 0 20px rgba(245,158,11,0.9)) drop-shadow(0 0 30px rgba(239,68,68,0.5)); }
            60%  { transform: translateY(-1px) scale(1.05); filter: drop-shadow(0 0 6px rgba(251,191,36,0.9)) drop-shadow(0 0 14px rgba(239,68,68,0.6)); }
            100% { transform: translateY(0px) scale(1); filter: drop-shadow(0 0 4px rgba(251,191,36,0.8)) drop-shadow(0 0 10px rgba(245,158,11,0.5)); }
          }
        `}</style>
      </div>

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
