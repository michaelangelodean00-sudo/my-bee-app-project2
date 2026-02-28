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
      <div className="select-none flex items-center" style={{ gap: '0.05em' }}>
        {[
          { char: 'F', color: '#FF3D00' },
          { char: 'E', color: '#FF6D00' },
          { char: 'E', color: '#FFAB00' },
          { char: 'L', color: '#FFD600' },
          { char: ' ', color: 'transparent' },
          { char: 'T', color: '#00E5FF' },
          { char: 'H', color: '#00BFA5' },
          { char: 'E', color: '#1DE9B6' },
          { char: ' ', color: 'transparent' },
          { char: 'B', color: '#FF3D00' },
          { char: 'U', color: '#FF6D00' },
          { char: 'Z', color: '#FFAB00' },
          { char: 'Z', color: '#FFD600' },
        ].map(({ char, color }, i) => (
          <span
            key={i}
            style={{
              fontFamily: "'Bangers', cursive",
              fontSize: 'clamp(1.4rem, 4.5vw, 2.2rem)',
              fontWeight: 400,
              display: 'inline-block',
              color: char === ' ' ? 'transparent' : color,
              textShadow: char === ' ' ? 'none'
                : `0 0 8px ${color}, 0 0 20px ${color}99, 2px 2px 0px #000, -1px -1px 0 #000`,
              letterSpacing: '0.08em',
              lineHeight: 1,
              minWidth: char === ' ' ? '0.25em' : undefined,
              animationName: char === ' ' ? 'none' : 'buzzJolt',
              animationDuration: '2.2s',
              animationTimingFunction: 'cubic-bezier(.36,.07,.19,.97)',
              animationIterationCount: 'infinite',
              animationDelay: `${i * 0.1}s`,
              willChange: 'transform',
            }}
          >
            {char}
          </span>
        ))}
        <style>{`
          @keyframes buzzJolt {
            0%   { transform: translateY(0) rotate(0deg) scale(1); }
            10%  { transform: translateY(-5px) rotate(-3deg) scale(1.18); }
            20%  { transform: translateY(2px) rotate(2deg) scale(0.95); }
            30%  { transform: translateY(-3px) rotate(-1deg) scale(1.1); }
            40%  { transform: translateY(1px) rotate(1deg) scale(1.02); }
            50%  { transform: translateY(0) rotate(0deg) scale(1); }
            100% { transform: translateY(0) rotate(0deg) scale(1); }
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
