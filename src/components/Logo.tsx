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
      {/* Neon Store Sign Slogan ABOVE logo */}
      <div
        className="select-none relative"
        style={{
          transform: 'rotate(-3deg)',
          display: 'inline-block',
          padding: '4px 14px 6px 14px',
          border: '2px solid #FF6D00',
          borderRadius: '4px',
          boxShadow: '0 0 8px #FF6D0088, 0 0 20px #FF6D0044, inset 0 0 10px #FF6D0022, 2px 2px 0 #000',
          background: 'rgba(0,0,0,0.7)',
          marginBottom: '2px',
        }}
      >
        {/* Neon tube border glow effect */}
        <div style={{
          position: 'absolute', inset: '-4px', borderRadius: '6px',
          border: '1px solid #FF6D0055',
          pointerEvents: 'none',
        }} />
        <span
          style={{
            fontFamily: "'Bangers', cursive",
            fontSize: 'clamp(1.3rem, 4.5vw, 2.1rem)',
            fontWeight: 400,
            letterSpacing: '0.18em',
            display: 'inline-block',
            background: 'linear-gradient(90deg, #FF1744 0%, #FF6D00 20%, #FFD600 40%, #00E676 55%, #00E5FF 70%, #D500F9 85%, #FF1744 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: 'drop-shadow(0 0 6px #FF6D00) drop-shadow(0 0 14px #FF1744AA)',
            animationName: 'neonFlicker',
            animationDuration: '3.5s',
            animationTimingFunction: 'ease-in-out',
            animationIterationCount: 'infinite',
            willChange: 'filter, opacity',
          }}
        >
          FEEL THE BUZZ
        </span>
        <style>{`
          @keyframes neonFlicker {
            0%,  94% { filter: drop-shadow(0 0 6px #FF6D00) drop-shadow(0 0 14px #FF1744AA); opacity: 1; }
            95%       { filter: drop-shadow(0 0 2px #FF6D00) drop-shadow(0 0 4px #FF174466);  opacity: 0.7; }
            96%       { filter: drop-shadow(0 0 6px #FF6D00) drop-shadow(0 0 14px #FF1744AA); opacity: 1; }
            97%       { filter: drop-shadow(0 0 1px #FF6D00) drop-shadow(0 0 2px #FF174433);  opacity: 0.5; }
            98%, 100% { filter: drop-shadow(0 0 6px #FF6D00) drop-shadow(0 0 14px #FF1744AA); opacity: 1; }
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
