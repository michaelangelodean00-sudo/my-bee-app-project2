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
      <div className="select-none flex items-center" style={{ gap: '0.04em' }}>
        {[
          { char: 'F', color: '#FF1744', glow: '#FF1744' },
          { char: 'E', color: '#FF6D00', glow: '#FF6D00' },
          { char: 'E', color: '#FFD600', glow: '#FFD600' },
          { char: 'L', color: '#00E676', glow: '#00E676' },
          { char: ' ', color: 'transparent', glow: 'transparent' },
          { char: 'T', color: '#00E5FF', glow: '#00E5FF' },
          { char: 'H', color: '#D500F9', glow: '#D500F9' },
          { char: 'E', color: '#FF1744', glow: '#FF1744' },
          { char: ' ', color: 'transparent', glow: 'transparent' },
          { char: 'B', color: '#FFEA00', glow: '#FFEA00' },
          { char: 'U', color: '#FF6D00', glow: '#FF6D00' },
          { char: 'Z', color: '#00E5FF', glow: '#00E5FF' },
          { char: 'Z', color: '#FF1744', glow: '#FF1744' },
        ].map(({ char, color, glow }, i) => (
          <span
            key={i}
            style={{
              fontFamily: "'Bangers', cursive",
              fontSize: 'clamp(1.7rem, 5.5vw, 2.8rem)',
              fontWeight: 400,
              display: 'inline-block',
              color: char === ' ' ? 'transparent' : color,
              textShadow: char === ' ' ? 'none'
                : `0 0 6px ${glow}, 0 0 18px ${glow}, 0 0 40px ${glow}88, 3px 3px 0px #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000`,
              letterSpacing: '0.1em',
              lineHeight: 1,
              minWidth: char === ' ' ? '0.3em' : undefined,
              animationName: char === ' ' ? 'none' : 'buzzPop',
              animationDuration: `${1.6 + (i % 3) * 0.3}s`,
              animationTimingFunction: 'cubic-bezier(.36,.07,.19,.97)',
              animationIterationCount: 'infinite',
              animationDelay: `${i * 0.12}s`,
              willChange: 'transform, filter',
              WebkitTextStroke: char === ' ' ? 'none' : '0.5px rgba(0,0,0,0.8)',
            }}
          >
            {char}
          </span>
        ))}
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Bangers&display=swap');
          @keyframes buzzPop {
            0%   { transform: translateY(0) rotate(0deg) scale(1); filter: brightness(1); }
            8%   { transform: translateY(-8px) rotate(-4deg) scale(1.25); filter: brightness(1.6) saturate(2); }
            16%  { transform: translateY(3px) rotate(3deg) scale(0.92); filter: brightness(0.9); }
            24%  { transform: translateY(-4px) rotate(-2deg) scale(1.12); filter: brightness(1.4) saturate(1.8); }
            32%  { transform: translateY(2px) rotate(1deg) scale(1.04); filter: brightness(1.1); }
            40%  { transform: translateY(-2px) rotate(-1deg) scale(1.08); filter: brightness(1.3); }
            50%  { transform: translateY(0) rotate(0deg) scale(1); filter: brightness(1); }
            100% { transform: translateY(0) rotate(0deg) scale(1); filter: brightness(1); }
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
