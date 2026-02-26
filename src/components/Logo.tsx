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
      className={`flex flex-col items-center ${className ?? ''}`}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      onClick={handleTap}
    >
      {/* Sun (far left) + Cloud */}
      <div className="flex items-center gap-1 w-full mb-1 select-none pointer-events-none">
        <span
          style={{
            fontSize: '1.1rem',
            animation: 'sunFloat 3s ease-in-out infinite',
            filter: 'drop-shadow(0 0 5px rgba(255, 200, 0, 0.7))',
            display: 'inline-block',
          }}
        >
          ☀️
        </span>
        <span
          style={{
            fontSize: '1.1rem',
            animation: 'cloudFloat 4s ease-in-out infinite',
            display: 'inline-block',
          }}
        >
          ⛅
        </span>
        <style>{`
          @keyframes sunFloat {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-3px); }
          }
          @keyframes cloudFloat {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-4px); }
          }
        `}</style>
      </div>

      <div 
        className={`transition-transform duration-150 ease-out ${
          isPressed ? 'scale-90' : 'scale-100 hover:scale-105'
        }`}
      >
        <LogoImage size="large" />
      </div>
    </Link>
  );
};

export default Logo;
