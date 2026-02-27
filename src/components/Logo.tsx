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
      className={`flex items-center gap-3 ${className ?? ''}`}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      onClick={handleTap}
    >
      <div 
        className={`transition-transform duration-150 ease-out flex-shrink-0 ${
          isPressed ? 'scale-90' : 'scale-100 hover:scale-105'
        }`}
      >
        <LogoImage size="large" />
      </div>

      {/* Slogan */}
      <div className="flex flex-col leading-none select-none">
        <span
          className="buzz-slogan"
          style={{
            fontFamily: "'Pacifico', cursive",
            fontSize: 'clamp(0.75rem, 2vw, 1.1rem)',
            background: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 40%, #FCD34D 60%, #F59E0B 100%)',
            backgroundSize: '200% auto',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            animation: 'buzzShimmer 3s linear infinite',
            letterSpacing: '0.01em',
            textShadow: 'none',
            filter: 'drop-shadow(0 1px 4px rgba(245,158,11,0.35))',
          }}
        >
          Feel the Buzz
        </span>
        <style>{`
          @keyframes buzzShimmer {
            0% { background-position: 0% center; }
            100% { background-position: 200% center; }
          }
          .buzz-slogan {
            will-change: background-position;
          }
        `}</style>
      </div>
    </Link>
  );
};

export default Logo;
